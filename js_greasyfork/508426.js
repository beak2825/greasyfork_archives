// ==UserScript==
// @name         Cursor.com Usage Tracker
// @author       monnef, v2 by Sonnet 4.0, original by Sonnet 3.5 (via Perplexity and Cursor), some help from Cursor Tab and Cursor Small
// @namespace    http://monnef.eu
// @version      2.0
// @description  Enhanced usage statistics and analytics for Cursor.com's new frontend, providing detailed insights into usage patterns and billing cycles.
// @match        https://www.cursor.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      unpkg.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/508426/Cursorcom%20Usage%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/508426/Cursorcom%20Usage%20Tracker.meta.js
// ==/UserScript==

/* CHANGES:
 * 2.0:
 * - Complete rewrite for new Cursor frontend
 * - Auto-extract usage data and reset dates
 * - New card design matching Cursor's updated UI
 * 0.4:
 * - Improved error handling for icon loads
 * 0.3:
 * - Updated to CSP changes causing icons to fail to load
 */

(function () {
  'use strict';

  const $ = jQuery.noConflict();

  const $c = (cls, parent) => $(`.${cls}`, parent);
  const $i = (id, parent) => $(`#${id}`, parent);

  $.fn.nthParent = function (n) {
    return this.parents().eq(n - 1);
  };

  const log = (...messages) => {
    console.log(`[UsageTracker v2]`, ...messages);
  };

  const error = (...messages) => {
    console.error(`[UsageTracker v2]`, ...messages);
  };

  const genCssId = name => `ut-${name}`;

  const sigCls = genCssId('sig');
  const trackerCardCls = genCssId('tracker-card');
  const donationModalCls = genCssId('donation-modal');
  const settingsModalCls = genCssId('settings-modal');
  const modalCls = genCssId('modal');
  const modalContentCls = genCssId('modal-content');
  const modalCloseCls = genCssId('modal-close');
  const copyButtonCls = genCssId('copy-button');
  const inputCls = genCssId('input');
  const inputWithButtonCls = genCssId('input-with-button');
  const buttonCls = genCssId('button');
  const buttonWhiteCls = genCssId('button-white');
  const errorMessageCls = genCssId('error-message');
  const hrCls = genCssId('hr');
  const highlightValueCls = genCssId('highlight-value');
  const progressBarContainerCls = genCssId('progress-bar-container');
  const progressBarMainCls = genCssId('progress-bar-main');
  const progressBarFillCls = genCssId('progress-bar-fill');
  const progressBarTrackCls = genCssId('progress-bar-track');
  const progressOverflowContainerCls = genCssId('progress-overflow-container');
  const progressOverflowBoxCls = genCssId('progress-overflow-box');

  const colors = Object.freeze({
    cursor: {
      bg: '#16181c',
      cardBg: '#1d1f22',
      text: '#fff', // but opacity 0.8
      textBrandGray300: '#666',
      barColor: '#81A1C1', // bar secondary color is the same as bar color, but opacity 0.1
      blue: '#3864f6',
      blueDarker: '#2e53cc',
      lightGray: '#e5e7eb',
      gray: '#a7a9ac',
      grayDark: '#333333',
      buttonBg: '#242629',
      buttonBorder: '#3a3a3a',
      buttonHover: '#2a2a2d',
    }
  });

  const styles = `
    .${modalCls} {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(5px) contrast(0.5);
    }

    .${modalContentCls} {
      background-color: ${colors.cursor.bg};
      color: ${colors.cursor.text};
      margin: 15% auto;
      padding: 15px 20px;
      width: 600px;
      border-radius: 12px;
      position: relative;
      border: 1px solid ${colors.cursor.buttonBorder};
    }

    .${modalCloseCls} {
      color: ${colors.cursor.text};
      position: absolute;
      top: 0px;
      right: 10px;
      font-size: 25px;
      font-weight: bold;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .${modalCloseCls}:hover {
      opacity: 1;
    }

    .${copyButtonCls} {
      background-color: ${colors.cursor.buttonBg};
      color: ${colors.cursor.text};
      border: 1px solid ${colors.cursor.buttonBorder};
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      margin-left: 10px;
      width: 3em;
    }

    .${copyButtonCls}:hover {
      background-color: ${colors.cursor.buttonHover};
    }

    .${buttonCls} {
      background-color: ${colors.cursor.buttonBg};
      color: ${colors.cursor.text};
      border: 1px solid ${colors.cursor.buttonBorder};
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .${buttonCls}:hover {
      background-color: ${colors.cursor.buttonHover};
    }

    .${buttonWhiteCls} {
      background-color: ${colors.cursor.buttonBg};
      color: ${colors.cursor.text};
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 400;
      transition: all 0.2s;
    }

    .${buttonWhiteCls}:hover {
      background-color: ${colors.cursor.buttonHover};
    }

    .${inputCls} {
      background-color: ${colors.cursor.cardBg};
      color: ${colors.cursor.text};
      border: 1px solid ${colors.cursor.buttonBorder};
      padding: 8px 12px;
      width: 100%;
      border-radius: 8px;
      font-size: 14px;
      height: 40px;
    }

    .${inputWithButtonCls} {
      width: calc(100% - 2em - 10px);
    }

    .${errorMessageCls} {
      color: #ff4d4f;
      font-size: 14px;
      margin-top: 5px;
    }

    .${hrCls} {
      border: 0;
      height: 1px;
      background-color: ${colors.cursor.buttonBorder};
      margin: 10px 0;
    }

    .${sigCls} {
      opacity: 0.3;
      transition: opacity 0.2s ease;
      cursor: pointer;
      font-size: 12px;
      margin-left: 8px;
    }

    .${sigCls}:hover {
      opacity: 0.8;
    }

    .${modalContentCls} h2 {
      margin-bottom: 20px;
    }

    .${modalContentCls} p {
      margin-bottom: 15px;
    }

    .${highlightValueCls} {
      font-weight: 600;
      opacity: 0.5;
      color: ${colors.cursor.text};
    }

    /* Progress Bar Classes */
    .${progressBarContainerCls} {
      display: flex;
      align-items: center;
      gap: 1px;
      width: 100%;
      height: 4px;
      padding: 8px 0;
    }

    .${progressBarMainCls} {
      flex-grow: 1;
      display: flex;
      gap: 1px;
      height: 4px;
    }

    .${progressBarFillCls} {
      height: 4px;
      /* background-color and width set via inline styles */
    }

    .${progressBarTrackCls} {
      height: 4px;
      flex-grow: 1;
      opacity: 0.1;
      /* background-color set via inline styles */
    }

    .${progressOverflowContainerCls} {
      position: relative;
      width: 0;
      height: 4px;
    }

    .${progressOverflowBoxCls} {
      position: absolute;
      height: 4px;
      margin-right: 2px;
      /* background-color, width, and right position set via inline styles */
    }
  `;

  const bitcoinAddress = 'bc1qr7crhydmp68qpa0gumuf2h6jcvdtta4wju49r7';
  const bitcoinPaymentLink = `bitcoin:${bitcoinAddress}`;

  const iconCache = {};

  const createLucideIcon = ({ iconName, size = '16px', invert = false }) => {
    const src = `https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`;
    const img = $('<img>')
      .css({
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'text-bottom',
        filter: invert ? 'invert(1)' : 'none'
      });

    const cleanupFailedIcon = (reason) => {
      img.remove();
      error(`Failed to load icon: ${iconName}. Reason: ${reason}`);
    };

    if (iconCache[iconName]) {
      img.attr('src', iconCache[iconName]);
      return img;
    }

    GM_xmlhttpRequest({
      method: 'GET',
      url: src,
      onload: function (response) {
        if (response.status >= 200 && response.status < 300) {
          const svg = response.responseText;
          const dataUrl = 'data:image/svg+xml;base64,' + btoa(svg);
          img.attr('src', dataUrl);
          iconCache[iconName] = dataUrl;
        } else {
          cleanupFailedIcon(`HTTP status ${response.status}`);
        }
      },
      onerror: function (error) {
        cleanupFailedIcon(`Network error: ${error.message}`);
      },
      ontimeout: function () {
        cleanupFailedIcon('Request timed out');
      }
    });

    return img;
  };

  const getUsageCard = () => {
    return $('div:contains("Included Requests")').closest('.rounded-xl').first();
  };

  const extractUsageData = () => {
    const usageCard = getUsageCard();
    if (!usageCard.length) {
      log('Usage card not found');
      return null;
    }

    // Extract current usage (e.g., "15")
    const usageSpan = usageCard.find('span').filter(function () {
      return /^\d+$/.test($(this).text().trim());
    }).first();

    // Extract total usage (e.g., "/ 500")
    const totalSpan = usageCard.find('span').filter(function () {
      return /^\/\s*\d+$/.test($(this).text().trim());
    }).first();

    // Extract reset date
    const resetText = usageCard.find('p:contains("Last reset on:")').text();
    const resetMatch = resetText.match(/Last reset on:\s*(.+)/);

    const used = usageSpan.length ? parseInt(usageSpan.text().trim()) : 0;
    const total = totalSpan.length ? parseInt(totalSpan.text().replace(/[^\d]/g, '')) : 500;
    const resetDate = resetMatch ? resetMatch[1].trim() : null;

    log(`Extracted usage data: ${used}/${total}, Reset: ${resetDate}`);
    return { used, total, resetDate };
  };

  const getManualBillingDay = () => {
    return GM_getValue('paymentDay', '');
  };

  const setManualBillingDay = (day) => {
    GM_setValue('paymentDay', day);
  };

  const calculateDaysSinceReset = (resetDateStr) => {
    // Check for manual override first - handle non-string values safely
    const manualDay = getManualBillingDay();
    let resetDate;

    // Safely check if manualDay is a valid string with content
    const manualDayStr = typeof manualDay === 'string' ? manualDay.trim() : String(manualDay || '').trim();

    if (manualDayStr && manualDayStr !== '' && !isNaN(manualDayStr)) {
      // Use manual billing day
      const today = new Date();
      const billingDay = parseInt(manualDayStr, 10);

      if (billingDay >= 1 && billingDay <= 31) {
        resetDate = new Date(today.getFullYear(), today.getMonth(), billingDay);

        // If billing day hasn't occurred this month, use last month
        if (resetDate > today) {
          resetDate.setMonth(resetDate.getMonth() - 1);
        }

        log(`Using manual billing day: ${billingDay}, calculated reset date: ${resetDate}`);
      } else {
        log(`Invalid manual billing day: ${billingDay}, falling back to extracted date`);
      }
    }

    // If no valid manual date or manual date failed, use page-extracted reset date
    if (!resetDate && resetDateStr) {
      try {
        resetDate = new Date(resetDateStr);
        log(`Using extracted reset date: ${resetDate}`);
      } catch (e) {
        error('Failed to parse reset date:', e);
        return null;
      }
    }

    if (!resetDate) {
      log('No reset date available (manual or extracted)');
      return null;
    }

    const today = new Date();
    const diffTime = today - resetDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Estimate next reset (assuming monthly billing)
    const nextReset = new Date(resetDate);
    nextReset.setMonth(nextReset.getMonth() + 1);
    const totalDays = Math.floor((nextReset - resetDate) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - diffDays);

    return { daysPassed: diffDays, totalDays, remainingDays, resetDate, nextReset };
  };

  const createProgressBar = (percentage, color = colors.cursor.barColor) => {
    const actualPercentage = Math.min(percentage, 100); // Cap main bar at 100%
    
    const container = $('<div>').addClass(progressBarContainerCls);

    // Main progress bar (always stays within its bounds)
    const mainBarContainer = $('<div>')
      .addClass(progressBarMainCls)
      .append(
        $('<div>')
          .addClass(progressBarFillCls)
          .css({
            'background-color': color,
            'width': `${actualPercentage}%`
          })
      )
      .append(
        $('<div>')
          .addClass(progressBarTrackCls)
          .css('background-color', color)
      );

    container.append(mainBarContainer);

    // Add overflow boxes if over 100%
    if (percentage > 100) {
      const overflowContainer = $('<div>').addClass(progressOverflowContainerCls);

      // overflow boxes using Array.from to avoid for loop
      Array.from({ length: 2 }, (_, i) =>
        $('<div>')
          .addClass(progressOverflowBoxCls)
          .css({
            'background-color': color,
            'right': `-${(i + 1) * 8 + 4}px`,
            'width': `${8 / (i + 1)}px`
          })
      ).forEach(box => overflowContainer.append(box));

      container.append(overflowContainer);
    }

    return container;
  };

  // Helper function for highlighting values in text
  const createStyledText = (parts) => {
    const container = $('<span>');

    parts.forEach(part => {
      if (typeof part === 'string') {
        container.append(document.createTextNode(part));
      } else if (part.value !== undefined) {
        const valueSpan = $('<span>')
          .addClass(highlightValueCls)
          .text(part.value);
        container.append(valueSpan);
      }
    });

    return container;
  };

  // Helper function for proper pluralization
  const pluralize = (count, singular, plural = null) => {
    const num = parseFloat(count);
    if (num === 1) {
      return singular;
    }
    return plural || singular + 's';
  };

  const createStatsColumn = ({
    mainValue,
    secondaryValue = null,
    progressPercent,
    progressColor,
    title,
    description
  }) => {
    const mainNumberDiv = $('<div>')
      .addClass('flex items-baseline gap-1.5 w-full min-w-0 overflow-hidden')
      .append(
        $('<span>')
          .addClass('[&_b]:md:font-semibold [&_strong]:md:font-semibold text-xl sm:text-2xl leading-tight tracking-tight font-medium flex-shrink-0')
          .text(mainValue)
      );

    // Add secondary value if provided (like "/ 500" or "avg/day")
    if (secondaryValue) {
      mainNumberDiv.append(
        $('<span>')
          .addClass('[&_b]:md:font-semibold [&_strong]:md:font-semibold text-lg sm:text-xl leading-tight tracking-tight font-medium opacity-30 truncate')
          .text(secondaryValue)
      );
    }

    const descriptionElement = $('<p>')
      .addClass('[&_b]:md:font-semibold [&_strong]:md:font-semibold tracking-4 md:text-sm/[1.25rem] text-xs sm:text-sm leading-snug text-brand-gray-300');

    // Handle both string and jQuery element descriptions
    if (typeof description === 'string') {
      descriptionElement.text(description);
    } else {
      descriptionElement.append(description);
    }

    return $('<div>')
      .addClass('flex flex-col gap-4 p-2')
      .append(
        $('<div>')
          .addClass('flex flex-col gap-2 w-full min-w-0')
          .append(mainNumberDiv)
          .append(createProgressBar(progressPercent, progressColor))
          .append(
            $('<span>')
              .addClass('[&_b]:md:font-semibold [&_strong]:md:font-semibold text-sm sm:text-base leading-tight tracking-tight font-medium opacity-80')
              .text(title)
          )
      )
      .append(descriptionElement);
  };

  const createTrackerCard = (usageData, daysInfo) => {
    const { used, total, resetDate } = usageData;
    const usagePercent = (used / total * 100).toFixed(1);

    const header = $('<div>')
      .addClass('flex items-center gap-2 mb-2 ml-2')
      .append(
        $('<h3>')
          .addClass('[&_b]:md:font-semibold [&_strong]:md:font-semibold text-lg sm:text-xl leading-tight tracking-tight font-medium')
          .text('Usage Tracker')
      )
      .append(
        $('<span>')
          .addClass(sigCls)
          .attr('title', 'Enjoying this script? Consider a small donation.')
          .text('by monnef')
      )
      .append(
        $('<button>')
          .addClass(buttonWhiteCls)
          .css({
            'margin-left': 'auto',
            'padding': '6px',
            'width': '32px',
            'height': '32px',
            'display': 'flex',
            'align-items': 'center',
            'justify-content': 'center'
          })
          .attr('title', 'Settings of Usage Tracker UserScript')
          .append(createLucideIcon({ iconName: 'settings', size: '24px', invert: true }))
          .on('click', () => $(`.${settingsModalCls}`).show())
      );

    const gridContainer = $('<div>').addClass('grid grid-cols-1 gap-6 lg:grid-cols-3');

    if (daysInfo) {
      const { daysPassed, totalDays, remainingDays } = daysInfo;
      const daysPercent = (daysPassed / totalDays * 100).toFixed(1);
      const avgPerDay = daysPassed > 0 ? (used / daysPassed).toFixed(1) : '0.0';

      // Calculate theoretical daily allowance based on standard month (30 days)
      const daysInMonth = 30; // Standard month for calculation
      const theoreticalDailyAllowance = total / daysInMonth;
      const avgPerDayPercent = Math.min((avgPerDay / theoreticalDailyAllowance) * 100, 100);

      const optimalUsesPerDay = total / totalDays; // Keep this for the last column

      // Fix the logic for the last column
      const remainingUses = total - used;
      const remainingUsesPerDay = remainingDays > 0 ? remainingUses / remainingDays : 0;
      const remainingUsesPercent = (remainingUsesPerDay / optimalUsesPerDay) * 100;

      // Create Days Elapsed column with styled description
      const daysColumn = createStatsColumn({
        mainValue: daysPassed,
        secondaryValue: `/ ${totalDays}`,
        progressPercent: daysPercent,
        progressColor: '#A3BE8C',
        title: pluralize(daysPassed, 'Day', 'Days') + ' Elapsed',
        description: createStyledText([
          { value: remainingDays },
          ' ',
          pluralize(remainingDays, 'day'),
          ' remaining in current cycle.'
        ])
      });

      // Premium Requests/Day column - using totalUsesPerMonth / daysInMonth
      const usageColumn = createStatsColumn({
        mainValue: avgPerDay,
        secondaryValue: `/ ${theoreticalDailyAllowance.toFixed(1)}`,
        progressPercent: avgPerDayPercent,
        progressColor: colors.cursor.barColor,
        title: 'Premium Requests/Day',
        description: createStyledText([
          'Current average: ',
          { value: avgPerDay },
          ' requests per day since cycle started.'
        ])
      });

      // Create Remaining Uses/Day column - fixed logic
      const metricsColumn = createStatsColumn({
        mainValue: remainingUsesPerDay.toFixed(1),
        secondaryValue: `/ ${optimalUsesPerDay.toFixed(1)}`,
        progressPercent: remainingUsesPercent,
        progressColor: '#D08770',
        title: 'Remaining Uses/Day',
        description: createStyledText([
          'You have ',
          { value: remainingUsesPerDay.toFixed(1) },
          ' uses per day available for the remaining ',
          { value: remainingDays },
          ' ',
          pluralize(remainingDays, 'day'),
          '.'
        ])
      });

      gridContainer
        .append(daysColumn)
        .append(usageColumn)
        .append(metricsColumn);
    }

    const card = $('<div>')
      .addClass('rounded-xl border-brand-neutrals-100 text-brand-foreground dark:border-brand-neutrals-800 dark:shadow-none shadow-[0px_51px_20px_rgba(186,186,186,0.01),0px_29px_17px_rgba(186,186,186,0.05),0px_13px_13px_rgba(186,186,186,0.09),0px_3px_7px_rgba(186,186,186,0.1)] border-0 bg-brand-dashboard-card p-6 dark:bg-brand-dashboard-card')
      .addClass(trackerCardCls)
      .append(header)
      .append(gridContainer);

    return card;
  };

  const createSettingsModal = () => {
    const modal = $('<div>')
      .addClass(modalCls)
      .addClass(settingsModalCls);

    const modalContent = $('<div>')
      .addClass(modalContentCls);

    const closeBtn = $('<span>')
      .addClass(modalCloseCls)
      .text('×')
      .on('click', () => {
        // Clear error message when closing
        errorMessage.hide();
        modal.hide();
      });

    const title = $('<h2>')
      .css({
        'display': 'flex',
        'align-items': 'center',
        'gap': '8px',
        'margin-bottom': '20px'
      })
      .append($('<span>').text('Settings'))
      .append(createLucideIcon({ iconName: 'settings', size: '32px', invert: true }));

    const description = $('<p>').text('Enter the day of the month when you are billed (1-31):');

    const input = $('<input>')
      .addClass(inputCls)
      .attr({
        'type': 'number',
        'min': '1',
        'max': '31'
      })
      .val(getManualBillingDay() || '');

    const tip = $('<p>')
      .addClass('text-sm text-gray-500 mt-1')
      .text('You can find your billing date via the "Manage Subscription" button on the left.');

    const errorMessage = $('<div>')
      .addClass(errorMessageCls)
      .hide();

    const saveButton = $('<button>')
      .addClass(buttonCls)
      .text('Save')
      .css('margin-right', '10px')
      .on('click', () => {
        const newPaymentDay = parseInt(input.val(), 10);
        if (newPaymentDay && newPaymentDay >= 1 && newPaymentDay <= 31) {
          setManualBillingDay(newPaymentDay);
          log(`Payment day has been set to: ${newPaymentDay}`);
          modal.hide();
          setTimeout(init, 100);
        } else {
          errorMessage.text('Invalid input. Please enter a number between 1 and 31.').show();
        }
      });

    const clearButton = $('<button>')
      .addClass(buttonCls)
      .text('Clear')
      .on('click', () => {
        setManualBillingDay('');
        log('Payment day cleared');
        modal.hide();
        setTimeout(init, 100);
      });

    modalContent
      .append(closeBtn)
      .append(title)
      .append(description)
      .append(input)
      .append(tip)
      .append(errorMessage)
      .append($('<br>'))
      .append(saveButton)
      .append(clearButton);

    modal.append(modalContent);

    // Clear error message when clicking outside
    modal.on('click', (e) => {
      if (e.target === modal[0]) {
        errorMessage.hide();
        modal.hide();
      }
    });

    return modal;
  };

  const createDonationModal = () => {
    const modal = $('<div>')
      .addClass(modalCls)
      .addClass(donationModalCls);

    const modalContent = $('<div>')
      .addClass(modalContentCls);

    const closeBtn = $('<span>')
      .addClass(modalCloseCls)
      .text('×')
      .on('click', () => modal.hide());

    const title = $('<h2>')
      .css({
        'display': 'flex',
        'align-items': 'center',
        'gap': '8px'
      })
      .append($('<span>').text('Donate').addClass('text-2xl'))
      .append(createLucideIcon({ iconName: 'heart-handshake', size: '32px', invert: true }));

    const description = $('<p>')
      .css('opacity', '0.8')
      .text('Thank you for considering a donation! Your support helps maintain and improve this script.');

    const hr = $('<hr>').addClass(hrCls);

    const bitcoinLabel = $('<p>')
      .css({
        'margin': '15px 0 10px 0',
        'font-weight': '500'
      })
      .text('Bitcoin Address:');

    const bitcoinContainer = $('<div>')
      .css({
        'display': 'flex',
        'align-items': 'center'
      });

    const bitcoinInput = $('<input>')
      .addClass(inputCls)
      .addClass(inputWithButtonCls)
      .attr({
        'type': 'text',
        'value': bitcoinAddress,
        'readonly': true
      });

    const bitcoinCopyBtn = $('<button>')
      .addClass(copyButtonCls)
      .attr('data-copy', bitcoinAddress)
      .append(createLucideIcon({ iconName: 'copy', size: '24px', invert: true }));

    bitcoinContainer.append(bitcoinInput).append(bitcoinCopyBtn);

    const paymentLabel = $('<p>')
      .css({
        'margin': '15px 0 10px 0',
        'font-weight': '500'
      })
      .text('Payment Link:');

    const paymentContainer = $('<div>')
      .css({
        'display': 'flex',
        'align-items': 'center'
      });

    const paymentInput = $('<input>')
      .addClass(inputCls)
      .addClass(inputWithButtonCls)
      .attr({
        'type': 'text',
        'value': bitcoinPaymentLink,
        'readonly': true
      });

    const paymentCopyBtn = $('<button>')
      .addClass(copyButtonCls)
      .attr('data-copy', bitcoinPaymentLink)
      .append(createLucideIcon({ iconName: 'copy', size: '24px', invert: true }));

    paymentContainer.append(paymentInput).append(paymentCopyBtn);

    modalContent
      .append(closeBtn)
      .append(title)
      .append(description)
      .append(hr)
      .append(bitcoinLabel)
      .append(bitcoinContainer)
      .append(paymentLabel)
      .append(paymentContainer);

    modal.append(modalContent);

    // Copy functionality - update to handle icon buttons
    modal.find(`.${copyButtonCls}`).on('click', async function () {
      const button = $(this);
      const textToCopy = button.attr('data-copy');
      const originalContent = button.html();

      try {
        await navigator.clipboard.writeText(textToCopy);
        button.html(createLucideIcon({ iconName: 'check', size: '16px', invert: true })[0].outerHTML);
        setTimeout(() => button.html(originalContent), 2000);
      } catch (err) {
        error('Clipboard write failed:', err);
        button.html(createLucideIcon({ iconName: 'x', size: '16px', invert: true })[0].outerHTML);
        setTimeout(() => button.html(originalContent), 2000);
      }
    });

    // Close on outside click
    modal.on('click', (e) => {
      if (e.target === modal[0]) modal.hide();
    });

    return modal;
  };

  const init = () => {
    // Only run on dashboard page
    if (!window.location.pathname.includes('/dashboard')) {
      log('Not on dashboard page, retrying in 1 second...');
      setTimeout(init, 1000);
      return;
    }

    log('Initializing on dashboard page');

    // Remove existing tracker card
    $(`.${trackerCardCls}`).remove();

    const usageData = extractUsageData();
    if (!usageData) {
      log('Could not extract usage data, retrying in 1 second...');
      setTimeout(init, 1000);
      return;
    }

    const daysInfo = calculateDaysSinceReset(usageData.resetDate);
    const trackerCard = createTrackerCard(usageData, daysInfo);

    // Insert after the original usage card
    const originalCard = getUsageCard();
    if (originalCard.length) {
      originalCard.after(trackerCard);
      log('Usage tracker card inserted successfully');

      // Add donation modal click handler
      trackerCard.find(`.${sigCls}`).on('click', () => {
        $(`.${donationModalCls}`).show();
      });
    } else {
      error('Could not find original usage card to insert tracker after');
      // Retry in a bit
      setTimeout(init, 1000);
    }
  };

  // Initialize when document is ready
  $(document).ready(() => {
    log('Usage Tracker v2 loaded');

    // Add styles
    $('head').append($('<style>').text(styles));

    // Preload icons
    ['settings', 'heart-handshake', 'copy', 'check', 'x']
      .map(iconName => createLucideIcon({ iconName }))
      .forEach(icon => $('body').append(icon))
      ;

    // Add modals to body
    $('body')
      .append(createDonationModal())
      .append(createSettingsModal());

    // Start the continuous check for dashboard page
    setTimeout(init, 1000);

    // Re-run when navigation happens (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        log('URL changed, reinitializing');
        setTimeout(init, 500);
      }
    }).observe(document, { subtree: true, childList: true });

    // Debug helper - tests
    unsafeWindow.usageTracker = {
      reinit: init,
      extractUsageData: extractUsageData,
      calculateDaysSinceReset: calculateDaysSinceReset,
      getManualBillingDay: getManualBillingDay,
      setManualBillingDay: setManualBillingDay,
      createLucideIcon: createLucideIcon,
      colors: colors,
      version: '2.0'
    };
  });
})();
