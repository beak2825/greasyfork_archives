// ==UserScript==
// @name         EzyBot - SF Cinema
// @namespace    EzyBot - SF Cinema
// @version      4.3.1
// @description  Automatically book available seats on SF Cinema.
// @author       EzyBot - อีซี่บอท
// @match        https://*.sfcinemacity.com/*
// @icon         https://ezyisezy.github.io/easy/sf.png
// @grant        none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527338/EzyBot%20-%20SF%20Cinema.user.js
// @updateURL https://update.greasyfork.org/scripts/527338/EzyBot%20-%20SF%20Cinema.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // SF World โรง 15 มีแถวแรกเริ่มจาก X - A
  // การตั้งค่าเริ่มต้น กดที่นั่งทั้งโรงตั้งแต่ X1 - G30, F1 - F28 และ E1 - A26
  // โดยเริ่มกดจากเลขที่นั่ง X15 หรือ X16

  let code = "0000 0000 0000 0000"; // ตั้งค่ารหัสหมายเลขสมาชิก SF+ 16 หลัก (เขียนแบบมีเว้นวรรคหรือ - ได้โดยไม่จำเป็นต้องลบออก)
  let showDate = "01/07/25"; // ตั้งค่าวันฉาย เขียนได้ทั้งแบบ "09/05/2025" หรือ "9/5/25" (ต้องเป็นปี ค.ศ.)
  let showTime = "00:00"; // ตั้งค่ารอบฉาย เขียนได้ทั้งแบบ "14:00" หรือ "14.00" (ต้องเขียนแบบ 24 ชั่วโมง)

  // ตั้งค่าแถวที่ต้องการกด คั่นชื่อแถวด้วยลูกน้ำ , และชื่อแถวต้องอยู่ใน ' ' (ค่าเริ่มต้นคือ กดทุกแถว ต้องลบชื่อแถวที่ไม่ต้องการกดเอง) 
  let rows = ['X', 'W', 'V', 'T', 'S', 'R', 'Q', 'P', 'N', 'M', 'L', 'K', 'J', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  // บอทจะกดเรียงจากชื่อแถวที่ตั้งค่าไว้ เช่น X > W > V > ... > B > A)

  // ตั้งค่ากลุ่มสำหรับแถว X - G (แถวกลุ่มนี้มี 30 ที่นั่ง)
  //// แถวกลุ่มแรก: แถว X (หน้าสุดติดเวที) กดตั้งแต่ X1 - X30
  let group1 = ['X']; // ตั้งค่า แถวกลุ่มแรก (ค่าเริ่มต้นคือแถว X)
  let group1seats = [1, 30]; // ตั้งค่าระยะที่นั่งที่ต้องการกดใน แถวกลุ่มแรก

  //// แถวกลุ่มอื่น: แถวอื่น ๆ นอกเหนือจากที่ตั้งค่าไว้ในกลุ่มแรก (ค่าเริ่มต้นคือแถว W - G) กดตั้งแต่ W1 - G30
  let group2seats = [1, 30]; // ตั้งค่าระยะที่นั่งที่ต้องการกดใน แถวกลุ่มอื่น

  // ตั้งค่าแถว F ตั้งแต่ F1 - F28 (แถวกลุ่มนี้มี 28 ที่นั่ง)
  let groupF = ['F']; // ห้ามแก้บรรทัดนี้
  let groupFseats = [1, 28]; // ตั้งค่าระยะที่นั่งที่ต้องการกดใน แถว F

  // ตั้งค่าแถว A-E ตั้งแต่ E1 - A26 (แถวกลุ่มนี้มี 26 ที่นั่ง)
  let groupEDCBA = ['E', 'D', 'C', 'B', 'A']; // ห้ามแก้บรรทัดนี้
  let groupEDCBAseats = [1, 26]; // ตั้งค่าระยะที่นั่งที่ต้องการกดใน แถว E-A

  // ตั้งค่าเลขที่นั่งที่จะให้เริ่มกดแต่ละในแถว ควรแก้เป็นเลขติดกัน เช่น [10, 11] หรือ [20, 21]
  let prioritySeatsConfig = {
    XtoG: [15, 16], // ค่าเริ่มต้น [15, 16] : แถว X-G มี 30 ที่นั่ง จะเริ่มกดจากเลขที่นั่ง 15 และ 16
    F: [14, 15],     // ค่าเริ่มต้น [14, 15] : แถว F มี 28 ที่นั่ง จะเริ่มกดจากเลขที่นั่ง 14 และ 15
    EtoA: [13, 14], // ค่าเริ่มต้น [13, 14] : แถว A-E มี 26 ที่นั่ง จะเริ่มกดจากเลขที่นั่ง 13 และ 14
  };

  let currentInterval = null;
  let hasClickedPromotion = false;
  let hasEnteredCode = false;
  let sessionReset = false;
  let hasSelectedShowtime = false;

  const monthMap = {
    'ม.ค.': 'Jan', 'ก.พ.': 'Feb', 'มี.ค.': 'Mar', 'เม.ย.': 'Apr',
    'พ.ค.': 'May', 'มิ.ย.': 'Jun', 'ก.ค.': 'Jul', 'ส.ค.': 'Aug',
    'ก.ย.': 'Sep', 'ต.ค.': 'Oct', 'พ.ย.': 'Nov', 'ธ.ค.': 'Dec',
    'Jan': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Apr',
    'May': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Aug': 'Aug',
    'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dec',
    '1': 'Jan', '01': 'Jan', '2': 'Feb', '02': 'Feb', '3': 'Mar', '03': 'Mar',
    '4': 'Apr', '04': 'Apr', '5': 'May', '05': 'May', '6': 'Jun', '06': 'Jun',
    '7': 'Jul', '07': 'Jul', '8': 'Aug', '08': 'Aug', '9': 'Sep', '09': 'Sep',
    '10': 'Oct', '11': 'Nov', '12': 'Dec'
  };

  function sfAlert(...messages) {
    const modal = document.createElement('div');
    modal.className = 'alertify';
    modal.innerHTML = `
      <div class="ajs-dimmer"></div>
      <div class="ajs-modal">
        <div class="ajs-dialog">
          <div class="ajs-commands">
            <button class="ajs-close"></button>
          </div>
          <div class="ajs-body">
            <div class="ajs-content">${messages.join(' ')}</div>
          </div>
          <div class="ajs-footer">
            <button class="ajs-button ajs-ok">OK</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll('.ajs-ok, .ajs-close').forEach(btn =>
      btn.onclick = () => modal.remove()
    );
  }

  function normalizeDate(dateStr) {
    const numericMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (numericMatch) {
      let [_, day, month, year] = numericMatch;
      year = year.length === 2 ? `20${year}` : year;
      day = day.padStart(2, '0');
      const normalizedMonth = monthMap[month.padStart(2, '0')] || monthMap[month];
      if (!normalizedMonth) {
        console.warn(`Invalid month in numeric date: ${month}`);
        return null;
      }
      return `${day} ${normalizedMonth} ${year}`;
    }

    const textMatch = dateStr.match(/^(\d{1,2})\s+(\S+)\s+(\d{2,4})$/);
    if (textMatch) {
      let [_, day, month, year] = textMatch;
      year = year.length === 2 ? `20${year}` : year;
      day = day.padStart(2, '0');
      const normalizedMonth = monthMap[month];
      if (!normalizedMonth) {
        console.warn(`Invalid month in text date: ${month}`);
        return null;
      }
      return `${day} ${normalizedMonth} ${year}`;
    }

    console.warn(`Invalid date format: ${dateStr}`);
    return null;
  }

  function waitForShowtimeSlickCurrent() {
    return new Promise((resolve, reject) => {
      const target = document.querySelector('.showtime-date-slide .slick-track') || document.querySelector('.showtime-date-slide') || document.body;
      const slickCurrent = document.querySelector('.showtime-date-slide .slick-track .slick-current');
      if (slickCurrent) {
        return resolve();
      }

      const observer = new MutationObserver((mutations, obs) => {
        const slickCurrent = document.querySelector('.showtime-date-slide .slick-track .slick-current');
        if (slickCurrent) {
          obs.disconnect();
          resolve();
        }
      });

      observer.observe(target, { childList: true, subtree: true });

      setTimeout(() => {
        if (!document.querySelector('.showtime-date-slide .slick-track .slick-current')) {
          observer.disconnect();
          reject(new Error("Slick-current not found"));
        }
      }, 10000);
    });
  }

  function detectLanguage() {
    const dayElement = document.querySelector('.showtime-date-slide .slick-slide h1.day');
    if (!dayElement) {
      console.warn("No day element found for language detection, defaulting to English.");
      return "English";
    }
    const dayText = dayElement.textContent.trim();
    const thaiDayNames = ["วันนี้", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์"];
    return thaiDayNames.includes(dayText) ? "Thai" : "English";
  }

  function waitForShowtimeButton(showTime, callback) {
    if (!window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/showtime\//) || hasSelectedShowtime) {
      callback();
      return;
    }

    const normalizedShowTime = showTime.replace('.', ':');
    let hasAlerted = false;
    const language = detectLanguage();

    const showtimeButtons = Array.from(document.querySelectorAll('.button-showtime'));
    if (showtimeButtons.length > 0) {
      const matchingButtons = showtimeButtons.filter(
        button => button.textContent.trim() === normalizedShowTime
      );

      if (matchingButtons.length > 1) {
        console.warn(`Multiple showtime buttons found for ${normalizedShowTime}.`);
        if (language === "Thai") {
          sfAlert("มีรอบฉาย", normalizedShowTime, "มากกว่า 1 รอบ");
        } else {
          sfAlert("Showtime", normalizedShowTime, "has multiple screenings.");
        }
        hasAlerted = true;
        return;
      } else if (matchingButtons.length === 1) {
        const targetButton = matchingButtons[0];
        targetButton.click();
        console.log(`Clicked showtime button: ${normalizedShowTime}`);
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        targetButton.dispatchEvent(clickEvent);
        hasSelectedShowtime = true;
        callback();
        return;
      } else {
        console.warn(`Showtime button for ${normalizedShowTime} not found among available showtimes.`);
        if (language === "Thai") {
          sfAlert(`ไม่พบรอบฉาย ${normalizedShowTime}`);
        } else {
          sfAlert(`Showtime ${normalizedShowTime} not found.`);
        }
        hasAlerted = true;
        return;
      }
    }

    const observer = new MutationObserver((mutations, obs) => {
      const showtimeButtons = Array.from(document.querySelectorAll('.button-showtime'));
      if (showtimeButtons.length > 0 && !hasAlerted) {
        const matchingButtons = showtimeButtons.filter(
          button => button.textContent.trim() === normalizedShowTime
        );
        if (matchingButtons.length > 1) {
          console.warn(`Multiple showtime buttons found for ${normalizedShowTime} (via observer).`);
          if (language === "Thai") {
            sfAlert("มีรอบฉาย", normalizedShowTime, "มากกว่า 1 รอบ");
          } else {
            sfAlert("Showtime", normalizedShowTime, "has multiple screenings.");
          }
          hasAlerted = true;
          obs.disconnect();
        } else if (matchingButtons.length === 1) {
          const targetButton = matchingButtons[0];
          targetButton.click();
          console.log(`Clicked showtime button: ${normalizedShowTime}`);
          const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
          targetButton.dispatchEvent(clickEvent);
          hasSelectedShowtime = true;
          obs.disconnect();
          callback();
        } else {
          console.warn(`Showtime button for ${normalizedShowTime} not found among available showtimes.`);
          if (language === "Thai") {
            sfAlert(`ไม่พบรอบฉาย ${normalizedShowTime}`);
          } else {
            sfAlert(`Showtime ${normalizedShowTime} not found.`);
          }
          hasAlerted = true;
          obs.disconnect();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function waitForLoadingToComplete(callback) {
    const interval = setInterval(() => {
      const loadingIndicator = document.querySelector("#loading");
      if (!loadingIndicator || loadingIndicator.style.display === "none") {
        clearInterval(interval);
        callback();
      }
    }, 300);
  }

  function closePopupsIfExists(deselectSeats = false) {
    const closeButtons = document.querySelectorAll(".popup-close, .ajs-close, .inner-wrap .popup-close");
    closeButtons.forEach((closeButton, index) => {
      closeButton.click();
      console.log(`Popup close button ${index + 1} clicked.`);
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
      closeButton.dispatchEvent(clickEvent);
    });

    setTimeout(() => {
      const popup = document.querySelector('.popup-close');
      if (popup) {
        popup.click();
        console.log("Retried closing popup.");
      }
    }, 100);

    if (deselectSeats) {
      unselectPreviousSelections();
      console.log("Deselected seats due to .ajs-close popup.");
    }
  }

  function unselectPreviousSelections() {
    const selectedSeats = document.querySelectorAll(".button-seat.seat-selected");
    selectedSeats.forEach((seat) => seat.click());
  }

  function waitForEnterSiteButton() {
    const enterButton = document.querySelector('.button-enter-site');
    if (enterButton) {
      enterButton.click();
      console.log("Clicked .button-enter-site");
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
      enterButton.dispatchEvent(clickEvent);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const enterButton = document.querySelector('.button-enter-site');
      if (enterButton) {
        enterButton.click();
        console.log("Clicked .button-enter-site (via observer)");
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        enterButton.dispatchEvent(clickEvent);
        obs.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      if (!document.querySelector('.button-enter-site')) {
        observer.disconnect();
        console.warn("Enter site button (.button-enter-site) not found after 10 seconds.");
      }
    }, 10000);
  }

  function clickPromotion() {
    const promotionButton = document.querySelector('.button-promotion');

    if (!promotionButton) {
      console.log('Promotion button not found');
      return false;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const promotionAnchor = document.querySelector('.discount-and-promotion .wrapper a');
      if (promotionAnchor) {
        promotionAnchor.click();
        obs.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    promotionButton.click();
    hasClickedPromotion = true;
    console.log("Promotion button clicked.");
    return true;
  }

  function enterCode() {
    let codeInput = document.querySelector('input[name="promotion_code"]');
    let codeButton = document.querySelector('button.button-continue');

    if (!codeInput || !codeButton) {
      console.log('Promotion code input or continue button not found');
      return false;
    }

    const cleanedCode = code.replace(/[\s-]/g, '');
    codeInput.value = cleanedCode;
    codeInput.dispatchEvent(new Event('input', { bubbles: true }));
    codeButton.click();
    hasEnteredCode = true;
    console.log("Entered promotion code.");
    retryEnterCode(codeButton);
    return true;
  }

  function retryEnterCode(codeButton) {
    let retryCount = 0;

    const checkPopupAndRetry = () => {
      waitForLoadingToComplete(() => {
        if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat$/)) {
          console.log("Navigated to select-seat page after entering promotion code.");
          closePromotionPopup();
          startAutoClicking();
          return;
        }

        if (!window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat\?select=event-promotion$/)) {
          console.log("Navigated away from promotion page.");
          handlePage();
          return;
        }

        const popup = document.querySelector('.ajs-dialog');
        if (popup) {
          const closeButton = document.querySelector('.ajs-dialog .ajs-close');
          if (closeButton) {
            closeButton.click();
            console.log("Closed popup during code retry.");
          } else {
            console.warn("Popup close button (.ajs-close) not found.");
          }
        }

        retryCount++;
        console.log(`Retry attempt ${retryCount} for entering promotion code`);
        setTimeout(() => {
          if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat\?select=event-promotion$/)) {
            codeButton.click();
            console.log("Retried clicking continue button for promotion code.");
            setTimeout(checkPopupAndRetry, 1500);
          } else {
            console.log("URL changed, stopping retry loop.");
            handlePage();
          }
        }, 500);
      });
    };

    setTimeout(checkPopupAndRetry, 500);
  }

  function waitForPromotionInput(callback) {
    const codeInput = document.querySelector('input[name="promotion_code"]');
    if (codeInput) {
      callback();
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const codeInput = document.querySelector('input[name="promotion_code"]');
      if (codeInput) {
        obs.disconnect();
        callback();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      if (!document.querySelector('input[name="promotion_code"]')) {
        observer.disconnect();
        console.warn("Promotion code input not found after 10 seconds.");
        if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat\?select=event-promotion$/)) {
          window.location.href = window.location.href.replace(/\?select=event-promotion$/, '');
        }
      }
    }, 10000);
  }

  function closePromotionPopup() {
    const promotionCloseButton = document.querySelector('.discount-and-promotion .close-btn');
    if (promotionCloseButton) {
      promotionCloseButton.click();
      console.log("Closed promotion popup.");
      return true;
    }
    console.log("Promotion popup close button not found.");
    return false;
  }

  function autoClickAvailableSeats() {
    if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/payment-ticket$/)) {
      console.log("Reached payment page. Script completed.");
      return;
    }

    waitForLoadingToComplete(() => {
      if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat$/)) {
        closePopupsIfExists(false);
      }

      const selectedSeats = document.querySelectorAll(".button-seat.seat-selected");
      if (selectedSeats.length > 0) {
        console.log(`Seat(s) already selected (${selectedSeats.length}), proceeding to continue.`);
        proceedToContinueButton();
        return;
      }

      const seatContainer = document.querySelector(".seat-map") || document.body;
      const observer = new MutationObserver(() => {
        const newlySelectedSeats = document.querySelectorAll(".button-seat.seat-selected");
        if (newlySelectedSeats.length > 0) {
          console.log(`Manual seat selection detected (${newlySelectedSeats.length} seats), proceeding to continue.`);
          observer.disconnect();
          if (currentInterval) {
            clearTimeout(currentInterval);
            currentInterval = null;
          }
          proceedToContinueButton();
        }
      });
      observer.observe(seatContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

      let seatToClick = null;

      for (const row of rows) {
        const availableSeats = Array.from(document.querySelectorAll(".button-seat.seat-available")).filter((seat) => {
          const seatName = seat.getAttribute("seatname");
          const seatNumber = parseInt(seatName.substring(1));

          if (group1.includes(row)) {
            return (seatName.startsWith(row) && seatNumber >= group1seats[0] && seatNumber <= group1seats[1]);
          } else if (groupEDCBA.includes(row)) {
            return (seatName.startsWith(row) && seatNumber >= groupEDCBAseats[0] && seatNumber <= groupEDCBAseats[1]);
          } else if (groupF.includes(row)) {
            return (seatName.startsWith(row) && seatNumber >= groupFseats[0] && seatNumber <= groupFseats[1]);
          } else {
            return (seatName.startsWith(row) && seatNumber >= group2seats[0] && seatNumber <= group2seats[1]);
          }
        });

        const isRowAE = ['A', 'B', 'C', 'D', 'E'].includes(row);
        const prioritySeats = row === 'F' ? prioritySeatsConfig.F : isRowAE ? prioritySeatsConfig.EtoA : prioritySeatsConfig.XtoG;
        const seatOffset = row === 'F' ? 14.5 : (isRowAE ? 13.5 : 15.5);

        if (availableSeats.length > 0) {
          const priorityAvailableSeats = availableSeats.filter(seat => {
            const seatNumber = parseInt(seat.getAttribute("seatname").substring(1));
            return prioritySeats.includes(seatNumber);
          });

          if (priorityAvailableSeats.length > 0) {
            const randomIndex = Math.floor(Math.random() * priorityAvailableSeats.length);
            seatToClick = priorityAvailableSeats[randomIndex];
            console.log(`Randomly selected priority seat: ${seatToClick.getAttribute("seatname")}`);
            break;
          }

          availableSeats.sort((a, b) => {
            const aSeatNumber = parseInt(a.getAttribute("seatname").substring(1));
            const bSeatNumber = parseInt(b.getAttribute("seatname").substring(1));
            return Math.abs(aSeatNumber - seatOffset) - Math.abs(bSeatNumber - seatOffset);
          });

          seatToClick = availableSeats[0];
          break;
        }
      }

      if (seatToClick) {
        console.log(`Clicking seat: ${seatToClick.getAttribute("seatname")}`);
        seatToClick.click();
        setTimeout(proceedToContinueButton, 50);
      } else {
        console.log("No available seats found, retrying.");
        startAutoClicking();
      }
    });
  }

  function proceedToContinueButton() {
    setTimeout(() => {
      const selectedSeats = document.querySelectorAll(".button-seat.seat-selected");
      if (selectedSeats.length > 0 && window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat$/)) {
        console.log("Seat(s) selected, skipping popup closure.");
      } else if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat$/)) {
        closePopupsIfExists(false);
      }

      const continueButton = document.querySelector(".button-continue");
      const seatSelected = document.querySelector(".button-seat.seat-selected");
      const promotionButton = document.querySelector('.button-promotion');

      let shouldEnableContinueButton = false;

      if (promotionButton) {
        const textSpans = promotionButton.querySelectorAll('span.text');
        const buttonTextArray = Array.from(textSpans).map(span => span.textContent);
        const combinedButtonText = buttonTextArray.join('');

        if (
          combinedButtonText.includes("(0)") ||
          combinedButtonText.includes("(1)") ||
          buttonTextArray.includes("ส่วนลด และโปรโมชั่น") ||
          buttonTextArray.includes("Discounts and Promotions")
        ) {
          shouldEnableContinueButton = true;
        }
      } else {
        shouldEnableContinueButton = true;
      }

      if (continueButton && seatSelected && shouldEnableContinueButton) {
        console.log("Clicking continue button.");
        continueButton.removeAttribute("disabled");
        continueButton.click();

        waitForLoadingToComplete(() => {
          if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/payment-ticket$/)) {
            console.log("Reached payment page.");
            if (currentInterval) {
              clearTimeout(currentInterval);
              currentInterval = null;
            }
            return;
          }

          const ajsClosePopup = document.querySelector(".ajs-close");
          if (ajsClosePopup) {
            console.log("Detected .ajs-close popup, closing and deselecting seats.");
            closePopupsIfExists(true);
            startAutoClicking();
          } else {
            console.log("No .ajs-close popup, retrying.");
            startAutoClicking();
          }
        });
      } else {
        console.log("Cannot proceed: Continue button or seat not ready.");
        if (!seatSelected) {
          startAutoClicking();
          const popupCheckInterval = setInterval(() => {
            if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat$/)) {
              const currentSelectedSeats = document.querySelectorAll(".button-seat.seat-selected");
              if (currentSelectedSeats.length > 0) {
                console.log("Seats selected during popup check, proceeding.");
                clearInterval(popupCheckInterval);
                proceedToContinueButton();
              } else {
                closePopupsIfExists(false);
              }
            }
          }, 1000);
          setTimeout(() => clearInterval(popupCheckInterval), 5000);
        } else {
          const observer = new MutationObserver(() => {
            const updatedContinueButton = document.querySelector(".button-continue");
            if (updatedContinueButton && !updatedContinueButton.hasAttribute("disabled")) {
              console.log("Continue button enabled, clicking.");
              updatedContinueButton.click();
              observer.disconnect();
              waitForLoadingToComplete(() => {
                if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/payment-ticket$/)) {
                  console.log("Reached payment page.");
                  if (currentInterval) {
                    clearTimeout(currentInterval);
                    currentInterval = null;
                  }
                } else if (document.querySelector(".ajs-close")) {
                  console.log("Detected .ajs-close popup, closing and deselecting seats.");
                  closePopupsIfExists(true);
                  startAutoClicking();
                } else {
                  console.log("No .ajs-close popup, retrying.");
                  startAutoClicking();
                }
              });
            }
          });
          observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
        }
      }
    }, 50);
  }

  function startAutoClicking() {
    if (currentInterval) {
      clearTimeout(currentInterval);
    }
    if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat$/)) {
      console.log("Starting auto-clicking for seats.");
      autoClickAvailableSeats();
    }
  }

  function handleShowtimeLogic() {
    if (!window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/showtime\//)) {
      return;
    }

    waitForShowtimeSlickCurrent().then(() => {
      const slides = document.querySelectorAll('.showtime-date-slide .slick-slide');
      const normalizedShowdate = normalizeDate(showDate);
      const language = detectLanguage();

      const targetSlide = Array.from(slides).find(slide => {
        const dateElement = slide.querySelector('p.date');
        const dateText = dateElement?.textContent.trim();
        const normalizedSlideDate = normalizeDate(dateText);
        return dateText && normalizedSlideDate === normalizedShowdate;
      });

      if (targetSlide) {
        targetSlide.click();
        targetSlide.querySelectorAll('div').forEach(div => div.click());
        console.log(`Selected show date: ${showDate}`);
        waitForShowtimeButton(showTime, () => {
          if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat($|\?select=event-promotion)/)) {
            handlePromotionLogic();
          }
        });
      } else {
        if (language === "Thai") {
          sfAlert(`ไม่พบวันฉาย ${showDate}`);
        } else {
          sfAlert(`Showdate ${showDate} not found.`);
        }
      }
    }).catch(error => {
      console.error(`Error in handleShowtimeLogic: ${error.message}`);
    });
  }

  function handlePromotionLogic() {
    if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat\?select=event-promotion$/)) {
      console.log("On promotion page.");
      closePopupsIfExists();

      const promotionButton = document.querySelector('.button-promotion');
      let skipPromotion = false;

      if (promotionButton) {
        const textSpans = promotionButton.querySelectorAll('span.text');
        const buttonTextArray = Array.from(textSpans).map(span => span.textContent);
        const combinedButtonText = buttonTextArray.join('');

        if (
          buttonTextArray.includes("ส่วนลด และโปรโมชั่น") ||
          buttonTextArray.includes("Discounts and Promotions") ||
          combinedButtonText.includes("(1)") ||
          combinedButtonText.includes("(0)")
        ) {
          console.log("No promotion code needed, skipping to seat selection.");
          skipPromotion = true;
          closePromotionPopup();
          if (!window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat$/)) {
            window.location.href = window.location.href.replace(/\?select=event-promotion$/, '');
          }
        }
      }

      if (!skipPromotion && !hasEnteredCode) {
        waitForPromotionInput(() => {
          if (!hasEnteredCode && enterCode()) {
            console.log("Waiting for select-seat page after code entry.");
            const observer = new MutationObserver(() => {
              if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat$/)) {
                console.log("Reached select-seat page.");
                closePromotionPopup();
                startAutoClicking();
                observer.disconnect();
              }
            });
            observer.observe(document.body, { childList: true, subtree: true });
          }
        });
      } else {
        console.log("Proceeding to seat selection.");
        closePromotionPopup();
        startAutoClicking();
      }
    } else if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat$/)) {
      console.log("On select-seat page.");
      closePopupsIfExists();

      const promotionButton = document.querySelector('.button-promotion');
      if (promotionButton) {
        const textSpans = promotionButton.querySelectorAll('span.text');
        const buttonTextArray = Array.from(textSpans).map(span => span.textContent);
        const combinedButtonText = buttonTextArray.join('');

        if (
          buttonTextArray.includes("ส่วนลด และโปรโมชั่น") ||
          buttonTextArray.includes("Discounts and Promotions") ||
          combinedButtonText.includes("(1)") ||
          combinedButtonText.includes("(0)")
        ) {
          console.log("No promotion code needed, selecting seats.");
          startAutoClicking();
          return;
        }
      }

      if (!hasClickedPromotion || sessionReset) {
        if (clickPromotion()) {
          hasEnteredCode = false;
          const observer = new MutationObserver(() => {
            if (window.location.href.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat\?select=event-promotion$/)) {
              handlePromotionLogic();
              observer.disconnect();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        } else {
          startAutoClicking();
        }
      } else {
        startAutoClicking();
      }
    }
  }

  function handlePage() {
    const currentUrl = window.location.href;
    console.log(`Navigated to: ${currentUrl}`);

    if (
      !currentUrl.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/showtime\//) &&
      !currentUrl.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat($|\?select=event-promotion)/) &&
      !currentUrl.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/payment-ticket$/)
    ) {
      console.log("Unrecognized page, resetting script.");
      hasClickedPromotion = false;
      hasEnteredCode = false;
      hasSelectedShowtime = false;
      sessionReset = false;
      if (currentInterval) {
        clearTimeout(currentInterval);
        currentInterval = null;
      }
    }

    if (currentUrl.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/showtime\//)) {
      hasSelectedShowtime = false;
    }

    const homepageRegex = /^https?:\/\/([^\/]*\.)?sfcinemacity\.com(\/)?(\?.*)?$/;
    if (homepageRegex.test(currentUrl)) {
      console.log("On homepage, waiting for enter site button.");
      waitForEnterSiteButton();
      return;
    }

    if (currentUrl.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/showtime\//)) {
      handleShowtimeLogic();
    } else if (currentUrl.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/select-seat($|\?select=event-promotion)/)) {
      handlePromotionLogic();
    } else if (currentUrl.match(/^https?:\/\/([^\/]*\.)?sfcinemacity\.com\/payment-ticket$/)) {
      console.log("Reached payment page. Script completed.");
      hasClickedPromotion = false;
      hasEnteredCode = false;
      sessionReset = true;
      hasSelectedShowtime = false;
    } else {
      console.log(`Unrecognized URL: ${currentUrl}, script paused.`);
      if (currentInterval) {
        clearTimeout(currentInterval);
        currentInterval = null;
      }
    }
  }

  console.log("Script started.");
  handlePage();

  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      console.log(`URL changed to: ${window.location.href}`);
      lastUrl = window.location.href;
      handlePage();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('popstate', () => {
    handlePage();
  });
})();