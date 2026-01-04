// ==UserScript==
// @name         EzyBot - The Concert (Beta)
// @namespace    EzyBot - The Concert (Beta)
// @version      1.4.1
// @description  Let me go to The Concert!
// @author       EzyBot - อีซี่บอท
// @match        https://*.theconcert.com/*
// @icon         https://ezyisezy.github.io/easy/thecon.png
// @grant        none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/540165/EzyBot%20-%20The%20Concert%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540165/EzyBot%20-%20The%20Concert%20%28Beta%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ตั้งค่าให้กดปุ่ม ชำระเงิน อัตโนมัติ
  let autoOrder = true; // หากต้องการปิด แก้เป็น autoOrder = false

  // ตั้งค่ารอบแสดงและจำนวนบัตร
  let showRound = "1"; // รอบแสดง ตามลำดับวันแสดง 1, 2, 3 ฯลฯ
  let numSeats = "1"; // จำนวนที่นั่งที่ต้องการกด

  // ตั้งค่าโซน
  let zonePrice = "2000"; // ราคาของโซน (งานที่บัตร 1000 ขายจริงที่ราคา ฿1,019 สามารถใส่เป็น "1000" ได้)
  let zonePriceOrder = "1"; // ลำดับของปุ่มราคา กรณีปุ่มราคาเดียวกันมีหลายปุ่ม ("1" = ปุ่มแรก, "2" = ปุ่มที่สอง)
  let zones = "A1,A2"; // ชื่อโซนที่ต้องการกด (ต้องเป็นโซนที่มีในราคาโซนที่ตั้งค่า)

  // ตั้งค่าวิธีกดบัตร
  let seatingType = "random"; // ทุกวิธีจะเลือกที่นั่งติดกันให้ทั้งหมด
  //  seatingType = "front"; // กดจากแถวหน้าสุด (มีโอกาสกดชนปานกลาง-มาก)
  //  seatingType = "random"; // กดแบบสุ่มแถว (มีโอกาสกดชนน้อย)
  //  seatingType = "last"; // กดจากแถวหลังสุด (มีโอกาสกดชนน้อย-ปานกลาง)

  // ไม่แนะนำให้แก้ไขโค้ดหลังจากบรรทัดนี้
  const seatBlue = 'seat-blue.png';
  const seatGray = 'seat-gray2.png';
  const seatLoad = 'seat-load2.svg';
  const seatSold = 'seat-red-paid.png';
  const seatMark = 'seate-mark.png';
  const xlinkNS = 'http://www.w3.org/1999/xlink';

  let startTime = sessionStorage.getItem('startTime') || '';
  let isRunning = false;
  let isSelectingSeats = false;
  let isDeselectingSeats = false;
  let isProcessingClick = false;
  let hasManualNonSoldOutClick = false;
  let manualSeatClickDetected = false;
  let isDeselectedByButton = false;
  let hasEnoughSeats = false;

  let selectedCount = 0;
  let seatSelectionRetryCount = 0;
  const grayMonitorInterval = 100;
  const maxMonitorAttempts = 3000;
  const maxSeatSelectionRetries = 3;

  let targetZones = zones.split(",");
  let clickedSeatIds = new Set();
  let loadingSeatIds = new Set();
  let selectedSeatLabels = new Map();
  const refreshIntervals = new Map();

  function getRandomDelay() {
    return Math.floor(Math.random() * 51) + 100;
  }

  function getClickDelay() {
    return Math.floor(Math.random() * 6) + 50;
  }

  function waitForRoundModal() {
    return new Promise((resolve) => {
      const modal = document.querySelector('#round-concert');
      const roundItems = document.querySelectorAll('.modal-body .items .row');

      if (modal && roundItems.length > 0) {
        resolve();
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const modal = document.querySelector('#round-concert');
        const roundItems = document.querySelectorAll('.modal-body .items .row');

        if (modal && roundItems.length > 0) {
          obs.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
    });
  }

  function autoSelectRound() {
    return new Promise((resolve, reject) => {
      if (!window.location.hash.includes('#selectround')) {
        resolve();
        return;
      }

      waitForRoundModal()
        .then(() => {
          const roundItems = document.querySelectorAll('.modal-body .items .row');
          if (roundItems.length === 0) {
            console.warn('No round items found for selection');
            reject(new Error('No round items found'));
            return;
          }

          const targetRoundIndex = parseInt(showRound, 10) - 1;
          if (targetRoundIndex < 0 || targetRoundIndex >= roundItems.length) {
            console.warn(`Invalid round number ${showRound}, available rounds: ${roundItems.length}`);
            reject(new Error(`Invalid round number ${showRound}`));
            return;
          }

          const targetRound = roundItems[targetRoundIndex];
          const roundButton = targetRound.querySelector('.btn.btn-submit');

          if (!roundButton) {
            console.warn(`No button found for round ${showRound}`);
            reject(new Error(`No button found for round ${showRound}`));
            return;
          }

          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          setTimeout(() => {
            roundButton.dispatchEvent(clickEvent);
            console.log(`Selected round ${showRound}`);
            resolve();
          }, 0);
        })
        .catch(error => {
          console.error('Error waiting for round modal:', error);
          reject(error);
        });
    });
  }

  function createSeatLabelMap(allSeats) {
    const seatLabelMap = new Map();
    const textElements = document.querySelectorAll('text tspan');

    textElements.forEach(tspan => {
      const textElement = tspan.parentElement;
      const transform = textElement.getAttribute('transform');
      const match = transform ? transform.match(/matrix\(([^)]+)\)/) : null;
      if (match) {
        const [a, b, c, d, tx, ty] = match[1].split(',').map(parseFloat);
        const seatId = `${tx},${ty}`;
        const seatLabel = tspan.textContent.trim();
        if (seatLabel && seatLabel !== '') {
          seatLabelMap.set(seatId, seatLabel);
        }
      }
    });

    allSeats.forEach(seat => {
      const href = seat.getAttributeNS(xlinkNS, 'href') || 'none';
      if (href.includes(seatMark) || href.includes(seatBlue) || href.includes(seatGray) || href.includes(seatLoad)) {
        const transform = seat.getAttribute('transform');
        const match = transform ? transform.match(/matrix\(([^)]+)\)/) : null;
        if (match) {
          const [a, b, c, d, tx, ty] = match[1].split(',').map(parseFloat);
          const seatId = `${tx},${ty}`;
          if (!seatLabelMap.has(seatId)) {
            let closestLabel = '';
            let closestTx = null;
            let minDistance = Infinity;
            seatLabelMap.forEach((label, id) => {
              const [otherTx, otherTy] = id.split(',').map(parseFloat);
              if (otherTy === ty) {
                const distance = Math.abs(otherTx - tx);
                if (distance < minDistance) {
                  minDistance = distance;
                  closestLabel = label;
                  closestTx = otherTx;
                }
              }
            });

            if (closestLabel && closestTx !== null) {
              const numberMatch = closestLabel.match(/\d+/);
              if (numberMatch) {
                const closestNumber = parseInt(numberMatch[0], 10);
                const closestPrefix = closestLabel.replace(/\d+/, '');
                const txDiff = (tx - closestTx) / 48;
                const estimatedNumber = closestNumber + Math.round(txDiff);
                if (!isNaN(estimatedNumber) && estimatedNumber > 0) {
                  const estimatedLabel = `${closestPrefix}${estimatedNumber}`;
                  seatLabelMap.set(seatId, estimatedLabel);
                } else {
                  seatLabelMap.set(seatId, `Fallback_${seatId}`);
                }
              } else {
                seatLabelMap.set(seatId, `Fallback_${seatId}`);
              }
            } else {
              seatLabelMap.set(seatId, `Fallback_${seatId}`);
            }
          }
        }
      }
    });

    return seatLabelMap;
  }

  function collectSeats(allSeats, seatLabelMap, filterByTargetZones = false) {
    const availableSeats = [];
    const graySeats = new Map();
    const selectedSeats = [];
    const loadingSeatIds = new Set();
    const uniqueSeatIds = new Set();

    for (const seatImage of allSeats) {
      const href = seatImage.getAttributeNS(xlinkNS, 'href') || 'none';
      const transform = seatImage.getAttribute('transform');
      const match = transform ? transform.match(/matrix\(([^)]+)\)/) : null;
      if (!match) {
        continue;
      }

      const [a, b, c, d, tx, ty] = match[1].split(',').map(parseFloat);
      const seatId = `${tx},${ty}`;
      if (uniqueSeatIds.has(seatId)) {
        continue;
      }
      uniqueSeatIds.add(seatId);

      const seatLabel = seatLabelMap.get(seatId) || `Fallback_${seatId}`;

      if (filterByTargetZones) {
        const isInTargetZone = targetZones.some(zone => seatLabel.startsWith(zone));
        if (!isInTargetZone && !href.includes(seatMark)) {
          continue;
        }
      }

      const seatData = { element: seatImage, tx, ty, seatId, seatLabel, href };
      if (href.includes(seatBlue) && seatLabel && !seatLabel.startsWith('Unknown_')) {
        availableSeats.push(seatData);
      } else if (href.includes(seatGray) && seatLabel && !seatLabel.startsWith('Unknown_')) {
        graySeats.set(seatImage, seatData);
      } else if (href.includes(seatMark)) {
        selectedSeats.push({ ...seatData, href });
      } else if (href.includes(seatLoad) && seatLabel && !seatLabel.startsWith('Unknown_')) {
        loadingSeatIds.add(seatId);
      }
    }

    return { availableSeats, graySeats, selectedSeats, loadingSeatIds };
  }

  function groupSeatsByRow(availableSeats) {
    const seatsByRow = {};
    for (const seat of availableSeats) {
      if (!seatsByRow[seat.ty]) seatsByRow[seat.ty] = [];
      seatsByRow[seat.ty].push(seat);
    }

    return seatsByRow;
  }

  function isContiguousGroup(seatLabels, seats) {
    if (seatLabels.length <= 2) return true;

    const seatData = seatLabels.map((label, idx) => {
      const match = label.match(/^([A-Za-z]+)(\d+)$/);
      return {
        label,
        prefix: match ? match[1] : label.startsWith('Fallback_') ? 'Fallback' : '',
        number: match ? parseInt(match[2], 10) : 0,
        tx: seats[idx].tx,
        ty: seats[idx].ty
      };
    });

    const firstSeat = seatData[0];
    const sameRow = seatData.every(seat => seat.ty === firstSeat.ty);
    if (!sameRow) {
      return false;
    }

    const allFallback = seatData.every(seat => seat.prefix === 'Fallback');
    if (allFallback) {
      seatData.sort((a, b) => a.tx - b.tx);
      for (let i = 1; i < seatData.length; i++) {
        const diff = Math.abs(seatData[i].tx - seatData[i - 1].tx);
        if (diff > 48.1 || diff < 47.9) {
          return false;
        }
      }
      return true;
    }

    const samePrefix = seatData.every(seat => seat.prefix === firstSeat.prefix);
    if (!samePrefix) {
      return false;
    }

    seatData.sort((a, b) => a.tx - b.tx);

    for (let i = 1; i < seatData.length; i++) {
      const diff = Math.abs(seatData[i].tx - seatData[i - 1].tx);
      if (diff > 48.1 || diff < 47.9) {
        return false;
      }
    }

    return true;
  }

  function isAdjacentToSelected(seat, selectedSeats, numSeats) {
    if (!selectedSeats.length) return true;
    const prefix = selectedSeats[0].seatLabel.replace(/\d+/, '');
    if (!seat.seatLabel.startsWith(prefix)) return false;
    const seatNum = parseInt(seat.seatLabel.match(/\d+/)[0]);
    const selectedNumbers = selectedSeats
      .filter(s => s.ty === seat.ty && s.seatLabel.startsWith(prefix))
      .map(s => parseInt(s.seatLabel.match(/\d+/)[0]))
      .sort((a, b) => a - b);

    const isAdjacent = selectedNumbers.includes(seatNum - 1) || selectedNumbers.includes(seatNum + 1);
    if (!isAdjacent) return false;

    if (numSeats > 2) {
      const testGroup = [...selectedSeats.map(s => s.seatLabel), seat.seatLabel];
      return isContiguousGroup(testGroup);
    }

    return true;
  }

  function revalidateSelectedSeats(allSeats, seatLabelMap) {
    selectedCount = 0;
    hasEnoughSeats = false;
    const seatsToClick = parseInt(numSeats, 10);
    const selectedSeatsSet = new Set();

    for (const seatImage of allSeats) {
      const href = seatImage.getAttributeNS(xlinkNS, 'href') || 'none';
      const transform = seatImage.getAttribute('transform');
      const match = transform ? transform.match(/matrix\(([^)]+)\)/) : null;
      if (match) {
        const [a, b, c, d, tx, ty] = match[1].split(',').map(parseFloat);
        const seatId = `${tx},${ty}`;
        const seatLabel = seatLabelMap.get(seatId) || '';
        if (href.includes(seatMark) && seatLabel && !selectedSeatsSet.has(seatId)) {
          selectedSeatsSet.add(seatId);
          selectedCount++;
        }
      }
    }

    hasEnoughSeats = selectedCount >= seatsToClick;
  }

  async function clickSeats(seatsToClickArray, isInitial = false) {
    let clickedCount = 0;
    const clickedSeats = [];

    for (let i = 0; i < seatsToClickArray.length; i++) {
      const seat = seatsToClickArray[i];
      if (hasEnoughSeats || selectedCount >= parseInt(numSeats, 10) || clickedSeatIds.has(seat.seatId) || loadingSeatIds.has(seat.seatId)) {
        continue;
      }

      const rect = seat.element.getBoundingClientRect();
      const eventOptions = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: rect.left + (rect.width / 2),
        clientY: rect.top + (rect.height / 2),
        screenX: window.screenX + rect.left + (rect.width / 2),
        screenY: window.screenY + rect.top + (rect.height / 2),
        button: 0,
        buttons: 1,
        detail: 1,
        composed: true
      };

      const mouseDown = new MouseEvent('mousedown', eventOptions);
      const mouseUp = new MouseEvent('mouseup', eventOptions);
      const click = new MouseEvent('click', eventOptions);

      try {
        let delay = isInitial ? getClickDelay() : (i === 0 ? 0 : getClickDelay());
        await new Promise(resolve => setTimeout(() => {
          seat.element.dispatchEvent(mouseDown);
          seat.element.dispatchEvent(click);
          seat.element.dispatchEvent(mouseUp);
          clickedSeatIds.add(seat.seatId);
          loadingSeatIds.add(seat.seatId);
          selectedSeatLabels.set(seat.seatId, seat.seatLabel);
          clickedSeats.push(seat);
          clickedCount++;
          resolve();
        }, delay));
      } catch (error) {
        clickedSeatIds.delete(seat.seatId);
        loadingSeatIds.delete(seat.seatId);
        selectedSeatLabels.delete(seat.seatId);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    const allSeats = document.querySelectorAll('image[width="48"][height="48"]');
    const seatLabelMap = createSeatLabelMap(allSeats);
    revalidateSelectedSeats(allSeats, seatLabelMap);

    for (const seat of clickedSeats) {
      const newHref = seat.element.getAttributeNS(xlinkNS, 'href') || 'none';
      if (newHref.includes(seatMark)) {
        loadingSeatIds.delete(seat.seatId);
        console.log(`Confirmed seat ${seat.seatLabel} as selected`);
      } else {
        loadingSeatIds.delete(seat.seatId);
        clickedSeatIds.delete(seat.seatId);
        selectedSeatLabels.delete(seat.seatId);
      }
    }

    return clickedCount;
  }

  function updateToSelectElement(possibleSeats, selectedSeats, allSeats, seatLabelMap) {
    const boxSeat = document.querySelector('#select-variant .box-seat');
    if (!boxSeat) {
      console.warn('Box seat element not found for to-select update');
      return;
    }

    const existingToSelect = boxSeat.querySelector('.seat-select.to-select');
    const seatsToClick = parseInt(numSeats, 10);
    if (possibleSeats.length === 0 || selectedSeats.length >= seatsToClick) {
      if (existingToSelect) {
        existingToSelect.remove();
      }
      return;
    }

    if (existingToSelect) {
      return;
    }

    const toSelectDiv = document.createElement('div');
    toSelectDiv.className = 'seat-select to-select';
    toSelectDiv.setAttribute('data-v-20c8022e', '');

    const textSelectDiv = document.createElement('div');
    textSelectDiv.className = 'seat-text-select to-select';
    textSelectDiv.setAttribute('data-v-20c8022e', '');
    const small = document.createElement('small');
    small.setAttribute('data-v-20c8022e', '');
    small.textContent = 'รอหลุด:';
    textSelectDiv.appendChild(small);

    const numberSelectDiv = document.createElement('div');
    numberSelectDiv.className = 'seat-number-select';
    numberSelectDiv.setAttribute('data-v-20c8022e', '');

    const soldSeats = new Set();
    allSeats.forEach(seat => {
      const href = seat.getAttributeNS(xlinkNS, 'href') || 'none';
      if (href.includes(seatSold)) {
        const transform = seat.getAttribute('transform');
        const match = transform ? transform.match(/matrix\(([^)]+)\)/) : null;
        if (match) {
          const [a, b, c, d, tx, ty] = match[1].split(',').map(parseFloat);
          const seatId = `${tx},${ty}`;
          const seatLabel = seatLabelMap.get(seatId) || `Fallback_${seatId}`;
          soldSeats.add(seatLabel);
        }
      }
    });

    const selectedSeatLabelsSet = new Set(selectedSeats.map(s => s.seatLabel));
    const uniqueSeats = new Set();
    possibleSeats.forEach(seat => {
      if (!soldSeats.has(seat.seatLabel) && !selectedSeatLabelsSet.has(seat.seatLabel)) {
        uniqueSeats.add(seat.seatLabel);
      }
    });

    if (uniqueSeats.size > 0) {
      uniqueSeats.forEach(seatLabel => {
        const span = document.createElement('span');
        span.setAttribute('data-v-20c8022e', '');
        span.textContent = seatLabel;
        numberSelectDiv.appendChild(span);
      });

      toSelectDiv.appendChild(textSelectDiv);
      toSelectDiv.appendChild(numberSelectDiv);

      const seatSelect = boxSeat.querySelector('.seat-select');
      if (seatSelect) {
        boxSeat.insertBefore(toSelectDiv, seatSelect.nextSibling);
      } else {
        boxSeat.appendChild(toSelectDiv);
        console.warn('No .seat-select found, appended to-select element to .box-seat');
      }
    } else {
    }

    if (!document.querySelector('style#custom-to-select')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'custom-to-select';
      styleTag.textContent = `
      .seat-select.to-select span {
        background: #c4c4c4;
      }
    `;
      document.head.appendChild(styleTag);
    }
  }

  function updateToSelectSpans(possibleSeats, selectedSeats, allSeats, seatLabelMap) {
    const boxSeat = document.querySelector('#select-variant .box-seat');
    if (!boxSeat) {
      console.warn('Box seat element not found for to-select spans update');
      return false;
    }

    const toSelectDiv = boxSeat.querySelector('.seat-select.to-select');
    const seatsToClick = parseInt(numSeats, 10);

    if (!toSelectDiv || selectedSeats.length >= seatsToClick || possibleSeats.length === 0) {
      if (toSelectDiv) {
        toSelectDiv.remove();
      }
      return false;
    }

    const numberSelectDiv = toSelectDiv.querySelector('.seat-number-select');
    if (!numberSelectDiv) {
      console.warn('Seat-number-select not found in to-select element');
      return false;
    }

    const soldSeats = new Set();
    allSeats.forEach(seat => {
      const href = seat.getAttributeNS(xlinkNS, 'href') || '';
      if (href.includes(seatSold)) {
        const transform = seat.getAttribute('transform');
        if (!transform) {
          console.warn(`Seat with href ${href} has no transform attribute, skipping`);
          return;
        }
        const match = transform.match(/matrix\(([^)]+)\)/);
        if (!match || !match[1]) {
          console.warn(`Seat with href ${href} has invalid transform format: ${transform}, skipping`);
          return;
        }
        try {
          const [a, b, c, d, tx, ty] = match[1].split(',').map(parseFloat);
          if (isNaN(tx) || isNaN(ty)) {
            console.warn(`Invalid tx/ty values for seat with transform ${transform}, skipping`);
            return;
          }
          const seatId = `${tx},${ty}`;
          const seatLabel = seatLabelMap.get(seatId) || `Fallback_${seatId}`;
          soldSeats.add(seatLabel);
        } catch (e) {
          console.error(`Error processing transform for seat with href ${href}: ${e.message}`);
        }
      }
    });

    const selectedSeatLabels = new Set(selectedSeats.map(s => s.seatLabel));
    const uniqueSeats = new Set();
    possibleSeats.forEach(seat => {
      if (!soldSeats.has(seat.seatLabel) && !selectedSeatLabels.has(seat.seatLabel)) {
        uniqueSeats.add(seat.seatLabel);
      }
    });

    const currentSpans = Array.from(numberSelectDiv.querySelectorAll('span')).map(span => span.textContent);
    const newSeatLabels = Array.from(uniqueSeats).sort();

    if (currentSpans.sort().join(',') === newSeatLabels.join(',')) {
      return true;
    }

    numberSelectDiv.innerHTML = '';
    if (uniqueSeats.size > 0) {
      uniqueSeats.forEach(seatLabel => {
        const span = document.createElement('span');
        span.setAttribute('data-v-20c8022e', '');
        span.textContent = seatLabel;
        numberSelectDiv.appendChild(span);
      });
      return true;
    } else {
      toSelectDiv.remove();
      return false;
    }
  }

  async function deselectAllSeats() {
    if (isDeselectingSeats) {
      return;
    }
    isDeselectingSeats = true;
    isDeselectedByButton = true;

    if (refreshIntervals.has('grayMonitor')) {
      clearInterval(refreshIntervals.get('grayMonitor'));
      refreshIntervals.delete('grayMonitor');
    }

    const maxRetries = 2;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 0));

      const allSeats = document.querySelectorAll('image[width="48"][height="48"]');
      const seatLabelMap = createSeatLabelMap(allSeats);
      const { selectedSeats } = collectSeats(allSeats, seatLabelMap);

      if (selectedSeats.length === 0 && retryCount === 0) {
        retryCount++;
        continue;
      }

      if (selectedSeats.length === 0) {
        break;
      }

      const processedSeatIds = new Set();
      const seatsToDeselect = selectedSeats.filter(seat => {
        if (processedSeatIds.has(seat.seatId)) {
          return false;
        }
        processedSeatIds.add(seat.seatId);
        return true;
      }).map(seat => ({
        element: Array.from(allSeats).find(img => {
          const transform = img.getAttribute('transform');
          const match = transform ? transform.match(/matrix\(([^)]+)\)/) : null;
          if (match) {
            const [a, b, c, d, tx, ty] = match[1].split(',').map(parseFloat);
            return `${tx},${ty}` === `${seat.tx},${seat.ty}`;
          }
          return false;
        }),
        seatId: `${seat.tx},${seat.ty}`,
        seatLabel: selectedSeatLabels.get(seat.seatId) || seatLabelMap.get(seat.seatId) || `Fallback_${seat.seatId}`
      }));

      let deselectSuccess = true;
      for (const seat of seatsToDeselect) {
        if (!seat.element) {
          deselectSuccess = false;
          continue;
        }

        const rect = seat.element.getBoundingClientRect();
        const eventOptions = {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: rect.left + (rect.width / 2),
          clientY: rect.top + (rect.height / 2),
          screenX: window.screenX + rect.left + (rect.width / 2),
          screenY: window.screenY + rect.top + (rect.height / 2),
          button: 0,
          buttons: 1,
          detail: 1,
          composed: true
        };

        const mouseDown = new MouseEvent('mousedown', eventOptions);
        const mouseUp = new MouseEvent('mouseup', eventOptions);
        const click = new MouseEvent('click', eventOptions);

        try {
          await new Promise(resolve => setTimeout(() => {
            seat.element.dispatchEvent(mouseDown);
            seat.element.dispatchEvent(click);
            seat.element.dispatchEvent(mouseUp);
            console.log(`Deselected seat ${seat.seatLabel}`);
            resolve();
          }, getClickDelay()));
        } catch (error) {
          deselectSuccess = false;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedSeats = document.querySelectorAll('image[width="48"][height="48"]');
      const updatedSeatLabelMap = createSeatLabelMap(updatedSeats);
      revalidateSelectedSeats(updatedSeats, updatedSeatLabelMap);

      if (selectedCount === 0) {
        break;
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    clickedSeatIds.clear();
    loadingSeatIds.clear();
    selectedSeatLabels.clear();
    selectedCount = 0;
    hasEnoughSeats = false;
    manualSeatClickDetected = false;
    isDeselectingSeats = false;

    const boxSeat = document.querySelector('#select-variant .box-seat');
    const toSelectDiv = boxSeat?.querySelector('.seat-select.to-select');
    if (toSelectDiv) {
      toSelectDiv.remove();
    }
  }

  function selectNewSeats(numSeats, isInitialSelection = false, monitorGray = false, filterByTargetZones = false, forceDeselect = false) {
    if (refreshIntervals.has('grayMonitor')) {
      clearInterval(refreshIntervals.get('grayMonitor'));
      refreshIntervals.delete('grayMonitor');
    }

    const shouldDeselect = forceDeselect || selectedCount === 0;
    return (shouldDeselect ? deselectAllSeats() : Promise.resolve()).then(async () => {
      const allSeats = document.querySelectorAll('image[width="48"][height="48"]');
      if (allSeats.length === 0) {
        console.warn('No seats found for selection');
        seatSelectionRetryCount++;
        return selectedCount > 0;
      }

      const seatsToClick = parseInt(numSeats, 10);
      if (isNaN(seatsToClick) || seatsToClick < 1 || seatsToClick > 10) {
        console.warn(`Invalid number of seats: ${numSeats} (must be 1-10)`);
        seatSelectionRetryCount++;
        return selectedCount > 0;
      }

      const seatLabelMap = createSeatLabelMap(allSeats);
      let { availableSeats, graySeats, selectedSeats } = collectSeats(allSeats, seatLabelMap, filterByTargetZones);

      if (availableSeats.length < seatsToClick - selectedCount && !(seatsToClick === 2 && availableSeats.length >= 1)) {
        console.warn(`Insufficient available seats: ${availableSeats.length} found, ${seatsToClick - selectedCount} needed`);
        seatSelectionRetryCount++;
        return selectedCount > 0;
      }

      if (seatsToClick === 1) {
        let seatToClick = null;
        if (seatingType === "front") {
          availableSeats.sort((a, b) => a.ty - b.ty || a.tx - b.tx);
          seatToClick = availableSeats[0];
        } else if (seatingType === "random") {
          const randomIndex = Math.floor(Math.random() * availableSeats.length);
          seatToClick = availableSeats[randomIndex];
        } else if (seatingType === "last") {
          availableSeats.sort((a, b) => b.ty - a.ty || b.tx - b.tx);
          seatToClick = availableSeats[0];
        }

        if (seatToClick && !clickedSeatIds.has(seatToClick.seatId) && !loadingSeatIds.has(seatToClick.seatId)) {
          const clicked = await clickSeats([seatToClick], isInitialSelection);
          if (clicked > 0) {
            console.log(`Selected single seat: ${seatToClick.seatLabel}`);
            revalidateSelectedSeats(allSeats, seatLabelMap);
            seatSelectionRetryCount = 0;
            updateToSelectElement([], [], allSeats, seatLabelMap);
            return hasEnoughSeats;
          }
        }
        console.warn('No suitable single seat found');
        seatSelectionRetryCount++;
        return selectedCount > 0;
      }

      if (seatsToClick === 2) {
        const seatsByRow = groupSeatsByRow(availableSeats);
        let rowGroups = [];
        const rows = Object.keys(seatsByRow).map(ty => parseFloat(ty)).sort((a, b) => a - b);

        for (const ty of rows) {
          const rowSeats = seatsByRow[ty].sort((a, b) => a.tx - b.tx);
          for (let i = 0; i <= rowSeats.length - 2; i++) {
            const group = rowSeats.slice(i, i + 2);
            if (group.length === 2) {
              const isAdjacent = Math.abs(group[1].tx - group[0].tx) < 48.1 && Math.abs(group[1].tx - group[0].tx) > 0.1;
              const seatLabels = group.map(s => s.seatLabel);
              if (isAdjacent && isContiguousGroup(seatLabels, group)) {
                rowGroups.push(group);
              }
            }
          }
        }

        if (rowGroups.length > 0) {
          if (seatingType === "front") {
            rowGroups.sort((a, b) => a[0].ty - b[0].ty || a[0].tx - b[0].tx);
          } else if (seatingType === "random") {
            const randomIndex = Math.floor(Math.random() * rowGroups.length);
            rowGroups = [rowGroups[randomIndex]];
          } else if (seatingType === "last") {
            rowGroups.sort((a, b) => b[0].ty - a[0].ty || b[0].tx - b[0].tx);
          }

          const selectedGroup = rowGroups[0];
          if (selectedGroup && selectedGroup.every(seat => !clickedSeatIds.has(seat.seatId) && !loadingSeatIds.has(seat.seatId))) {
            const clicked = await clickSeats(selectedGroup, isInitialSelection);
            if (clicked === 2) {
              console.log(`Selected both seats: ${selectedGroup.map(s => s.seatLabel).join(', ')}`);
              revalidateSelectedSeats(allSeats, seatLabelMap);
              seatSelectionRetryCount = 0;
              updateToSelectElement([], [], allSeats, seatLabelMap);
              return hasEnoughSeats;
            } else if (clicked === 1) {
              console.log(`Selected one seat: ${selectedGroup.find(s => clickedSeatIds.has(s.seatId))?.seatLabel || 'unknown'}`);
              revalidateSelectedSeats(allSeats, seatLabelMap);
            }
          }
        }

        let hasSelectedOne = selectedCount === 1;
        let adjacentGrayPairs = [];

        if (!hasSelectedOne && availableSeats.length >= 1) {
          let candidateSeats = availableSeats.filter(seat => {
            const prefix = seat.seatLabel.replace(/\d+/, '');
            const seatNum = parseInt(seat.seatLabel.match(/\d+/)[0], 10);
            return Array.from(graySeats.values()).some(gSeat => {
              const gPrefix = gSeat.seatLabel.replace(/\d+/, '');
              const gNum = parseInt(gSeat.seatLabel.match(/\d+/)[0], 10);
              return gPrefix === prefix && (gNum === seatNum - 1 || gNum === seatNum + 1) && gSeat.ty === seat.ty;
            });
          });

          if (candidateSeats.length > 0) {
            if (seatingType === "front") {
              candidateSeats.sort((a, b) => a.ty - b.ty || a.tx - b.tx);
            } else if (seatingType === "random") {
              const randomIndex = Math.floor(Math.random() * candidateSeats.length);
              candidateSeats = [candidateSeats[randomIndex]];
            } else if (seatingType === "last") {
              candidateSeats.sort((a, b) => b.ty - a.ty || b.tx - b.tx);
            }

            const seatToClick = candidateSeats[0];
            if (seatToClick && !clickedSeatIds.has(seatToClick.seatId) && !loadingSeatIds.has(seatToClick.seatId)) {
              const clicked = await clickSeats([seatToClick], isInitialSelection);
              if (clicked > 0) {
                revalidateSelectedSeats(allSeats, seatLabelMap);
                hasSelectedOne = true;
              }
            }
          }
        }

        if (!hasSelectedOne) {
          const graySeatsArray = Array.from(graySeats.values());
          const grayByRow = {};
          for (const seat of graySeatsArray) {
            if (!grayByRow[seat.ty]) grayByRow[seat.ty] = [];
            grayByRow[seat.ty].push(seat);
          }

          const grayRows = Object.keys(grayByRow).map(ty => parseFloat(ty)).sort((a, b) => a - b);
          for (const ty of grayRows) {
            const rowSeats = grayByRow[ty].sort((a, b) => a.tx - b.tx);
            for (let i = 0; i <= rowSeats.length - 2; i++) {
              const group = rowSeats.slice(i, i + 2);
              if (group.length === 2) {
                const isAdjacent = Math.abs(group[1].tx - group[0].tx) < 48.1 && Math.abs(group[1].tx - group[0].tx) > 0.1;
                const seatLabels = group.map(s => s.seatLabel);
                if (isAdjacent && isContiguousGroup(seatLabels, group)) {
                  adjacentGrayPairs.push(group);
                }
              }
            }
          }
        }

        if (hasSelectedOne || adjacentGrayPairs.length > 0) {
          let monitorAttempts = 0;
          let toSelectInitialized = false;
          const recentlyClickedSeats = new Set();

          const interval = setInterval(async () => {
            if (hasEnoughSeats || selectedCount >= seatsToClick) {
              console.log(`Reached target of ${seatsToClick} seats, stopping monitor`);
              clearInterval(interval);
              refreshIntervals.delete('grayMonitor');
              updateToSelectElement([], [], allSeats, seatLabelMap);
              return;
            }

            if (monitorAttempts >= maxMonitorAttempts) {
              console.warn('Gray seat monitor timeout, stopping');
              clearInterval(interval);
              refreshIntervals.delete('grayMonitor');
              seatSelectionRetryCount++;
              updateToSelectElement([], [], allSeats, seatLabelMap);
              return selectedCount > 0;
            }
            monitorAttempts++;

            const newAllSeats = document.querySelectorAll('image[width="48"][height="48"]');
            const newSeatLabelMap = createSeatLabelMap(newAllSeats);
            let { availableSeats: newAvailableSeats, graySeats: newGraySeats, selectedSeats: newSelectedSeats } = collectSeats(newAllSeats, newSeatLabelMap, filterByTargetZones);

            let possibleSeats = [];
            if (selectedCount === 1 && newSelectedSeats.length > 0) {
              const selectedSeat = newSelectedSeats[0];
              const prefix = selectedSeat.seatLabel.replace(/\d+/, '');
              const seatNum = parseInt(selectedSeat.seatLabel.match(/\d+/)[0], 10);
              possibleSeats = newAvailableSeats.filter(seat => {
                const otherPrefix = seat.seatLabel.replace(/\d+/, '');
                const otherNum = parseInt(seat.seatLabel.match(/\d+/)[0], 10);
                return otherPrefix === prefix && (otherNum === seatNum - 1 || otherNum === seatNum + 1) && seat.ty === selectedSeat.ty;
              });

              const grayAdjacentSeats = Array.from(newGraySeats.values()).filter(gSeat => {
                const gPrefix = gSeat.seatLabel.replace(/\d+/, '');
                const gNum = parseInt(gSeat.seatLabel.match(/\d+/)[0], 10);
                return gPrefix === prefix && (gNum === seatNum - 1 || gNum === seatNum + 1) && gSeat.ty === selectedSeat.ty;
              });
              possibleSeats.push(...grayAdjacentSeats);

              if (!toSelectInitialized && possibleSeats.length > 0) {
                updateToSelectElement(possibleSeats, newSelectedSeats, newAllSeats, newSeatLabelMap);
                toSelectInitialized = true;
              } else if (toSelectInitialized) {
                updateToSelectSpans(possibleSeats, newSelectedSeats, newAllSeats, newSeatLabelMap);
              }

              const validSeatToClick = possibleSeats.find(seat =>
                seat.href.includes(seatBlue) &&
                !clickedSeatIds.has(seat.seatId) &&
                !loadingSeatIds.has(seat.seatId) &&
                !recentlyClickedSeats.has(seat.seatId)
              );

              if (validSeatToClick) {
                const clicked = await clickSeats([validSeatToClick], false);
                if (clicked > 0) {
                  console.log(`Selected adjacent seat to ${newSelectedSeats[0].seatLabel}: ${validSeatToClick.seatLabel}`);
                  recentlyClickedSeats.add(validSeatToClick.seatId);
                  setTimeout(() => recentlyClickedSeats.delete(validSeatToClick.seatId), 500);
                  revalidateSelectedSeats(newAllSeats, newSeatLabelMap);
                  if (hasEnoughSeats) {
                    clearInterval(interval);
                    refreshIntervals.delete('grayMonitor');
                    updateToSelectElement([], newSelectedSeats, newAllSeats, newSeatLabelMap);
                    return;
                  }
                }
                updateToSelectSpans(possibleSeats, newSelectedSeats, newAllSeats, newSeatLabelMap);
              }
            } else {
              let availablePairs = [];
              const newSeatsByRow = groupSeatsByRow(newAvailableSeats);
              const newRows = Object.keys(newSeatsByRow).map(ty => parseFloat(ty)).sort((a, b) => a - b);
              for (const ty of newRows) {
                const rowSeats = newSeatsByRow[ty].sort((a, b) => a.tx - b.tx);
                for (let i = 0; i <= rowSeats.length - 2; i++) {
                  const group = rowSeats.slice(i, i + 2);
                  if (group.length === 2) {
                    const isAdjacent = Math.abs(group[1].tx - group[0].tx) < 48.1 && Math.abs(group[1].tx - group[0].tx) > 0.1;
                    const seatLabels = group.map(s => s.seatLabel);
                    if (isAdjacent && isContiguousGroup(seatLabels, group)) {
                      availablePairs.push(group);
                    }
                  }
                }
              }

              if (availablePairs.length === 0) {
                let candidateSeats = newAvailableSeats.filter(seat => {
                  const prefix = seat.seatLabel.replace(/\d+/, '');
                  const seatNum = parseInt(seat.seatLabel.match(/\d+/)[0], 10);
                  return Array.from(newGraySeats.values()).some(gSeat => {
                    const gPrefix = gSeat.seatLabel.replace(/\d+/, '');
                    const gNum = parseInt(gSeat.seatLabel.match(/\d+/)[0], 10);
                    return gPrefix === prefix && (gNum === seatNum - 1 || gNum === seatNum + 1) && gSeat.ty === seat.ty;
                  });
                });

                if (candidateSeats.length > 0) {
                  if (seatingType === "front") {
                    candidateSeats.sort((a, b) => a.ty - b.ty || a.tx - b.tx);
                  } else if (seatingType === "random") {
                    const randomIndex = Math.floor(Math.random() * candidateSeats.length);
                    candidateSeats = [candidateSeats[randomIndex]];
                  } else if (seatingType === "last") {
                    candidateSeats.sort((a, b) => b.ty - a.ty || b.tx - b.tx);
                  }

                  const seatToClick = candidateSeats[0];
                  if (!clickedSeatIds.has(seatToClick.seatId) && !loadingSeatIds.has(seatToClick.seatId) && !recentlyClickedSeats.has(seatToClick.seatId)) {
                    const clicked = await clickSeats([seatToClick], false);
                    if (clicked > 0) {
                      console.log(`Selected one seatBlue from gray pair: ${seatToClick.seatLabel}`);
                      recentlyClickedSeats.add(seatToClick.seatId);
                      setTimeout(() => recentlyClickedSeats.delete(seatToClick.seatId), 500);
                      revalidateSelectedSeats(newAllSeats, newSeatLabelMap);
                    }
                    updateToSelectSpans(candidateSeats, newSelectedSeats, newAllSeats, newSeatLabelMap);
                  }
                } else {
                  possibleSeats = adjacentGrayPairs.flat();
                  if (!toSelectInitialized && possibleSeats.length > 0) {
                    updateToSelectElement(possibleSeats, newSelectedSeats, newAllSeats, newSeatLabelMap);
                    toSelectInitialized = true;
                  } else if (toSelectInitialized) {
                    updateToSelectSpans(possibleSeats, newSelectedSeats, newAllSeats, newSeatLabelMap);
                  }
                }
              } else {
                if (seatingType === "front") {
                  availablePairs.sort((a, b) => a[0].ty - b[0].ty || a[0].tx - b[0].tx);
                } else if (seatingType === "random") {
                  const randomIndex = Math.floor(Math.random() * availablePairs.length);
                  availablePairs = [availablePairs[randomIndex]];
                } else if (seatingType === "last") {
                  availablePairs.sort((a, b) => b[0].ty - a[0].ty || b[0].tx - b[0].tx);
                }

                const selectedGroup = availablePairs[0];
                if (selectedGroup && selectedGroup.every(seat => !clickedSeatIds.has(seat.seatId) && !loadingSeatIds.has(seat.seatId) && !recentlyClickedSeats.has(seat.seatId))) {
                  const clicked = await clickSeats(selectedGroup, false);
                  if (clicked === 2) {
                    console.log(`Selected both seats: ${selectedGroup.map(s => s.seatLabel).join(', ')}`);
                    selectedGroup.forEach(seat => {
                      recentlyClickedSeats.add(seat.seatId);
                      setTimeout(() => recentlyClickedSeats.delete(seat.seatId), 1000);
                    });
                    revalidateSelectedSeats(newAllSeats, newSeatLabelMap);
                    clearInterval(interval);
                    refreshIntervals.delete('grayMonitor');
                    updateToSelectElement([], newSelectedSeats, newAllSeats, newSeatLabelMap);
                    return;
                  } else if (clicked === 1) {
                    console.log(`Selected one seat from pair: ${selectedGroup.find(s => clickedSeatIds.has(s.seatId))?.seatLabel || 'unknown'}`);
                    selectedGroup.forEach(seat => {
                      if (clickedSeatIds.has(seat.seatId)) {
                        recentlyClickedSeats.add(seat.seatId);
                        setTimeout(() => recentlyClickedSeats.delete(seat.seatId), 1000);
                      }
                    });
                    revalidateSelectedSeats(newAllSeats, newSeatLabelMap);
                  }
                  updateToSelectSpans(selectedGroup, newSelectedSeats, newAllSeats, newSeatLabelMap);
                }
              }
            }

            if (newGraySeats.size === 0 && loadingSeatIds.size === 0 && selectedCount === 0) {
              console.warn('No more gray or loading seats to monitor, stopping');
              clearInterval(interval);
              refreshIntervals.delete('grayMonitor');
              seatSelectionRetryCount++;
              updateToSelectElement([], newSelectedSeats, newAllSeats, newSeatLabelMap);
              return;
            } else if (newGraySeats.size === 0 && loadingSeatIds.size === 0) {
              console.log(`Retaining ${selectedCount}/${seatsToClick} seats, no further gray seats to monitor`);
              clearInterval(interval);
              refreshIntervals.delete('grayMonitor');
              updateToSelectElement([], newSelectedSeats, newAllSeats, newSeatLabelMap);
              return selectedCount > 0;
            }
          }, grayMonitorInterval);
          refreshIntervals.set('grayMonitor', interval);
          return selectedCount > 0;
        }

        console.warn('No suitable seats or gray pairs found for numSeats=2');
        seatSelectionRetryCount++;
        return selectedCount > 0;
      }

      let attemptCount = 0;
      const maxAttempts = 2;

      while (attemptCount < maxAttempts && !hasEnoughSeats) {
        attemptCount++;

        const updatedSeats = document.querySelectorAll('image[width="48"][height="48"]');
        const updatedSeatLabelMap = createSeatLabelMap(updatedSeats);
        let { availableSeats: updatedAvailable, selectedSeats: newSelectedSeats } = collectSeats(updatedSeats, updatedSeatLabelMap, filterByTargetZones);
        console.log(`Attempt ${attemptCount}: Found ${updatedAvailable.length} available seats`);
        const seatsByRow = groupSeatsByRow(updatedAvailable);

        let rowGroups = [];
        const rows = Object.keys(seatsByRow).map(ty => parseFloat(ty)).sort((a, b) => a - b);
        for (const ty of rows) {
          const rowSeats = seatsByRow[ty].sort((a, b) => a.tx - b.tx);
          const remainingSeatsNeeded = seatsToClick - selectedCount;

          const possibleGroups = [];
          for (let i = 0; i <= rowSeats.length - remainingSeatsNeeded; i++) {
            const group = rowSeats.slice(i, i + remainingSeatsNeeded);
            if (group.length === remainingSeatsNeeded) {
              const isAdjacent = group.every((seat, idx, arr) => {
                if (idx === 0) return true;
                const diff = Math.abs(seat.tx - arr[idx - 1].tx);
                return Math.abs(diff - 48) < 0.1;
              });
              const seatLabels = group.map(s => s.seatLabel);
              if (isAdjacent && (seatsToClick <= 2 || isContiguousGroup(seatLabels, group))) {
                possibleGroups.push(group);
              }
            }
          }
          if (possibleGroups.length > 0) {
            rowGroups.push(...possibleGroups);
          }
        }

        if (rowGroups.length === 0) {
          if (selectedCount > 0) {
            console.log(`Partial selection of ${selectedCount}/${seatsToClick} seats achieved, retaining selection`);
            updateToSelectElement([], newSelectedSeats, updatedSeats, updatedSeatLabelMap);
            break;
          }
          if (attemptCount >= maxAttempts) {
            console.warn(`No suitable groups found after ${maxAttempts} attempts`);
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        if (seatingType === "front") {
          rowGroups.sort((a, b) => a[0].ty - b[0].ty || a[0].tx - b[0].tx);
        } else if (seatingType === "random") {
          const randomIndex = Math.floor(Math.random() * rowGroups.length);
          rowGroups = [rowGroups[randomIndex]];
        } else if (seatingType === "last") {
          rowGroups.sort((a, b) => b[0].ty - a[0].ty || b[0].tx - b[0].tx);
        }

        const selectedGroup = rowGroups[0];
        if (selectedGroup && selectedGroup.every(seat => !clickedSeatIds.has(seat.seatId) && !loadingSeatIds.has(seat.seatId))) {
          const clicked = await clickSeats(selectedGroup, isInitialSelection);
          if (clicked > 0) {
            console.log(`Selected ${clicked} seats: ${selectedGroup.map(s => s.seatLabel).join(', ')}`);
            revalidateSelectedSeats(updatedSeats, updatedSeatLabelMap);
            if (hasEnoughSeats) {
              seatSelectionRetryCount = 0;
              updateToSelectElement([], newSelectedSeats, updatedSeats, updatedSeatLabelMap);
              return true;
            }
          }
        }

        console.log(`No row with ${seatsToClick - selectedCount} adjacent seats selected in attempt ${attemptCount}`);
        if (selectedCount > 0 || attemptCount >= maxAttempts) {
          if (selectedCount > 0) {
            console.log(`Partial selection of ${selectedCount}/${seatsToClick} seats achieved, retaining selection`);
            updateToSelectElement([], newSelectedSeats, updatedSeats, updatedSeatLabelMap);
          }
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (selectedCount < seatsToClick && (monitorGray || attemptCount >= maxAttempts)) {
        console.log(`Starting gray seat monitor with ${selectedCount}/${seatsToClick} seats selected`);
        let monitorAttempts = 0;
        let toSelectInitialized = false;

        const interval = setInterval(async () => {
          if (hasEnoughSeats || selectedCount >= seatsToClick) {
            console.log(`Reached target of ${seatsToClick} selected seats, stopping monitor`);
            clearInterval(interval);
            refreshIntervals.delete('grayMonitor');
            updateToSelectElement([], [], allSeats, seatLabelMap);
            return;
          }

          if (monitorAttempts >= maxMonitorAttempts) {
            console.warn('Gray seat monitor timeout, stopping');
            clearInterval(interval);
            refreshIntervals.delete('grayMonitor');
            seatSelectionRetryCount++;
            updateToSelectElement([], [], allSeats, seatLabelMap);
            return selectedCount > 0;
          }
          monitorAttempts++;

          const newAllSeats = document.querySelectorAll('image[width="48"][height="48"]');
          const newSeatLabelMap = createSeatLabelMap(newAllSeats);
          let { availableSeats: newAvailableSeats, graySeats: newGraySeats, selectedSeats: newSelectedSeats } = collectSeats(newAllSeats, newSeatLabelMap, filterByTargetZones);

          if (newAvailableSeats.length < seatsToClick - selectedCount) {
            console.log(`Insufficient available seats (${newAvailableSeats.length}/${seatsToClick - selectedCount}), continuing monitor`);
            updateToSelectElement([], newSelectedSeats, newAllSeats, newSeatLabelMap);
            return selectedCount > 0;
          }

          const seatsByRow = groupSeatsByRow(newAvailableSeats);
          let rowGroups = [];
          const rows = Object.keys(seatsByRow).map(ty => parseFloat(ty)).sort((a, b) => a - b);

          if (selectedCount > 0 && newSelectedSeats.length > 0) {
            const selectedRows = [...new Set(newSelectedSeats.map(seat => seat.ty))];
            const prefix = newSelectedSeats[0].seatLabel.replace(/\d+/, '');
            for (const ty of selectedRows) {
              const rowSeats = (seatsByRow[ty] || []).sort((a, b) => a.tx - b.tx);
              const remainingSeatsNeeded = seatsToClick - selectedCount;

              const possibleGroups = [];
              for (let i = 0; i <= rowSeats.length - remainingSeatsNeeded; i++) {
                const group = rowSeats.slice(i, i + remainingSeatsNeeded);
                if (group.length === remainingSeatsNeeded) {
                  const isAdjacent = group.every((seat, idx, arr) => {
                    if (idx === 0) return true;
                    const diff = Math.abs(seat.tx - arr[idx - 1].tx);
                    return Math.abs(diff - 48) < 0.1;
                  });
                  const isAdjacentToSelectedGroup = group.every(seat => isAdjacentToSelected(seat, newSelectedSeats, seatsToClick));
                  if (isAdjacent && isAdjacentToSelectedGroup) {
                    const testGroup = [...newSelectedSeats.map(s => s.seatLabel), ...group.map(s => s.seatLabel)];
                    if (seatsToClick <= 2 || isContiguousGroup(testGroup, group.concat(newSelectedSeats))) {
                      possibleGroups.push(group);
                    }
                  }
                }
              }
              if (possibleGroups.length > 0) {
                rowGroups.push(...possibleGroups);
              }
            }
          } else {
            for (const ty of rows) {
              const rowSeats = seatsByRow[ty].sort((a, b) => a.tx - b.tx);
              const remainingSeatsNeeded = seatsToClick - selectedCount;

              const possibleGroups = [];
              for (let i = 0; i <= rowSeats.length - remainingSeatsNeeded; i++) {
                const group = rowSeats.slice(i, i + remainingSeatsNeeded);
                if (group.length === remainingSeatsNeeded) {
                  const isAdjacent = group.every((seat, idx, arr) => {
                    if (idx === 0) return true;
                    const diff = Math.abs(seat.tx - arr[idx - 1].tx);
                    return Math.abs(diff - 48) < 0.1;
                  });
                  const seatLabels = group.map(s => s.seatLabel);
                  if (isAdjacent && (seatsToClick <= 2 || isContiguousGroup(seatLabels, group))) {
                    possibleGroups.push(group);
                  }
                }
              }
              if (possibleGroups.length > 0) {
                rowGroups.push(...possibleGroups);
              }
            }
          }

          if (!toSelectInitialized && rowGroups.length > 0) {
            updateToSelectElement(rowGroups.flat(), newSelectedSeats, newAllSeats, newSeatLabelMap);
            toSelectInitialized = true;
          } else if (toSelectInitialized) {
            updateToSelectSpans(rowGroups.flat(), newSelectedSeats, newAllSeats, newSeatLabelMap);
          }

          if (rowGroups.length > 0) {
            if (seatingType === "front") {
              rowGroups.sort((a, b) => a[0].ty - b[0].ty || a[0].tx - b[0].tx);
            } else if (seatingType === "random") {
              const randomIndex = Math.floor(Math.random() * rowGroups.length);
              rowGroups = [rowGroups[randomIndex]];
            } else if (seatingType === "last") {
              rowGroups.sort((a, b) => b[0].ty - a[0].ty || b[0].tx - b[0].tx);
            }

            const selectedGroup = rowGroups[0];
            if (selectedGroup && selectedGroup.every(seat => !clickedSeatIds.has(seat.seatId) && !loadingSeatIds.has(seat.seatId))) {
              const clicked = await clickSeats(selectedGroup, false);
              if (clicked > 0) {
                console.log(`Selected ${clicked} seats: ${selectedGroup.map(s => s.seatLabel).join(', ')}`);
                revalidateSelectedSeats(newAllSeats, newSeatLabelMap);
                if (hasEnoughSeats) {
                  clearInterval(interval);
                  refreshIntervals.delete('grayMonitor');
                  updateToSelectElement([], newSelectedSeats, newAllSeats, newSeatLabelMap);
                  return;
                }
              }
            }
          }

          if (newGraySeats.size === 0 && loadingSeatIds.size === 0 && selectedCount === 0) {
            console.warn('No more gray or loading seats to monitor, stopping');
            clearInterval(interval);
            refreshIntervals.delete('grayMonitor');
            seatSelectionRetryCount++;
            updateToSelectElement([], newSelectedSeats, newAllSeats, newSeatLabelMap);
            return;
          } else if (newGraySeats.size === 0 && loadingSeatIds.size === 0) {
            console.log(`Retaining ${selectedCount}/${seatsToClick} seats, no further gray seats to monitor`);
            clearInterval(interval);
            refreshIntervals.delete('grayMonitor');
            updateToSelectElement([], newSelectedSeats, newAllSeats, newSeatLabelMap);
            return selectedCount > 0;
          }
        }, grayMonitorInterval);
        refreshIntervals.set('grayMonitor', interval);
        return selectedCount > 0;
      }

      return selectedCount > 0;
    });
  }

  async function autoClickAvailableSeat(numSeats, monitorGray = false, isInitialSelection = false, filterByTargetZones = false) {
    if (isSelectingSeats) {
      console.log('Seat selection in progress, skipping');
      return false;
    }

    if (isDeselectingSeats) {
      console.log('Deselection in progress, skipping seat selection');
      return false;
    }

    if (seatSelectionRetryCount >= maxSeatSelectionRetries && !isInitialSelection) {
      console.warn(`Maximum seat selection retries (${maxSeatSelectionRetries}) reached, stopping`);
      return false;
    }

    if (isDeselectedByButton && !manualSeatClickDetected && !isInitialSelection) {
      console.log('Seats were deselected by button, waiting for manual seat click');
      return false;
    }

    isSelectingSeats = true;

    try {
      let result = false;
      let retryWaitAttempts = 0;
      const maxRetryWaitAttempts = 3;

      while (!result && retryWaitAttempts < maxRetryWaitAttempts) {
        try {
          result = await selectNewSeats(numSeats, isInitialSelection, monitorGray, filterByTargetZones);
        } catch (error) {
          console.error(`Seat selection attempt failed: ${error.message}`);
          retryWaitAttempts++;
          if (retryWaitAttempts < maxRetryWaitAttempts) {
            console.log(`Retrying seat selection after ${retryWaitAttempts}/${maxRetryWaitAttempts} failures`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            console.warn(`Maximum retry wait attempts (${maxRetryWaitAttempts}) reached`);
            throw error;
          }
        }
      }

      if (!result && seatSelectionRetryCount < maxSeatSelectionRetries) {
        console.log(`Retrying seat selection after failure, retry count: ${seatSelectionRetryCount}/${maxSeatSelectionRetries}`);
        seatSelectionRetryCount++;
        return await autoClickAvailableSeat(numSeats, monitorGray, true, filterByTargetZones);
      }

      return result;
    } catch (error) {
      console.error('Error in seat selection:', error);
      seatSelectionRetryCount++;
      throw error;
    } finally {
      isSelectingSeats = false;
    }
  }

  function autoClickPrice() {
    return new Promise((resolve, reject) => {
      const priceButtons = document.querySelectorAll('#varaints-box .group-pricing a.btn');
      if (priceButtons.length === 0) {
        console.warn('No price buttons found');
        reject(new Error('No price buttons found'));
        return;
      }

      function clickButton(button, priceText) {
        return new Promise((resolveClick, rejectClick) => {
          try {
            if (button.dataset.clicked) {
              resolveClick();
              return;
            }

            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            });

            button.dataset.clicked = 'true';

            setTimeout(() => {
              button.dispatchEvent(clickEvent);
              console.log(`Clicked price: ${priceText}`);
              resolveClick();
            }, getRandomDelay());
          } catch (error) {
            console.error(`Error clicking price ${priceText}:`, error);
            rejectClick(error);
          }
        });
      }

      const basePrice = parseInt(zonePrice, 10);
      const targetOrder = parseInt(zonePriceOrder, 10) || 1;
      const matchingButtons = [];

      for (const [index, button] of Array.from(priceButtons).entries()) {
        const priceText = button.textContent.trim();
        const priceValue = parseInt(priceText.replace(/[฿,]/g, ''), 10);

        if (priceValue >= basePrice && priceValue <= basePrice + 50) {
          matchingButtons.push({ button, priceText });
        }
      }

      if (matchingButtons.length === 0) {
        console.warn(`No price button within range ${basePrice} - ${basePrice + 50} found`);
        reject(new Error(`No price button within range ${basePrice} - ${basePrice + 50} found`));
        return;
      }

      const targetIndex = Math.min(targetOrder - 1, matchingButtons.length - 1);
      const { button, priceText } = matchingButtons[targetIndex];

      clickButton(button, priceText)
        .then(resolve)
        .catch(reject);
    });
  }

  function getZonePriority(targetZone, availableZones) {
    const normalizedTarget = targetZone.toLowerCase();
    const exactMatch = availableZones.find(zone => zone.toLowerCase() === normalizedTarget);
    if (exactMatch) return exactMatch;

    const hasNumericSuffix = /(\D+)(\d+)/.test(normalizedTarget);
    let hyphenated, unhyphenated, alternateFormat;

    if (hasNumericSuffix) {
      hyphenated = normalizedTarget.includes('-')
        ? normalizedTarget
        : normalizedTarget.replace(/(\D+)(\d+)/, '$1-$2');
      unhyphenated = normalizedTarget.includes('-')
        ? normalizedTarget.replace('-', '')
        : normalizedTarget;
      alternateFormat = normalizedTarget.includes('-') ? unhyphenated : hyphenated;
    } else {
      alternateFormat = normalizedTarget;
    }

    const alternateMatch = availableZones.find(zone => zone.toLowerCase() === alternateFormat);
    return alternateMatch || null;
  }

  function scrollToBottomZoneList() {
    return new Promise((resolve) => {
      const zoneBox = document.querySelector('#zone-box')
      if (!zoneBox) {
        resolve();
        return;
      }

      const attemptScroll = () => {
        let zoneItems = document.querySelectorAll('.zone-item');
        if (zoneItems.length > 0) {
          const lastZone = zoneItems[zoneItems.length - 1];
          lastZone.scrollIntoView({ behavior: 'auto', block: 'end' });
        }
        zoneBox.scrollTop = zoneBox.scrollHeight;
        const scrollEvent = new Event('scroll', { bubbles: true, cancelable: true });
        zoneBox.dispatchEvent(scrollEvent);
        const wheelEvent = new WheelEvent('wheel', { bubbles: true, deltaY: 100 });
        zoneBox.dispatchEvent(wheelEvent);
      };

      const waitForZoneListReady = () => {
        return new Promise((resolveWait) => {
          if (zoneBox.scrollHeight > 0 || document.querySelector('.zone-item')) {
            resolveWait();
            return;
          }
          const observer = new MutationObserver(() => {
            if (zoneBox.scrollHeight > 0 || document.querySelector('.zone-item')) {
              observer.disconnect();
              resolveWait();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
          setTimeout(() => {
            observer.disconnect();
            resolveWait();
          }, 500);
        });
      };

      const checkZones = () => {
        const currentZoneItems = document.querySelectorAll('.zone-item');
        const availableZones = Array.from(currentZoneItems).map(item => {
          const badge = item.querySelector('.badge-zone');
          return badge ? badge.textContent.trim() : null;
        }).filter(Boolean);
        const targetZone = getZonePriority(targetZones[0], availableZones);
        const targetZoneFound = !!targetZone;
        return { currentZoneItems, targetZoneFound, targetZone };
      };

      waitForZoneListReady().then(() => {
        attemptScroll();
        let { currentZoneItems, targetZoneFound, targetZone } = checkZones();
        if (targetZoneFound) {
          resolve();
          return;
        }

        let lastZoneCount = currentZoneItems.length;
        let attempts = 0;
        const maxAttempts = 1;
        const interval = setInterval(() => {
          const { currentZoneItems, targetZoneFound, targetZone } = checkZones();

          if (targetZoneFound) {
            console.log(`Target zone ${targetZone} found`);
            clearInterval(interval);
            resolve();
          } else if (currentZoneItems.length > 0 && currentZoneItems.length === lastZoneCount && zoneBox.scrollTop > 0) {
            console.log('Zone list stabilized, proceeding');
            clearInterval(interval);
            resolve();
          } else {
            lastZoneCount = currentZoneItems.length;
            if (zoneBox.scrollTop === 0 && zoneBox.scrollHeight > zoneBox.clientHeight) {
              attemptScroll();
            }
            attempts++;
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              resolve();
            }
          }
        }, 50);
      });
    });
  }

  function waitForZoneList() {
    return new Promise((resolve, reject) => {
      const zoneItems = document.querySelectorAll('.zone-item');
      if (zoneItems.length > 0) {
        const availableZones = Array.from(zoneItems).map(item => {
          const badge = item.querySelector('.badge-zone');
          return badge ? badge.textContent.trim() : null;
        }).filter(Boolean);
        if (availableZones.length > 0) {
          resolve();
          return;
        }
      }

      const maxAttempts = 2;
      let attempts = 0;
      const interval = setInterval(() => {
        const zoneItems = document.querySelectorAll('.zone-item');
        const availableZones = Array.from(zoneItems).map(item => {
          const badge = item.querySelector('.badge-zone');
          return badge ? badge.textContent.trim() : null;
        }).filter(Boolean);
        if (zoneItems.length > 0 && availableZones.length > 0) {
          clearInterval(interval);
          resolve();
        }
        attempts++;
        if (attempts >= maxAttempts) {
          console.warn('Zone list did not load within timeout');
          clearInterval(interval);
          reject(new Error('Zone list did not load within timeout'));
        }
      }, 200);
    });
  }

  function autoClickZones(isInitialRun = false) {
    if (isProcessingClick) {
      console.log('Click processing in progress, skipping zone click');
      return Promise.resolve(false);
    }

    isProcessingClick = true;

    return scrollToBottomZoneList()
      .then(() => new Promise(resolve => setTimeout(resolve, getRandomDelay())))
      .then(() => waitForZoneList())
      .then(() => new Promise(resolve => setTimeout(resolve, getRandomDelay())))
      .then(() => attemptZoneClick())
      .catch(error => {
        console.error('Error in zone handling sequence:', error);
        isProcessingClick = false;
        return false;
      })
      .finally(() => {
        isProcessingClick = false;
      });

    function attemptZoneClick() {
      const zoneItems = document.querySelectorAll('.zone-item');
      if (zoneItems.length === 0) {
        console.warn('No zone items found, waiting for manual zone click');
        return false;
      }

      const availableZones = Array.from(zoneItems).map(item => {
        const badge = item.querySelector('.badge-zone');
        return badge ? badge.textContent.trim() : null;
      }).filter(Boolean);

      let zoneFound = false;

      for (const targetZone of targetZones) {
        const matchedZone = getZonePriority(targetZone, availableZones);
        if (!matchedZone) {
          console.log(`No matching zone found for ${targetZone}`);
          continue;
        }

        zoneFound = true;
        const matchingZoneItems = Array.from(zoneItems).filter(item => {
          const badge = item.querySelector('.badge-zone');
          return badge && badge.textContent.trim() === matchedZone;
        });

        for (const [index, item] of matchingZoneItems.entries()) {
          const zoneName = item.querySelector('.badge-zone').textContent.trim();
          const soldOut = item.querySelector('.sold-out-text');

          if (!soldOut) {
            const clickable = item.querySelector('.fa-angle-right');
            if (clickable) {
              setTimeout(() => {
                item.scrollIntoView({ behavior: 'auto', block: 'center' });
              }, getRandomDelay());
              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
              });
              setTimeout(() => {
                clickable.dispatchEvent(clickEvent);
              }, getRandomDelay());
              return true;
            } else {
              console.warn(`Zone ${zoneName} (index ${index}): No clickable element found`);
              continue;
            }
          } else {
            const soldOutText = soldOut.textContent.trim();
            if (soldOutText.includes('เริ่มขาย') || soldOutText.includes('Sales start')) {
              console.log(`Zone ${zoneName} (index ${index}): Not on sales yet - ${soldOutText}`);
              setTimeout(() => {
                item.scrollIntoView({ behavior: 'auto', block: 'center' });
                console.log(`Scrolled to zone: ${zoneName} (index ${index})`);
              }, getRandomDelay());

              const zoomRefresh = document.querySelector('#zoomrefresh');
              if (zoomRefresh) {
                setTimeout(() => {
                  zoomRefresh.click();
                  console.log(`Clicked refresh for zone ${zoneName}`);
                  setTimeout(() => {
                    autoClickPrice().then(() => {
                      setTimeout(() => {
                        autoClickZones();
                      }, getRandomDelay());
                    });
                  }, 5000);
                }, getRandomDelay());
              } else {
                console.warn(`Refresh button not found for zone ${zoneName} - ${soldOutText}`);
              }
              return false;
            } else {
              console.log(`Zone ${zoneName} (index ${index}): Unavailable - ${soldOutText}`);
              continue;
            }
          }
        }
      }

      if (!zoneFound) {
        console.warn(`No target zones (${targetZones.join(', ')}) found, waiting for manual zone click`);
        return false;
      }

      console.warn(`All target zones (${targetZones.join(', ')}) unavailable, waiting for manual zone click`);
      return false;
    }
  }

  function createControlButtons() {
    let buttonContainer = document.querySelector('#button-wrapper');
    const selectVariant = document.querySelector('#select-variant');
    const boxPlaceOrder = selectVariant ? selectVariant.querySelector('.box-placeorder') : null;
    const isBoxPlaceOrderLoaded = !!boxPlaceOrder;
    let isDeselectButtonProcessing = false;
    let isSelectNewButtonProcessing = false;

    const updateWidths = (wrapper, deselectButton, selectNewButton) => {
      const boxPlaceOrder = document.querySelector('#select-variant .box-placeorder');
      let wrapperWidth = '535.469px';
      let buttonWidth = '259.735px';
      if (boxPlaceOrder) {
        const computedStyle = window.getComputedStyle(boxPlaceOrder);
        const width = parseFloat(computedStyle.width);
        if (!isNaN(width)) {
          wrapperWidth = `${width}px`;
          const gapPx = 16;
          buttonWidth = `${(width - gapPx) / 2}px`;
        }
      }
      if (wrapper) wrapper.style.width = wrapperWidth;
      if (deselectButton) deselectButton.style.width = buttonWidth;
      if (selectNewButton) selectNewButton.style.width = buttonWidth;
    };

    const updateButtonState = (deselectButton, selectNewButton) => {
      const seatNumberSelect = document.querySelector('#select-variant .seat-number-select');
      const isEnabled = !!seatNumberSelect;
      if (deselectButton) {
        deselectButton.disabled = !isEnabled;
        deselectButton.style.pointerEvents = isEnabled && !isDeselectButtonProcessing ? 'auto' : 'none';
      }
      if (selectNewButton) {
        selectNewButton.disabled = !isEnabled;
        selectNewButton.style.pointerEvents = isEnabled && !isSelectNewButtonProcessing ? 'auto' : 'none';
      }
    };

    if (buttonContainer) {
      buttonContainer.style.display = isBoxPlaceOrderLoaded ? 'flex' : 'none';
      const deselectButton = buttonContainer.querySelector('button:nth-child(1)');
      const selectNewButton = buttonContainer.querySelector('button:nth-child(2)');
      updateWidths(buttonContainer, deselectButton, selectNewButton);
      updateButtonState(deselectButton, selectNewButton);
      return;
    }

    if (isBoxPlaceOrderLoaded) {
      createButtons();
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const selectVariant = document.querySelector('#select-variant');
      const boxPlaceOrder = selectVariant ? selectVariant.querySelector('.box-placeorder') : null;
      if (selectVariant && boxPlaceOrder) {
        obs.disconnect();
        createButtons();
      } else if (!selectVariant || !boxPlaceOrder) {
        const existingContainer = document.querySelector('#button-wrapper');
        if (existingContainer) {
          existingContainer.style.display = 'none';
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      if (!document.querySelector('#button-wrapper')) {
        console.warn('Timeout: Control buttons not created after 10 seconds');
        observer.disconnect();
      }
    }, 10000);

    function createButtons() {
      if (document.querySelector('#button-wrapper')) {
        return;
      }

      const selectVariant = document.querySelector('#select-variant');
      if (!selectVariant) {
        console.warn('Select variant element disappeared during button creation');
        return;
      }

      buttonContainer = document.createElement('div');
      buttonContainer.id = 'button-wrapper';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '1rem';
      buttonContainer.style.boxSizing = 'border-box';
      buttonContainer.style.marginBottom = '0px';
      buttonContainer.style.zIndex = '1000';
      buttonContainer.style.position = 'absolute';
      buttonContainer.style.bottom = '110px';

      const deselectButton = document.createElement('button');
      deselectButton.textContent = 'เลิกเลือกที่นั่งนี้';
      deselectButton.style.backgroundColor = 'rgb(255, 77, 77)';
      deselectButton.style.color = 'rgb(255, 255, 255)';
      deselectButton.style.fontWeight = '600';
      deselectButton.style.borderRadius = '24px';
      deselectButton.style.height = '44px';
      deselectButton.style.border = 'none';
      deselectButton.style.cursor = 'pointer';
      deselectButton.style.fontFamily = '"FC Friday", "Helvetica Neue", Helvetica, Arial, sans-serif';
      deselectButton.style.fontSize = '16px';
      deselectButton.style.transition = 'color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out';
      deselectButton.disabled = true;
      deselectButton.style.pointerEvents = 'none';
      deselectButton.replaceWith(deselectButton.cloneNode(true));
      const newDeselectButton = document.querySelector('#button-wrapper button:nth-child(1)') || deselectButton;
      newDeselectButton.addEventListener('click', async () => {
        if (isDeselectButtonProcessing) {
          return;
        }
        isDeselectButtonProcessing = true;
        newDeselectButton.style.pointerEvents = 'none';
        if (refreshIntervals.has('grayMonitor')) {
          clearInterval(refreshIntervals.get('grayMonitor'));
          refreshIntervals.delete('grayMonitor');
        }
        try {
          await deselectAllSeats();
          updateButtonState(newDeselectButton, newSelectNewButton);
        } catch (error) {
          console.error('Error deselecting seats:', error);
        }
        isDeselectButtonProcessing = false;
        updateButtonState(newDeselectButton, newSelectNewButton);
      });

      const selectNewButton = document.createElement('button');
      selectNewButton.textContent = 'เลือกที่นั่งใหม่';
      selectNewButton.style.backgroundColor = 'rgb(76, 175, 80)';
      selectNewButton.style.color = 'rgb(255, 255, 255)';
      selectNewButton.style.fontWeight = '600';
      selectNewButton.style.borderRadius = '24px';
      selectNewButton.style.height = '44px';
      selectNewButton.style.border = 'none';
      selectNewButton.style.cursor = 'pointer';
      selectNewButton.style.fontFamily = '"FC Friday", "Helvetica Neue", Helvetica, Arial, sans-serif';
      selectNewButton.style.fontSize = '16px';
      selectNewButton.style.transition = 'color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out';
      selectNewButton.disabled = true;
      selectNewButton.style.pointerEvents = 'none';
      selectNewButton.replaceWith(selectNewButton.cloneNode(true));
      const newSelectNewButton = document.querySelector('#button-wrapper button:nth-child(2)') || selectNewButton;
      newSelectNewButton.addEventListener('click', async () => {
        if (isSelectNewButtonProcessing) {
          return;
        }
        isSelectNewButtonProcessing = true;
        newSelectNewButton.style.pointerEvents = 'none';
        if (refreshIntervals.has('grayMonitor')) {
          clearInterval(refreshIntervals.get('grayMonitor'));
          refreshIntervals.delete('grayMonitor');
        }
        try {
          await selectNewSeats(numSeats, false, false, false, true);
          updateButtonState(newDeselectButton, newSelectNewButton);
        } catch (error) {
          console.error('Error selecting new seats:', error);
        }
        isSelectNewButtonProcessing = false;
        updateButtonState(newDeselectButton, newSelectNewButton);
      });

      updateWidths(buttonContainer, newDeselectButton, newSelectNewButton);
      updateButtonState(newDeselectButton, newSelectNewButton);

      const setupWidthObserver = () => {
        const boxPlaceOrder = document.querySelector('#select-variant .box-placeorder');
        if (!boxPlaceOrder) {
          setTimeout(setupWidthObserver, 500);
          return;
        }

        const resizeObserver = new ResizeObserver(() => {
          updateWidths(buttonContainer, newDeselectButton, newSelectNewButton);
        });
        resizeObserver.observe(boxPlaceOrder);

        let lastWidth = null;
        const pollInterval = setInterval(() => {
          const computedStyle = window.getComputedStyle(boxPlaceOrder);
          const currentWidth = computedStyle.width;
          if (currentWidth !== lastWidth) {
            lastWidth = currentWidth;
            updateWidths(buttonContainer, newDeselectButton, newSelectNewButton);
          }
        }, 500);
      };

      const setupSeatObserver = () => {
        const selectVariant = document.querySelector('#select-variant');
        if (!selectVariant) {
          setTimeout(setupSeatObserver, 500);
          return;
        }

        const mutationObserver = new MutationObserver(() => {
          updateButtonState(newDeselectButton, newSelectNewButton);
        });
        mutationObserver.observe(selectVariant, {
          childList: true,
          subtree: true
        });
      };

      setupWidthObserver();
      setupSeatObserver();

      buttonContainer.appendChild(newDeselectButton);
      buttonContainer.appendChild(newSelectNewButton);

      const selectVariantBody = selectVariant.querySelector('.select-variant-body');
      if (selectVariantBody && boxPlaceOrder) {
        selectVariant.insertBefore(buttonContainer, boxPlaceOrder);
      } else {
        selectVariant.appendChild(buttonContainer);
      }
    }
  }

  function formatToCustomDateTime(dateTimeString) {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString.replace('T', ' '));
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok'
    }).replace(/, /g, ' ');
  }

  function formatToDateTimeLocal(customDateTime) {
    if (!customDateTime) return '';
    const [datePart, timePart] = customDateTime.split(' ');
    if (!datePart || !timePart) return '';
    const [day, month, year] = datePart.split('/');
    return `${year}-${month}-${day}T${timePart}`;
  }

  function getCurrentDateTime() {
    const now = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok'
    });
    return now.replace(/, /g, ' ');
  }

  function createStartTimeModal(isFreshSubmission = false) {
    return new Promise((resolve) => {
      const currentDateTime = getCurrentDateTime();
      const [datePart, timePart] = currentDateTime.split(' ');
      const [hours, minutes] = timePart.split(':');
      const modifiedTimePart = `${hours}:${minutes}:00`;
      const modifiedDateTime = `${datePart} ${modifiedTimePart}`;
      const currentDateTimeLocal = formatToDateTimeLocal(modifiedDateTime);
      const dateTimePattern = /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}$/;

      const getScrollbarWidth = () => {
        let scrollbarWidth = document.body.offsetWidth - document.body.clientWidth;
        if (scrollbarWidth === 0) {
          const scrollDiv = document.createElement('div');
          scrollDiv.style.width = '100px';
          scrollDiv.style.height = '100px';
          scrollDiv.style.overflow = 'scroll';
          scrollDiv.style.position = 'absolute';
          scrollDiv.style.top = '-9999px';
          document.body.appendChild(scrollDiv);
          scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
          document.body.removeChild(scrollDiv);
        }
        return scrollbarWidth;
      };
      const scrollbarWidth = getScrollbarWidth();
      const modal = document.createElement('div');
      modal.id = 'formStarttime';
      modal.tabIndex = -1;
      modal.role = 'dialog';
      modal.setAttribute('aria-labelledby', 'myLargeModalLabel');
      modal.className = 'modal fade bd-example-modal-lg show';
      modal.style.paddingRight = `${scrollbarWidth}px`;
      modal.style.display = 'block';

      modal.innerHTML = `
        <div class="modal-dialog modal-lg"
          style="opacity: 0; transform: translateY(-20px); transition: opacity 0.3s ease, transform 0.3s ease;">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="col-12 modal-title text-center">ตั้งเวลาเริ่มกด</h5>
              <button type="button" data-dismiss="modal" aria-label="Close" class="close"
                style="position: absolute; right: 20px;">
                <span aria-hidden="true"><i class="las la-times"></i></span>
              </button>
            </div>
            <div class="modal-body p-4">
              <div class="form">
                <div role="presentation" style="position: relative;">
                  <input type="text" name="decoy_username_${Date.now()}"
                    style="position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0;" tabindex="-1"
                    autocomplete="off">
                  <input type="password" name="decoy_password_${Date.now()}"
                    style="position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0;" tabindex="-1"
                    autocomplete="off">
                  <div class="col" id="starttime-input-container">
                    <input type="datetime-local" name="starttime_${Date.now()}" id="starttime_${Date.now()}"
                      class="form-control text-center" step="1" value="${currentDateTimeLocal}"
                      pattern="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}" min="2000-01-01T00:00:00" max="2099-12-31T23:59:59"
                      autocomplete="off" autocorrect="off" spellcheck="false" aria-required="true" aria-invalid="false"
                      tabindex="0"
                      style="background-color: #282828; font-size: 18px; vertical-align: middle; display: flex; justify-content: center; align-items center;">
                  </div>
                </div>
                <div class="row mt-2"></div>
              </div>
              <div class="row mt-4 pt-3" style="border-top: 1px dashed rgb(61, 61, 61)">
                <div class="col-12 text-center">
                  <button class="btn btn-submit w-50" style="border-radius: 100px; color: rgb(255, 255, 255)">บันทึก</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.style.cssText = `
        display: block !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        z-index: 1040 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: #000 !important;
        opacity: 0;
        transition: opacity 0.3s ease !important;
        `;
      document.body.appendChild(backdrop);

      const styleTag = document.createElement('style');
      styleTag.textContent = `
        input[name^="starttime"]::-webkit-datetime-edit { color: #fff; }
        input[name^="starttime"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          padding: 5px;
        }
        input[name^="starttime"]:-webkit-autofill,
        input[name^="starttime"]:-webkit-autofill:hover,
        input[name^="starttime"]:-webkit-autofill:focus,
        input[name^="starttime"]:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #282828 inset !important;
          -webkit-text-fill-color: #fff !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
        input[name^="starttime"]::-webkit-datetime-edit-fields-wrapper,
        input[name^="starttime"]::-webkit-datetime-edit-text,
        input[name^="starttime"]::-webkit-datetime-edit-month-field,
        input[name^="starttime"]::-webkit-datetime-edit-day-field,
        input[name^="starttime"]::-webkit-datetime-edit-year-field,
        input[name^="starttime"]::-webkit-datetime-edit-hour-field,
        input[name^="starttime"]::-webkit-datetime-edit-minute-field,
        input[name^="starttime"]::-webkit-datetime-edit-second-field,
        input[name^="starttime"]::-webkit-datetime-edit-ampm-field {
          background-color: transparent !important;
        }
        input[name^="starttime"]::-webkit-datetime-edit-month-field:focus,
        input[name^="starttime"]::-webkit-datetime-edit-day-field:focus,
        input[name^="starttime"]::-webkit-datetime-edit-year-field:focus,
        input[name^="starttime"]::-webkit-datetime-edit-hour-field:focus,
        input[name^="starttime"]::-webkit-datetime-edit-minute-field:focus,
        input[name^="starttime"]::-webkit-datetime-edit-second-field:focus,
        input[name^="starttime"]::-webkit-datetime-edit-ampm-field:focus {
          background-color: #da3534 !important;
          color: #fff !important;
        }
        input[name^="starttime"]::-moz-selection {
          background-color: #da3534 !important;
          color: #fff !important;
        }
        `;
      document.head.appendChild(styleTag);

      document.body.classList.add('modal-open');
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      const mainBody = document.querySelector('#_main-body');
      if (!mainBody) {
        console.warn('Main body element (#_main-body) not found, cannot show start time modal');
        backdrop.remove();
        styleTag.remove();
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        resolve(false);
        return;
      }
      mainBody.appendChild(modal);

      const modalDialog = modal.querySelector('.modal-dialog');
      const submitButton = modal.querySelector('.btn.btn-submit');
      const closeButton = modal.querySelector('.close');
      const input = modal.querySelector('input[name^="starttime"]');
      const inputContainer = modal.querySelector('#starttime-input-container');

      setTimeout(() => {
        backdrop.style.opacity = '0.5';
        modalDialog.style.opacity = '1';
        modalDialog.style.transform = 'translateY(0)';
      }, 10);

      const handleSubmit = () => {
        const existingError = inputContainer.querySelector('.form-text.text-danger');
        if (existingError) {
          existingError.remove();
        }

        const userInputRaw = input.value.trim();
        if (!userInputRaw) {
          const errorMessage = document.createElement('small');
          errorMessage.className = 'form-text text-danger text-center';
          errorMessage.textContent = 'กรุณาระบุวันที่และเวลา';
          inputContainer.appendChild(errorMessage);
          input.setAttribute('aria-invalid', 'true');
          return;
        }

        const userInput = formatToCustomDateTime(userInputRaw);
        if (!dateTimePattern.test(userInput)) {
          const errorMessage = document.createElement('small');
          errorMessage.className = 'form-text text-danger text-center';
          errorMessage.textContent = 'รูปแบบวันที่และเวลาไม่ถูกต้อง';
          inputContainer.appendChild(errorMessage);
          input.setAttribute('aria-invalid', 'true');
          return;
        }

        backdrop.style.opacity = '0';
        modalDialog.style.opacity = '0';
        modalDialog.style.transform = 'translateY(-20px)';

        setTimeout(() => {
          sessionStorage.setItem('startTime', userInput);
          startTime = userInput;
          console.log(`Start time set to: ${startTime}`);
          modal.remove();
          backdrop.remove();
          styleTag.remove();
          document.body.classList.remove('modal-open');
          document.body.style.paddingRight = '';
          resolve(true);
          autoClickGetTickets(true);
        }, 300);
      };

      submitButton.addEventListener('click', handleSubmit);

      const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === 'NumpadEnter') && modal.isConnected) {
          e.preventDefault();
          handleSubmit();
        }
      };
      document.addEventListener('keydown', handleKeyDown);

      const closeModal = () => {
        return new Promise((closeResolve) => {
          backdrop.style.opacity = '0';
          modalDialog.style.opacity = '0';
          modalDialog.style.transform = 'translateY(-20px)';

          setTimeout(() => {
            modal.remove();
            backdrop.remove();
            styleTag.remove();
            document.removeEventListener('keydown', handleKeyDown);
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
            sessionStorage.removeItem('startTime');
            closeResolve();
          }, 300);
        }).then(() => resolve(false));
      };

      closeButton.addEventListener('click', closeModal);

      modal.addEventListener('click', (e) => {
        if (!modalDialog.contains(e.target)) {
          closeModal();
        }
      });
    });
  }

  async function promptForStartTime(isFreshSubmission = false) {
    return await createStartTimeModal(isFreshSubmission);
  }

  function autoClickGetTickets(isFreshSubmission = false) {
    return new Promise((resolve, reject) => {
      const concertPageRegex = /^https:\/\/([a-zA-Z0-9-]+\.)*theconcert\.com\/concert\/\d+(?:\/)?(?:\?.*)?(?:#.*)?$/;

      if (!concertPageRegex.test(window.location.href)) {
        console.log('Not on concert page, resolving');
        resolve();
        return;
      }

      const tryClick = () => {
        const getTicketsButton = document.querySelector('.box-place-con .btn-reserve');
        if (!getTicketsButton) {
          console.warn('Get Tickets button (.btn-reserve) not found');
          return false;
        }

        const rect = getTicketsButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const el = document.elementFromPoint(x, y);
        if (el) {
          el.click();
          console.log('Clicked Get Tickets button');
          return true;
        }
        console.warn('No element found at click coordinates');
        return false;
      };

      const checkForSelectRound = () => {
        return new Promise((roundResolve) => {
          let attempts = 0;
          const maxAttempts = 2;
          const interval = setInterval(() => {
            if (window.location.hash.includes('#selectround')) {
              clearInterval(interval);
              console.log('Detected #selectround hash, attempting to select round');
              autoSelectRound()
                .then(() => roundResolve(true))
                .catch((error) => {
                  console.error('Failed to select round:', error);
                  roundResolve(false);
                });
            } else if (window.location.pathname.match(/\/stage\/?$/)) {
              clearInterval(interval);
              console.log('Navigated to stage page, skipping round selection');
              roundResolve(true);
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              console.warn('Timeout waiting for #selectround or stage page');
              roundResolve(false);
            }
            attempts++;
          }, 500);
        });
      };

      const checkTimeAndClick = (isFresh = false) => {
        if (!startTime && !sessionStorage.getItem('startTime')) {
          console.log('No startTime, prompting for input');
          promptForStartTime(isFreshSubmission).then((result) => {
            if (result) {
              console.log('startTime set, proceeding with time check');
              checkTimeAndClick(true);
            } else {
              console.log('startTime modal closed, waiting for manual navigation');
              handleManualNavigation();
            }
          }).catch(error => {
            console.error('Error in promptForStartTime:', error);
            reject(error);
          });
          return;
        }

        startTime = startTime || sessionStorage.getItem('startTime');
        const [datePart, timePart] = startTime.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        const startDateTime = new Date(year, month - 1, day, hours, minutes, seconds);
        const startTimeMs = startDateTime.getTime();

        const now = new Date();
        const currentTimeMs = now.getTime();

        if (isFresh && currentTimeMs >= startTimeMs) {
          proceedWithClick(0);
        } else {
          console.log('Waiting for start time:', startTime);
          const timeCheckInterval = setInterval(() => {
            if (!concertPageRegex.test(window.location.href)) {
              clearInterval(timeCheckInterval);
              console.log('Left concert page, resolving');
              resolve();
              return;
            }

            const now = new Date();
            const currentTimeMs = now.getTime();
            if (currentTimeMs >= startTimeMs) {
              clearInterval(timeCheckInterval);
              console.log('Start time reached, proceeding with click');
              proceedWithClick(0);
            }
          }, 100);
        }
      };

      const proceedWithClick = (delay = 0) => {
        setTimeout(() => {
          if (tryClick()) {
            checkForSelectRound().then((success) => {
              if (success) {
                resolve();
              } else {
                reject(new Error('Failed to handle #selectround or navigate to stage'));
              }
            });
          } else {
            let attempts = 0;
            const maxAttempts = 2;
            const clickInterval = setInterval(() => {
              if (tryClick() || ++attempts >= maxAttempts) {
                clearInterval(clickInterval);
                if (attempts >= maxAttempts) {
                  console.warn('Max click attempts reached');
                  reject(new Error('Max click attempts reached'));
                } else {
                  checkForSelectRound().then((success) => {
                    if (success) {
                      resolve();
                    } else {
                      reject(new Error('Failed to handle #selectround or navigate to stage'));
                    }
                  });
                }
              }
            }, 500);
          }
        }, delay);
      };

      const handleManualNavigation = () => {
        const manualClickHandler = (event) => {
          if (event.target.closest('.box-place-con .btn-reserve') || window.location.hash.includes('#selectround') || window.location.pathname.match(/\/stage\/?$/)) {
            window.removeEventListener('click', manualClickHandler);
            checkForSelectRound().then((success) => {
              if (success) {
                console.log('Manual navigation detected, resolving');
                resolve();
              } else {
                console.error('Failed to handle manual navigation');
                reject(new Error('Failed to handle #selectround or navigate to stage'));
              }
            }).catch(error => {
              console.error('Error in manual navigation:', error);
              reject(error);
            });
          }
        };
        window.addEventListener('click', manualClickHandler);
        const cleanup = () => {
          if (window.location.hash.includes('#selectround') || window.location.pathname.match(/\/stage\/?$/)) {
            window.removeEventListener('click', manualClickHandler);
            window.removeEventListener('popstate', cleanup);
            checkForSelectRound().then((success) => {
              if (success) {
                resolve();
              } else {
                reject(new Error('Failed to handle #selectround or navigate to stage'));
              }
            });
          }
        };
        window.addEventListener('popstate', cleanup);
      };

      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        checkTimeAndClick(isFreshSubmission);
      } else {
        const loadHandler = () => {
          checkTimeAndClick(isFreshSubmission);
          window.removeEventListener('load', loadHandler);
        };
        window.addEventListener('load', loadHandler);
      }
    });
  }

  function autoClickPaymentButton() {
    return new Promise((resolve, reject) => {
      const paymentButton = document.querySelector('.box-placeorder .btn.btn-submit');
      if (!paymentButton) {
        console.warn('Payment button (.btn.btn-submit) not found');
        reject(new Error('Payment button not found'));
        return;
      }

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      setTimeout(() => {
        try {
          paymentButton.dispatchEvent(clickEvent);
          resolve();
        } catch (error) {
          console.error('Error clicking payment button:', error);
          reject(error);
        }
      }, getRandomDelay() + 250);
    });
  }

  function setupSeatClicker(numSeats, forceRun = false, isInitialRun = false) {
    let observer = null;
    let hasClicked = false;
    let lastPathname = null;
    let isStopped = false;

    function stopAllOperations() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      refreshIntervals.forEach((interval) => clearInterval(interval));
      refreshIntervals.clear();
      isStopped = true;
      console.log('All seat selection operations stopped');
      if (hasEnoughSeats && (autoOrder === true || autoOrder === "true")) {
        autoClickPaymentButton()
          .then(() => {
          })
          .catch(error => {
            console.error('Failed to click payment button:', error);
          });
      }
    }

    function resetSeatMapData() {
      clickedSeatIds.clear();
      loadingSeatIds.clear();
      selectedSeatLabels.clear();
      selectedCount = 0;
      hasEnoughSeats = false;
      seatSelectionRetryCount = 0;
      hasManualNonSoldOutClick = false;
      isDeselectedByButton = false;
      isDeselectingSeats = false;
      refreshIntervals.forEach((interval) => clearInterval(interval));
      refreshIntervals.clear();
    }

    document.addEventListener('click', (event) => {
      if (isStopped) return;
      const backButton = event.target.closest('#select-variant .back a');
      if (backButton) {
        stopAllOperations();
        resetSeatMapData();
      }
    }, { once: true });

    function checkAndRun() {
      if (isStopped) return;

      const currentPathname = window.location.pathname;

      if (!currentPathname.endsWith("/stage")) {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        hasClicked = false;
        lastPathname = currentPathname;
        const buttonContainer = document.querySelector('#button-wrapper');
        if (buttonContainer) {
          buttonContainer.style.display = 'none';
        }
        return;
      }

      createControlButtons();

      const allSeats = document.querySelectorAll('image[width="48"][height="48"]');
      let retryAttempts = 0;
      const maxRetryAttempts = 3;

      const attemptSeatCheck = () => {
        if (isStopped || retryAttempts >= maxRetryAttempts) {
          console.warn(`Stopped checking seats: Stopped=${isStopped}, RetryAttempts=${retryAttempts}/${maxRetryAttempts}`);
          return;
        }

        if (allSeats.length > 0) {
          let hasLoadedSeats = false;
          allSeats.forEach(seat => {
            const href = seat.getAttributeNS(xlinkNS, 'href');
            const transform = seat.getAttribute('transform');
            const match = transform ? transform.match(/matrix\(([^)]+)\)/) : null;
            if (match && href) {
              const [a, b, c, d, tx, ty] = match[1].split(',').map(parseFloat);
              const seatId = `${tx},${ty}`;
              if (href.includes(seatMark)) {
                const seatLabelMap = createSeatLabelMap(allSeats);
                const seatLabel = seatLabelMap.get(seatId) || seatId;
                selectedCount++;
              }
              if (href.includes(seatBlue) || href.includes(seatGray) || href.includes(seatLoad) || href.includes(seatSold) || href.includes(seatMark)) {
                hasLoadedSeats = true;
              }
            }
          });

          hasEnoughSeats = selectedCount >= parseInt(numSeats, 10);

          if (hasEnoughSeats) {
            console.log(`Enough seats selected (${selectedCount}/${numSeats})`);
            stopAllOperations();
            return;
          }

          if (seatSelectionRetryCount >= maxSeatSelectionRetries && selectedCount < parseInt(numSeats, 10)) {
            console.warn(`Maximum retries (${maxSeatSelectionRetries}) reached with insufficient seats (${selectedCount}/${numSeats})`);
            stopAllOperations();
            return;
          }

          if (hasLoadedSeats && !isDeselectingSeats && (forceRun || (!hasClicked && !hasEnoughSeats && !isDeselectedByButton))) {
            seatSelectionRetryCount = 0;
            autoClickAvailableSeat(numSeats, true, true, isInitialRun).then(result => {
              if (result) {
                hasClicked = true;
                lastPathname = currentPathname;
                stopAllOperations();
              } else {
                console.log('Seat selection failed, scheduling retry');
                retryAttempts++;
                setTimeout(attemptSeatCheck, 1000);
              }
            }).catch(error => {
              console.error('Error in seat selection:', error);
              retryAttempts++;
              setTimeout(attemptSeatCheck, 1000);
            });
          } else {
            retryAttempts++;
            setTimeout(attemptSeatCheck, 1000);
          }
        } else {
          console.log('No seats found, scheduling retry');
          retryAttempts++;
          setTimeout(attemptSeatCheck, 1000);
        }
      };

      attemptSeatCheck();
    }

    checkAndRun();
    window.addEventListener('popstate', () => {
      if (isStopped) return;
      checkAndRun();
    });

    history.pushState = function (...args) {
      if (isStopped) return;
      originalPushState.apply(history, args);
      hasClicked = false;
      isDeselectedByButton = false;
      isDeselectingSeats = false;
      seatSelectionRetryCount = 0;
      checkAndRun();
    };

    history.replaceState = function (...args) {
      if (isStopped) return;
      originalReplaceState.apply(history, args);
      hasClicked = false;
      isDeselectedByButton = false;
      isDeselectingSeats = false;
      seatSelectionRetryCount = 0;
      checkAndRun();
    };
  }

  function setupZoneClickListener() {
    document.addEventListener('click', (event) => {
      if (isProcessingClick) {
        console.log('Click processing in progress, skipping listener');
        return;
      }

      const zoneItem = event.target.closest('.zone-item');
      if (!zoneItem) return;

      const zoneName = zoneItem.querySelector('.badge-zone')?.textContent.trim() || 'Unknown';
      console.log(`Click detected on zone: ${zoneName}`);
      const soldOut = zoneItem.querySelector('.sold-out-text');
      isProcessingClick = true;

      try {
        if (!soldOut) {
          console.log(`Zone ${zoneName} is not sold out, proceeding`);
          hasManualNonSoldOutClick = true;
          clickedSeatIds.clear();
          loadingSeatIds.clear();
          selectedCount = 0;
          hasEnoughSeats = false;
          seatSelectionRetryCount = 0;
          refreshIntervals.forEach((interval) => clearInterval(interval));
          refreshIntervals.clear();

          waitForSeatMap()
            .then(() => {
              setupSeatClicker(numSeats, true, false);
            })
            .catch(error => {
              console.error('Error waiting for seat map:', error);
            })
            .finally(() => {
              isProcessingClick = false;
            });
        } else {
          console.log(`Zone ${zoneName} is sold out, ignoring click`);
          isProcessingClick = false;
        }
      } catch (error) {
        console.error('Error in zone click listener:', error);
        isProcessingClick = false;
      }
    }, { capture: true, passive: false });
  }

  function waitForBadgeZone() {
    return new Promise((resolve) => {
      if (document.querySelector('.badge-zone')) {
        resolve();
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.badge-zone')) {
          obs.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  function waitForSeatMap(sortLast = false) {
    return new Promise((resolve, reject) => {
      const maxAttempts = 10;
      let attempts = 0;

      const checkSeatMap = () => {
        const seats = document.querySelectorAll('image[width="48"][height="48"]');

        if (seats.length > 0) {
          let hasLoadedSeats = false;
          const seatIds = new Set();
          seats.forEach(seat => {
            const href = seat.getAttributeNS(xlinkNS, 'href') || 'none';
            const transform = seat.getAttribute('transform');
            const match = transform ? transform.match(/matrix\(([^)]+)\)/) : null;
            if (match && href) {
              const [a, b, c, d, tx, ty] = match[1].split(',').map(parseFloat);
              const seatId = `${tx},${ty}`;
              seatIds.add(seatId);
              if (href.includes(seatBlue) || href.includes(seatGray) || href.includes(seatLoad) || href.includes(seatSold) || href.includes(seatMark)) {
                hasLoadedSeats = true;
              }
            }
          });

          if (hasLoadedSeats) {
            clickedSeatIds.clear();
            loadingSeatIds.clear();
            selectedCount = 0;
            hasEnoughSeats = false;
            seatSelectionRetryCount = 0;
            refreshIntervals.forEach((interval) => clearInterval(interval));
            refreshIntervals.clear();
            resolve();
          }
        }

        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error('Seat map did not load within timeout'));
        }
      };

      setTimeout(checkSeatMap, 300);
      const interval = setInterval(checkSeatMap, 500);
    });
  }

  function runMainExecution() {
    if (isRunning) {
      return;
    }
    isRunning = true;
    console.log(`URL: ${window.location.href}, Hash: ${window.location.hash}, Pathname: ${window.location.pathname}`);

    const concertPageRegex = /^https:\/\/([a-zA-Z0-9-]+\.)*theconcert\.com\/concert\/\d+(?:\/)?(?:\?.*)?(?:#.*)?$/;
    if (concertPageRegex.test(window.location.href)) {
      autoClickGetTickets()
        .then(() => {
          console.log('Get Tickets process completed, waiting for navigation');
          isRunning = false;
        })
        .catch(error => {
          console.error('Error in Get Tickets execution:', error);
          isRunning = false;
        });
    } else if (window.location.hash.includes('#selectround')) {
      console.log('On #selectround page, attempting round selection');
      autoSelectRound()
        .then(() => {
          const checkStage = setInterval(() => {
            if (window.location.pathname.match(/\/stage\/?$/)) {
              clearInterval(checkStage);
              waitForBadgeZone()
                .then(() => {
                  return autoClickPrice().catch(error => {
                    console.warn('Price selection failed, continuing with manual zone selection:', error.message);
                    return Promise.resolve();
                  });
                })
                .then(() => {
                  const zoneItems = document.querySelectorAll('.zone-item');
                  if (zoneItems.length > 0) {
                    let hasTargetZone = false;
                    zoneItems.forEach(item => {
                      const badge = item.querySelector('.badge-zone');
                      if (badge && targetZones.includes(badge.textContent.trim())) {
                        hasTargetZone = true;
                      }
                    });
                    if (hasTargetZone) {
                      return Promise.resolve();
                    }
                  }
                  return scrollToBottomZoneList().then(() => waitForZoneList());
                })
                .then(() => {
                  console.log('Initiating zone selection');
                  autoClickZones(true);
                  setupZoneClickListener();
                  createControlButtons();
                })
                .catch(error => {
                  console.error('Error in stage execution after round selection:', error);
                  setupZoneClickListener();
                  createControlButtons();
                })
                .finally(() => {
                  isRunning = false;
                });
            }
          }, 100);
        })
        .catch(error => {
          console.error('Error selecting round:', error);
          isRunning = false;
        });
    } else if (window.location.pathname.match(/\/stage\/?$/)) {
      waitForBadgeZone()
        .then(() => {
          return autoClickPrice().catch(error => {
            console.warn('Price selection failed, continuing with manual zone selection:', error.message);
            return Promise.resolve();
          });
        })
        .then(() => {
          const zoneItems = document.querySelectorAll('.zone-item');
          if (zoneItems.length > 0) {
            let hasTargetZone = false;
            zoneItems.forEach(item => {
              const badge = item.querySelector('.badge-zone');
              if (badge && targetZones.includes(badge.textContent.trim())) {
                hasTargetZone = true;
              }
            });
            if (hasTargetZone) {
              return Promise.resolve();
            }
          }
          return scrollToBottomZoneList().then(() => waitForZoneList());
        })
        .then(() => {
          console.log('Initiating zone selection');
          autoClickZones(true);
          setupZoneClickListener();
          createControlButtons();
        })
        .catch(error => {
          console.error('Error in main execution for /stage:', error);
          setupZoneClickListener();
          createControlButtons();
        })
        .finally(() => {
          isRunning = false;
        });
    } else {
      isRunning = false;
    }
  }

  runMainExecution();

  window.addEventListener('hashchange', () => {
    runMainExecution();
  });

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    runMainExecution();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    runMainExecution();
  };
})();