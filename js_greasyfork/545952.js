// ==UserScript==
// @name          TweaxBD - Ultimate Features with Enhanced Usability
// @namespace     eLibrarian-userscripts
// @version       0.0.1
// @author        eLibrarian
// @description   TweaxBD enhances TorrentBD with powerful features and interface tweaks that improve the overall browsing experience!
// @license       GPL-3.0-or-later
// @match         https://*.torrentbd.net/*
// @match         https://*.torrentbd.com/*
// @match         https://*.torrentbd.org/*
// @match         https://*.torrentbd.me/*
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/545952/TweaxBD%20-%20Ultimate%20Features%20with%20Enhanced%20Usability.user.js
// @updateURL https://update.greasyfork.org/scripts/545952/TweaxBD%20-%20Ultimate%20Features%20with%20Enhanced%20Usability.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const Utils = {
    isPage: (path) => {
      return window.location.pathname === path;
    },
    isPersonalFreeleech: () => {
      return Array.from(document.querySelectorAll('.profile-info-table td')).some(td => td.textContent.includes("Freeleech"));
    },
    extractNumber: (text) => {
      const match = text.replace(/,/g, '').match(/[-+]?[0-9]*\.?[0-9]+/);
      return match ? parseFloat(match[0]) : 0;
    },
    convertToGiB: (sizeText) => {
      const size = Utils.extractNumber(sizeText);
      if (sizeText.includes("TiB")) return size * 1024;
      if (sizeText.includes("PiB")) return size * 1024 * 1024;
      if (sizeText.includes("GiB")) return size;
      if (sizeText.includes("MiB")) return size / 1024;
      if (sizeText.includes("KiB")) return size / (1024 * 1024);
      if (sizeText.includes("Bytes")) return size / (1024 ** 3);
      return size;
    },
    convertSeedtimeToHours: (seedtime) => {
        if (!seedtime || seedtime === '-') return 0;
        let hours = 0;
        const d = seedtime.match(/(\d+)d/);
        const h = seedtime.match(/(\d+)h/);
        const m = seedtime.match(/(\d+)mo/);
        const y = seedtime.match(/(\d+)y/);
        if (d) hours += parseInt(d[1]) * 24;
        if (h) hours += parseInt(h[1]);
        if (m) hours += parseInt(m[1]) * 30 * 24;
        if (y) hours += parseInt(y[1]) * 365 * 24;
        return hours;
    },
    formatNumber: (number) => {
      if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
      if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
      if (number >= 1e3) return (number / 1e3).toFixed(2) + 'K';
      return number.toFixed(2);
    },
    formatNumberWithCommas: (number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatTraffic: (number) => {
      return number >= 1024 * 1024 ? (number / (1024 * 1024)).toFixed(2) + ' PiB' : number >= 1024 ? (number / 1024).toFixed(2) + ' TiB' : number.toFixed(2) + ' GiB';
    },
    timeMessage: (hours) => {
      const remaining = {
        years: hours / Utils.timeMultipliers.year,
        months: hours / Utils.timeMultipliers.month,
        weeks: hours / Utils.timeMultipliers.week,
        days: hours / Utils.timeMultipliers.day,
        hours: hours
      };
      if (remaining.years >= 1) return `${remaining.years.toFixed(2)} years`;
      if (remaining.months >= 1) return `${remaining.months.toFixed(2)} months`;
      if (remaining.weeks >= 1) return `${remaining.weeks.toFixed(2)} weeks`;
      if (remaining.days >= 1) return `${remaining.days.toFixed(2)} days`;
      return `${remaining.hours.toFixed(2)} hours`;
    },
    findValueByLabels: (wrappers, labels) => {
      return (wrappers.find(w => labels.includes(w.querySelector('.cr-label')?.textContent.trim()))?.querySelector('.cr-value')?.textContent.trim().replace(/^.*?:\s*/, '').replace(/,/g, '') || '-');
    },
    showToast: (message) => {
      const existingToast = document.querySelector('.toast-notification');
      if (existingToast) existingToast.remove();

      const toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.textContent = message;

      Object.assign(toast.style, {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#333', color: '#fff', padding: '15px', borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', opacity: '0', transition: 'opacity 0.5s ease-in-out', zIndex: '1000', textAlign: 'center', fontSize: '14px'
      });

      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = '1'; }, 100);
      setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => { toast.remove(); }, 500); }, 3000);
    },
    labelMappings: {
      '.short-links': {
        'Torrent Uploads': 'Torrents',
        'Upload Rep': 'Reputations',
        'Forum Rep': 'Upvotes',
        'Seed Time': 'SeedTime',
        'Uploader Rep': 'Reputations'
      },
      'td.center-align': {
        'Total Seed Size:': 'Size:',
        'Avg Seed Time:': 'Avg:',
        'Total Downloaded:': 'Downloaded:',
        'Total Uploaded:': 'Uploaded:',
        'Avg Ratio:': 'Ratio:'
      },
      '.cr-wrapper .cr-label': {
        'Seeding now': 'Activity',
        'Current Seed Size': 'SeedSize',
        'Seedbonus Rate': 'BonusRate',
        'Avg Upload': 'UploadRate',
        'Avg Seed time': 'SeedTime'
      }
    },
    timeMultipliers: {
      day: 24,
      week: 168,
      month: 720,
      year: 8760
    }
  };

  const TweaxBD = () => {
    const colorSelector = "B";
    const colors = {
      A: `#FFFF00, #FFFF00, #00FF00, #0099FF,
         #001AFF, #A200FF, #FF0055, #FF0000,
         #FF5900, #FF5900`,

      B: `#E84817, #B31451, #1A7EA2, #1A9E7F`,

      C: `#FF0000, #FFFF00, #00FF00, #0099FF,
          #001AFF, #A200FF, #A200FF, #FF0055,
          #FF0000, #FF0055`,

      D: `#FFFF00, #00FF00, #0099FF, #001AFF,
          #A200FF, #FF0055, #FF0000, #FF0055`
    };

    const configPopup = `
      #tweaxbd-popup-container.tweaxbd-depth-2 {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: Poppins, sans-serif;
        border-radius: 4px;
        border: none;
        cursor: default;
        width: 450px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        max-height: 80vh;
      }
      #tweaxbd-popup-container.tweaxbd-depth-2::before,
      #tweaxbd-popup-container.tweaxbd-depth-2::after {
        content: '';
        z-index: -1;
        position: absolute;
        width: calc(100% + 6px);
        height: calc(100% + 6px);
        top: -3px;
        left: -3px;
        border-radius: 5px;
        background: linear-gradient(200deg, ${colors[colorSelector]});
        background-size: 300%;
        animation: border 12s linear infinite;
      }
      #tweaxbd-popup-container.tweaxbd-depth-2::after {
        filter: blur(12px);
      }

      #tweaxbd-popup-container.tweaxbd-day {
        background: #FFFFFF;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-heading {
        color: #000000;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-container-header {
        background: #F0F0F0;
      }
      #tweaxbd-popup-container.tweaxbd-day .tweaxbd-switch-label {
        color: #000000;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-items-container {
        background: #F2F2F2;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-save-container {
        background: #F0F0F0;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-close-btn {
        border: 1px solid rgba(0,0,0,.25);
        color: #333;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-close-btn:hover {
        background: #DD3333;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-theme-btn {
        border: 1px solid rgba(0,0,0,.25);
        color: #333;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-theme-btn:hover {
        background: #DDDDDD;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-import-btn,
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-export-btn {
        border: 1px solid rgba(0,0,0,.25);
        color: #333;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-import-btn:hover,
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-export-btn:hover {
        background: #DDDDDD;
      }

      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-tooltip-btn {
        border: 1px solid rgba(0,0,0,.25);
        color: #333;
      }
      #tweaxbd-popup-container.tweaxbd-day #tweaxbd-tooltip-btn:hover {
        background: #DDDDDD;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-tooltip-btn {
        border: 1px solid #CFD8DC;
        color: #FFF;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-tooltip-btn:hover {
        background: #2C3E50;
      }

      #tweaxbd-popup-container.tweaxbd-night {
        background: #171B23;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-heading {
        color: #FFF;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-container-header {
        background: #171B23;
      }
      #tweaxbd-popup-container.tweaxbd-night .tweaxbd-switch-label {
        color: #FFF;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-items-container {
        background: #2A2C32;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-save-container {
        background: #171B23;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-close-btn {
        border: 1px solid #CFD8DC;
        color: #FFF;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-close-btn:hover {
        background: #DF5353;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-theme-btn {
        border: 1px solid #CFD8DC;
        color: #FFF;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-theme-btn:hover {
        background: #2C3E50;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-import-btn,
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-export-btn {
        border: 1px solid #CFD8DC;
        color: #FFF;
      }
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-import-btn:hover,
      #tweaxbd-popup-container.tweaxbd-night #tweaxbd-export-btn:hover {
        background: #2C3E50;
      }

      #tweaxbd-theme-btn i,
      #tweaxbd-close-btn i,
      #tweaxbd-tooltip-btn i,
      #tweaxbd-import-btn i,
      #tweaxbd-export-btn i {
        font-size: 20px;
        line-height: 1;
        display: inline-block;
        vertical-align: middle;
      }

      .tweaxbd-info-text {
        font-size: 11.5px;
        line-height: 1.4;
        color: #aaa;
        background-color: rgba(255, 255, 255, 0.04);
        padding: 6px 8px;
        border-left: 3px solid #888;
        border-radius: 3px;
        margin: 5px auto 0px 5px;
        display: inline-block;
        max-width: calc(100% - 20%);
        word-wrap: break-word;
        vertical-align: middle;
        transition: all 0.2s ease-in-out;
      }

      #tweaxbd-container-header {
        border-radius: 4px 4px 0 0;
        align-items: center;
        padding: 4px;
        display: flex;
        justify-content: space-between;
      }
      #tweaxbd-container-header button {
        background-color: transparent;
        border: none;
        font-size: 16px;
        opacity: 0.7;
        transition: opacity 0.2s ease-in-out, transform 0.2s ease;
      }
      #tweaxbd-container-header button:hover {
        opacity: 1;
        transform: scale(1.1);
      }
      #tweaxbd-container-header button:active {
        transform: scale(0.95);
      }
      #tweaxbd-heading {
        margin-left: 4px;
        font-size: 1.5em;
        font-weight: 500;
      }
      #tweaxbd-theme-btn, #tweaxbd-close-btn, #tweaxbd-import-btn, #tweaxbd-export-btn, #tweaxbd-tooltip-btn {
        background: transparent;
        border-radius: 100px;
        width: 28px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin-left: 8px;
        transition: 200ms ease-in-out;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
      }

      #tweaxbd-body-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      #tweaxbd-items-container {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .tweaxbd-switch-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }

      .tweaxbd-switch-label {
        font-size: 15px;
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 8px;
      }

      .tweaxbd-info-icon {
        font-size: 14px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s ease-in-out;
      }
      .tweaxbd-info-icon:hover {
        opacity: 1;
      }

      .tweaxbd-toggle-switch {
        position: relative;
        width: 40px;
        height: 20px;
        background-color: #ccc;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .tweaxbd-toggle-switch.active {
        background-color: #4CAF50;
      }
      .tweaxbd-switch-button {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background-color: #ffffff;
        border-radius: 50%;
        transition: left 0.3s ease;
      }
      .tweaxbd-toggle-switch.active .tweaxbd-switch-button {
        left: 22px;
      }

      #tweaxbd-save-container {
        display: flex;
        justify-content: center;
        padding: 10px;
        border-radius: 0 0 4px 4px;
      }
      .tweaxbd-button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
        text-align: center;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .tweaxbd-button:hover {
        transform: translateY(-2px);
      }
      .tweaxbd-save-button {
        background-color: #007bff;
        color: #FFF;
        width: 100%;
        justify-content: center;
      }

      .tweaxbd-save-button:hover {
        background-color: #0069d9;
      }
      .tweaxbd-group-header {
        font-weight: bold;
        margin: 10px 0 5px;
        cursor: pointer;
      }
      .tweaxbd-group-header:hover {
        opacity: 0.8;
      }
      .tweaxbd-day .tweaxbd-group-header {
        color: #000000;
      }
      .tweaxbd-night .tweaxbd-group-header {
        color: #ffffff;
      }
      .tweaxbd-group-wrapper {
        margin-left: 10px;
        padding-left: 10px;
        border-left: 2px solid rgba(255,255,255,0.1);
      }
      .tweaxbd-day .tweaxbd-group-wrapper {
        border-left-color: rgba(0,0,0,0.1);
      }

      #tweaxbd-close-btn i {
        color:#ff5353;
        font-size:18px;
      }
      #tweaxbd-close-btn:hover i {
        color:#ff3a3a;
      }

      @keyframes border {
        0%,
        100% {
          background-position: 0 0;
        }
        50% {
          background-position: 100%;
        }
      }
    `;

    GM_addStyle(configPopup);

    let currentTheme = GM_getValue('tweaxbdTheme', 'night');
    let tooltipsVisible = GM_getValue('tweaxbdTooltipsVisible', false);

    const defaultConfig = [
      {
        name: "General Tweaks",
        key: "group_general",
        options: [
          { key: 'disableNonFreeleechEnabled', label: 'Disable Non-Freeleech', info: 'Disable downloads for torrents that are not freeleech if personal freeleech is not enabled', defaultState: false },
          { key: 'profileDetailsTweaksEnabled', label: 'Profile Details Tweaks', info: 'Show RepRate, Efficiency, and FlexZone in account-details page', defaultState: true },
          { key: 'seedbonusPageTweaksEnabled', label: 'Seedbonus Page Tweaks', info: 'Show seedbonus estimations and transform seedbonus table', defaultState: true },
          { key: 'autoExpandSeasonsEnabled', label: 'Auto Expand Seasons', info: 'Add toggle button to expand/collapse all seasons and episodes on TV pages', defaultState: true },
          { key: 'insertCopyIDsEnabled', label: 'Insert Copy IDs Buttons', info: 'Add buttons to copy topic ID and torrent ID', defaultState: true },
          { key: 'shoutboxTweaksEnabled', label: 'Shoutbox Tweaks', info: 'Focus on shoutbox input on hover and limit input length', defaultState: true },
          { key: 'customMovieSortingEnabled', label: 'Custom Movie Sorting', info: 'Add sorting options by size, seeders, leechers on movie pages', defaultState: true },
          { key: 'showTradeSummaryEnabled', label: 'Show Trade Summary', info: 'Display trade summary on seedbonus-history page', defaultState: true },
          { key: 'makeSortableEnabled', label: 'Enable Sorting', info: 'Enable sorting for breakdown and activity page', defaultState: true },
          { key: 'fixTotalRowEnabled', label: 'Load Dynamic Total Values', info: 'Enable dynamic total values', defaultState: true },
          { key: 'miscellaneousTweaksEnabled', label: 'Miscellaneous Tweaks', info: 'Open links in same tab, fix seedbonus logs, etc.', defaultState: true },
          { key: 'faqClipperEnabled', label: 'FAQ Clipper (Copy FAQs)', info: 'Copy FAQ links with titles as BBCode (Forum sharing)', defaultState: true },
          { key: 'torrentExportEnabled', label: 'Torrent Exporter', info: 'Copy or save torrent links & download torrent files as zip', defaultState: true },
        ]
      }
    ];

    defaultConfig.forEach(group => {
      group.options.forEach(option => {
        option.state = GM_getValue(option.key, option.defaultState);
      });
    });

    GM_registerMenuCommand('⚙️ Configurations', () => {
      showConfigPopup();
    });

    GM_registerMenuCommand('📥 Import', () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      fileInput.addEventListener('change', handleFileSelect);
      fileInput.click();
    });

    GM_registerMenuCommand('📤 Export', () => {
      const configStr = JSON.stringify(getCurrentConfig(), null, 2);
      const blob = new Blob([configStr], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tweaxConfig.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    let currentlyOpenInfo = null;

    const createSwitch = (option) => {
      const container = document.createElement('div');
      container.className = 'tweaxbd-switch-container';

      const labelWrapper = document.createElement('div');
      labelWrapper.style.display = 'flex';
      labelWrapper.style.flexDirection = 'column';
      labelWrapper.style.flexGrow = '1';

      const topRow = document.createElement('div');
      topRow.style.display = 'flex';
      topRow.style.justifyContent = 'space-between';
      topRow.style.alignItems = 'center';

      const label = document.createElement('span');
      label.className = 'tweaxbd-switch-label';
      label.style.fontSize = '15px';
      label.textContent = option.label;

      const rightControls = document.createElement('div');
      rightControls.style.display = 'flex';
      rightControls.style.alignItems = 'center';
      rightControls.style.gap = '8px';

      const infoIcon = document.createElement('span');
      infoIcon.className = 'tweaxbd-info-icon';
      infoIcon.textContent = '🛈';
      infoIcon.style.cursor = 'pointer';
      infoIcon.style.opacity = '0.6';
      infoIcon.style.transition = 'opacity 0.2s ease-in-out';
      infoIcon.style.display = tooltipsVisible ? 'none' : 'inline-block';

      infoIcon.addEventListener('mouseover', () => infoIcon.style.opacity = '1');
      infoIcon.addEventListener('mouseout', () => infoIcon.style.opacity = '0.6');

      const toggle = document.createElement('div');
      toggle.className = 'tweaxbd-toggle-switch ' + (option.state ? 'active' : '');
      toggle.addEventListener('click', () => {
        option.state = !option.state;
        toggle.classList.toggle('active');
      });

      const switchButton = document.createElement('div');
      switchButton.className = 'tweaxbd-switch-button';
      toggle.appendChild(switchButton);

      rightControls.appendChild(infoIcon);
      rightControls.appendChild(toggle);

      topRow.appendChild(label);
      topRow.appendChild(rightControls);

      const infoText = document.createElement('div');
      infoText.textContent = `${option.info}`;
      infoText.className = 'tweaxbd-info-text';
      infoText.style.display = tooltipsVisible ? 'block' : 'none';

      infoIcon.addEventListener('click', () => {
        document.querySelectorAll('.tweaxbd-info-text').forEach(el => {
          if (el !== infoText) el.style.display = 'none';
        });
        infoText.style.display = (infoText.style.display === 'block') ? 'none' : 'block';
        window.currentlyOpenInfoRef = (infoText.style.display === 'block') ? infoText : null;
      });

      labelWrapper.appendChild(topRow);
      labelWrapper.appendChild(infoText);
      container.appendChild(labelWrapper);

      container.hideInfoText = () => {
        if (infoText.style.display === 'block') {
          infoText.style.display = 'none';
          if (window.currentlyOpenInfoRef === infoText) window.currentlyOpenInfoRef = null;
        }
      };

      return container;
    };

    const showConfigPopup = () => {
      if (document.getElementById('tweaxbd-popup-container')) return;

      const container = document.createElement('div');
      container.id = 'tweaxbd-popup-container';
      container.className = 'tweaxbd-depth-2 tweaxbd-' + currentTheme;

      const header = document.createElement('div');
      header.id = 'tweaxbd-container-header';

      const title = document.createElement('h5');
      title.id = 'tweaxbd-heading';
      title.innerText = 'TweaxBD';

      const themeButton = document.createElement('button');
      themeButton.id   = 'tweaxbd-theme-btn';
      themeButton.innerHTML = `<i class="material-icons">${currentTheme === 'night' ? 'dark_mode' : 'light_mode'}</i>`;
      themeButton.title = 'Toggle Theme';
      themeButton.addEventListener('click', () => {
        currentTheme = (currentTheme === 'night') ? 'day' : 'night';
        GM_setValue('tweaxbdTheme', currentTheme);
        container.className = 'tweaxbd-depth-2 tweaxbd-' + currentTheme;
        themeButton.innerHTML = `<i class="material-icons">${currentTheme === 'night' ? 'dark_mode' : 'light_mode'}</i>`;
      });

      const tooltipButton = document.createElement('button');
      tooltipButton.id = 'tweaxbd-tooltip-btn';
      tooltipButton.innerHTML =
        `<i class="material-icons">${tooltipsVisible ? 'menu_book' : 'info_outline'}</i>`;
      tooltipButton.title = 'Toggle Tooltips';
      tooltipButton.classList.toggle('active', tooltipsVisible);
      tooltipButton.querySelector('i').textContent = tooltipsVisible ? 'menu_book' : 'info_outline';
      tooltipButton.title = 'Toggle Tooltips';
      tooltipButton.style.marginLeft = '8px';
      tooltipButton.addEventListener('click', () => {
        tooltipButton.classList.toggle('active', tooltipsVisible);
        tooltipsVisible = !tooltipsVisible;
        GM_setValue('tweaxbdTooltipsVisible', tooltipsVisible);
        tooltipButton.querySelector('i').textContent = tooltipsVisible ? 'menu_book' : 'info_outline';

        document.querySelectorAll('.tweaxbd-info-text').forEach(el => {
          el.style.display = tooltipsVisible ? 'block' : 'none';
        });
        document.querySelectorAll('.tweaxbd-info-icon').forEach(icon => {
          icon.style.display = tooltipsVisible ? 'none' : 'inline-block';
        });
      });

      const importButton = document.createElement('button');
      importButton.id = 'tweaxbd-import-btn';
      importButton.innerHTML = '<i class="material-icons">file_upload</i>';
      importButton.title = 'Import Config';
      importButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', handleFileSelect);
        fileInput.click();
      });

      const exportButton = document.createElement('button');
      exportButton.id = 'tweaxbd-export-btn';
      exportButton.innerHTML = '<i class="material-icons">file_download</i>';
      exportButton.title = 'Export Config';
      exportButton.addEventListener('click', () => {
        const configStr = JSON.stringify(getCurrentConfig(), null, 2);
        const blob = new Blob([configStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'tweaxConfig.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      const closeButton = document.createElement('button');
      closeButton.id = 'tweaxbd-close-btn';
      closeButton.innerHTML = '<i class="material-icons">close</i>';
      closeButton.title = 'Close Popup';
      closeButton.addEventListener('click', () => {
        container.remove();
      });

      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.alignItems = 'center';
      btnContainer.style.justifyContent = 'space-between';
      btnContainer.style.width = '100%';

      const leftSide = document.createElement('div');
      leftSide.style.display = 'flex';
      leftSide.style.alignItems = 'center';
      leftSide.appendChild(title);

      const rightSide = document.createElement('div');
      rightSide.style.display = 'flex';
      rightSide.style.alignItems = 'center';
      rightSide.appendChild(themeButton);
      rightSide.appendChild(tooltipButton);
      // rightSide.appendChild(importButton);
      // rightSide.appendChild(exportButton);
      rightSide.appendChild(closeButton);


      btnContainer.appendChild(leftSide);
      btnContainer.appendChild(rightSide);

      header.appendChild(btnContainer);

      const bodyContent = document.createElement('div');
      bodyContent.id = 'tweaxbd-body-content';

      const itemsContainer = document.createElement('div');
      itemsContainer.id = 'tweaxbd-items-container';

      const expandedGroups = [];

      function handleGroupToggle(groupHeader, groupWrapper) {
        const isVisible = groupWrapper.style.display === 'block';
        const label = groupHeader.textContent.replace(/^▸|▾/, '').trim();

        if (isVisible) {
          groupWrapper.style.display = 'none';
          groupHeader.textContent = '▸ ' + label;
          const index = expandedGroups.indexOf(groupWrapper);
          if (index !== -1) expandedGroups.splice(index, 1);

          groupWrapper.querySelectorAll('.tweaxbd-info-text').forEach(info => {
            info.style.display = 'none';
          });
        } else {
          groupWrapper.style.display = 'block';
          groupHeader.textContent = '▾ ' + label;
          expandedGroups.push(groupWrapper);

          const container = document.getElementById('tweaxbd-popup-container');
          while (container.offsetHeight > window.innerHeight * 0.8 && expandedGroups.length > 1) {
            const oldest = expandedGroups.shift();
            const header = oldest.previousElementSibling;
            oldest.style.display = 'none';
            if (header && header.classList.contains('tweaxbd-group-header')) {
              const lbl = header.textContent.replace(/^▸|▾/, '').trim();
              header.textContent = '▸ ' + lbl;
            }
          }
        }
      }

      defaultConfig.forEach(group => {
        const groupHeader = document.createElement('div');
        groupHeader.className = 'tweaxbd-group-header';
        groupHeader.textContent = '▸ ' + group.name;

        const groupWrapper = document.createElement('div');
        groupWrapper.className = 'tweaxbd-group-wrapper';
        groupWrapper.style.display = 'none';

        group.options.forEach(option => {
          const switchEl = createSwitch(option);
          groupWrapper.appendChild(switchEl);
        });

        groupHeader.addEventListener('click', () => handleGroupToggle(groupHeader, groupWrapper));

        itemsContainer.appendChild(groupHeader);
        itemsContainer.appendChild(groupWrapper);
      });

      const saveContainer = document.createElement('div');
      saveContainer.id = 'tweaxbd-save-container';

      const saveButton = document.createElement('button');
      saveButton.className = 'tweaxbd-button tweaxbd-save-button';
      saveButton.title = 'Save Config';
      saveButton.innerText = '💾 Save';
      saveButton.addEventListener('click', () => {
        saveConfig();
        container.remove();
      });
      saveContainer.appendChild(saveButton);

      container.appendChild(header);
      bodyContent.appendChild(itemsContainer);
      container.appendChild(bodyContent);
      container.appendChild(saveContainer);

      document.body.appendChild(container);
    };

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file && file.name === 'tweaxConfig.json') {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const config = JSON.parse(e.target.result);
            defaultConfig.forEach(group => {
              group.options.forEach(option => {
                if (config.hasOwnProperty(option.key)) {
                  option.state = config[option.key];
                }
              });
            });
            alert('Configuration imported successfully.');
            saveConfig();
            updateSwitchesState();
          } catch (e) {
            alert('Invalid configuration format.');
          }
        };
        reader.readAsText(file);
      } else {
        alert('Please select a valid "tweaxConfig.json" file.');
      }
    };

    const getCurrentConfig = () => {
      const config = {};
      defaultConfig.forEach(group => {
        group.options.forEach(option => {
          config[option.key] = option.state;
        });
      });
      return config;
    };

    const saveConfig = () => {
      defaultConfig.forEach(group => {
        group.options.forEach(option => {
          GM_setValue(option.key, option.state);
        });
      });
      alert('Configuration saved successfully.');
    };

    const updateSwitchesState = () => {
      defaultConfig.forEach(option => {
        const labelElements = document.querySelectorAll('.tweaxbd-switch-label');
        labelElements.forEach(labelEl => {
          let labelText = labelEl.textContent.replace('🛈','').trim();
          if (labelText === option.label) {
            const toggle = labelEl.parentElement.querySelector('.tweaxbd-toggle-switch');
            if (toggle.classList.contains('active') !== option.state) {
              toggle.classList.toggle('active');
            }
          }
        });
      });
    };

    window.tweaxConfig = () => getCurrentConfig();

    const config = getCurrentConfig();

    const changeLabels = () => {
      const updateLabels = (selector, mappings) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              let text = node.textContent;
              for (const [key, value] of Object.entries(mappings)) {
                if (text.includes(key)) {
                  node.textContent = text.replace(key, value);
                }
              }
            }
          });
        });
      }

      updateLabels('.cr-wrapper .cr-label', Utils.labelMappings['.cr-wrapper .cr-label']);
      updateLabels('td.center-align', Utils.labelMappings['td.center-align']);
      updateLabels('.short-links', Utils.labelMappings['.short-links']);
    }

    const profileDetailsTweaks = () => {
      const showRepRate = () => {
        const wrappers = [...document.querySelectorAll('.short-links')];
        const torrentsNode = wrappers.find(n => ['Torrents', 'Torrent Uploads'].some(term => n.textContent.includes(term)));
        const reputationsNode = wrappers.find(n => ['Reputations', 'Upload Rep'].some(term => n.textContent.includes(term)));

        if (torrentsNode && reputationsNode) {
          const torrentsValue = Utils.extractNumber(torrentsNode.querySelector('.short-link-counter').textContent.trim());
          const reputationsValue = Utils.extractNumber(reputationsNode.querySelector('.short-link-counter').textContent.trim());
          const repRate = torrentsValue > 0 ? (reputationsValue / torrentsValue).toFixed(2) : '0';

          if (![...document.querySelectorAll('.short-links')].some(el => el.textContent.includes('RepRate'))) {
            const repRateNode = document.createElement('div');
            repRateNode.className = 'short-links';
            repRateNode.innerHTML = `RepRate <span class="short-link-counter">${repRate}</span>`;
            reputationsNode.parentNode.insertBefore(repRateNode, reputationsNode.nextSibling);
          }
        }
      };
      const showEfficiency = () => {
        const wrappers = [...document.querySelectorAll('.cr-wrapper')];
        const sizeNode = wrappers.find(w => ['SeedSize', 'Current Seed Size'].includes(w.querySelector('.cr-label')?.textContent.trim()));
        const hourlySeedbonusNode = wrappers.find(w => ['BonusRate', 'Seedbonus Rate'].includes(w.querySelector('.cr-label')?.textContent.trim()));

        if (sizeNode && hourlySeedbonusNode) {
          const sizeValue = Utils.convertToGiB(sizeNode.querySelector('.cr-value').textContent.replace(/,/g, ''));
          const hourlySeedbonusValue = Utils.extractNumber(hourlySeedbonusNode.querySelector('.cr-value').textContent.replace(/,/g, ''));
          const efficiency = sizeValue ? (hourlySeedbonusValue / sizeValue).toFixed(2) : '0';

          if (![...document.querySelectorAll('.cr-wrapper .cr-label')].some(el => el.textContent.includes('Efficiency'))) {
            const newWrapper = document.createElement('div');
            newWrapper.className = 'cr-wrapper';
            newWrapper.innerHTML = `<div class="cr-label">Efficiency</div><div class="cr-value"> : ${efficiency}/GiB</div>`;
            hourlySeedbonusNode.after(newWrapper);
          }
        }
      };
      const showFlexZone = () => {
        const getTextContent = (selector, regex = null, defaultValue = '-') => {
          return document.querySelector(selector)?.textContent.trim().match(regex)?.[1] || document.querySelector(selector)?.textContent.trim() || defaultValue;
        }
        const getAttributeMatch = (selector, attribute, regex = null, defaultValue = '-') => {
          return document.querySelector(selector)?.getAttribute(attribute)?.match(regex)?.[1] || defaultValue;
        }
        const createFlexZoneRow = (label, value) => `
          <div class="cr-wrapper">
            <div class="cr-label">${label}</div>
            <div class="cr-value">: ${value}</div>
          </div>
        `;

        const linksSection = document.querySelector('div.col:nth-child(2)');
        if (linksSection) {
          const repRate = getTextContent('div.short-links:nth-child(3) > span:nth-child(1)');
          const popularity = getAttributeMatch('div.tp-container', 'title', /^(\d+(\.\d+)?)/);
          const wrappers = [...document.querySelectorAll('.cr-wrapper')];
          const seedSize = Utils.findValueByLabels(wrappers, ['SeedSize', 'Current Seed Size']);
          const bonusRate = Utils.findValueByLabels(wrappers, ['BonusRate', 'Seedbonus Rate']);
          const efficiency = Utils.findValueByLabels(wrappers, ['Efficiency']);
          const uploadRate = Utils.findValueByLabels(wrappers, ['UploadRate', 'Avg Upload']);
          const seedTime = Utils.findValueByLabels(wrappers, ['SeedTime', 'Avg Seed time']);

          const flexZoneSection = document.createElement('div');
          flexZoneSection.classList.add('col', 's12', 'm5');
          flexZoneSection.innerHTML = `
            <h6 class="sub-h6">FlexZone</h6>
            <div class="margin-b-10">
              ${createFlexZoneRow('RepRate', repRate)}
              ${createFlexZoneRow('Popularity', popularity)}
              ${createFlexZoneRow('SeedSize', seedSize)}
              ${createFlexZoneRow('BonusRate', bonusRate)}
              ${createFlexZoneRow('Efficiency', efficiency)}
              ${createFlexZoneRow('UploadRate', uploadRate)}
              ${createFlexZoneRow('SeedTime', seedTime)}
            </div>
          `;
          linksSection.parentNode.insertBefore(flexZoneSection, linksSection);
        }
      };

      showRepRate();
      showEfficiency();
      showFlexZone();
    }

    const seedbonusPageTweaks = () => {
      const showSeedbonusEstimation = () => {
        const createLink = (text, title, color, hoverColor, fontSize = '1em') => {
          const link = document.createElement('a');
          link.href = 'seedbonus-breakdown.php';
          link.title = title;
          link.style = `font-weight: bold; color: ${color}; text-decoration: none; transition: color 0.3s; font-size: ${fontSize};`;
          link.innerHTML = text;
          link.addEventListener('mouseover', () => { link.style.color = hoverColor; });
          link.addEventListener('mouseout', () => { link.style.color = color; });
          return link;
        };

        const seedBonusElement = document.querySelector('.center-align.tx-1-1');
        if (!seedBonusElement) return; // keep page as-is

        const raw   = seedBonusElement.textContent.trim().replace(/,/g, '');
        const match = raw.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+)\s*=\s*(\d+(?:\.\d+)?)/i);

        // Prefer the TOTAL from "a x b = c"; otherwise try to extract a standalone number.
        const extracted = match ? parseFloat(match[3]) : Utils.extractNumber(raw);
        const hourlyPoints = Number.isFinite(extracted) && extracted > 0 ? extracted : null;

        // No detectable hourly rate? Leave DOM untouched.
        if (!match && hourlyPoints == null) return;

        const displayPoints = match
          ? `${parseFloat(match[1]).toFixed(2)} <span style="color:#ff0000;"
               onmouseover="this.style.color='#d00';"
               onmouseout="this.style.color='#ff0000';">
               x${parseInt(match[2],10)} = ${parseFloat(match[3]).toFixed(2)}
             </span>`
          : `${hourlyPoints.toFixed(2)}`;

        const seedPoints = Object.fromEntries(
          Object.entries(Utils.timeMultipliers).map(([period, multiplier]) => [period, hourlyPoints * multiplier])
        );

        const linkConfigs = {
          hour:  { text: displayPoints,                               title: 'Click to see details seedbonus breakdown', color: '#66ff66', hoverColor: '#5fe3b7', fontSize: '1.5em' },
          day:   { text: `${Utils.formatNumber(seedPoints.day)}/day`,  title: `${seedPoints.day.toFixed(2)} per day`,    color: '#4caf50', hoverColor: '#a6f5a6' },
          week:  { text: `${Utils.formatNumber(seedPoints.week)}/week`,title: `${seedPoints.week.toFixed(2)} per week`,  color: '#2196f3', hoverColor: '#90d8ff' },
          month: { text: `${Utils.formatNumber(seedPoints.month)}/month`, title: `${seedPoints.month.toFixed(2)} per month`, color: '#ffab40', hoverColor: '#ffe680' },
          year:  { text: `${Utils.formatNumber(seedPoints.year)}/year`, title: `${seedPoints.year.toFixed(2)} per year`, color: '#ff7043', hoverColor: '#ffa480' }
        };

        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode('If you continue seeding, you will receive upto '));
        fragment.appendChild(createLink(linkConfigs.hour.text, linkConfigs.hour.title, linkConfigs.hour.color, linkConfigs.hour.hoverColor, linkConfigs.hour.fontSize));
        fragment.appendChild(document.createTextNode(' points per hour.'));
        fragment.appendChild(document.createElement('br'));
        fragment.appendChild(document.createTextNode('Resulting '));

        const intervals = ['day', 'week', 'month', 'year'];
        intervals.forEach((period, index) => {
          fragment.appendChild(createLink(linkConfigs[period].text, linkConfigs[period].title, linkConfigs[period].color, linkConfigs[period].hoverColor));
          fragment.appendChild(document.createTextNode(index < intervals.length - 1 ? ', ' : '.'));
        });

        const displayMessage = (currentSeedBonus, billionairePoints, millionairePoints, hoursToBillionaire, hoursToMillionaire) => {
          fragment.appendChild(document.createElement('br'));
          let message = '';

          if (currentSeedBonus >= billionairePoints) {
            message = `Congratulations, you're already a <span class="tbdrank star-uploader">billionaire</span>! 🎉`;
          } else if (currentSeedBonus >= millionairePoints) {
            message = `You're already a <span class="tbdrank wizard">millionaire</span>! 🎉 Keep it up! You are approximately <span class="tbdrank mvp">${Utils.timeMessage(hoursToBillionaire)}</span> away from becoming a <span class="tbdrank star-uploader">billionaire</span>.`;
          } else {
            message = `You're on your way to becoming a <span class="tbdrank wizard">millionaire</span>! It will take you approximately <span class="tbdrank mvp">${Utils.timeMessage(hoursToMillionaire)}</span> to get there.`;
          }

          const span = document.createElement('span');
          span.innerHTML = message;
          fragment.appendChild(span);
        };

        const currentSeedBonusEl = document.querySelector('h5.intro-h.center-align span');
        const currentSeedBonus = currentSeedBonusEl ? parseFloat(currentSeedBonusEl.textContent.replace(/,/g, '')) : 0;

        const millionairePoints = 1_000_000;
        const billionairePoints = 1_000_000_000;

        const hoursToMillionaire = Math.max(millionairePoints - currentSeedBonus, 0) / hourlyPoints;
        const hoursToBillionaire = Math.max(billionairePoints - currentSeedBonus, 0) / hourlyPoints;

        displayMessage(currentSeedBonus, billionairePoints, millionairePoints, hoursToBillionaire, hoursToMillionaire);

        seedBonusElement.innerHTML = '';
        seedBonusElement.appendChild(fragment);
      };
      const transformSeedbonusTable = () => {
        const targetDiv = document.getElementById('pre-notes-trg');
        if (targetDiv) {
          targetDiv.innerHTML = `
            <div class="note">For every 60 Minutes of seeding you will receive Seedbonus points per torrent according to the following criteria:</div>
            <div class="overflow-x">
              <table class="table boxed sbpd-table">
                <thead>
                  <tr><th style="width: 30%;" class="center-align">Torrent Size</th><th style="width: 50%;">Hourly Seedbonus rate</th><th style="width: 20%;" class="center-align">Hourly Limit</th></tr>
                </thead>
                <tbody>
                  <tr><td>Under 100 MiB</td><td style="text-align: left;">No points for torrents under 100 MiB.</td><td class="center-align"><span class="red-text">none</span></td></tr>
                  <tr><td>100 MiB ≤ size &lt; 1 GiB</td><td style="text-align: left;">Earn 0.4 points per torrent.</td><td class="center-align"><span class="red-text">200</span></td></tr>
                  <tr><td>1 GiB ≤ size &lt; 2 GiB</td><td style="text-align: left;">Earn up to 25 points per torrent.</td><td class="center-align" rowspan="3" valign="top"><span class="green-text">unlimited</span></td></tr>
                  <tr><td>2 GiB ≤ size &lt; 5 GiB</td><td style="text-align: left;">Earn up to 40 points per torrent.</td></tr>
                  <tr><td>Above 5 GiB</td><td style="text-align: left;">Earn up to 50 points per torrent.</td></tr>
                </tbody>
              </table>
            </div>
            <div class="note">For torrents over 1 GiB, points increase over time, and larger sizes earn them faster.</div>
            <div class="note">Receive <b>500 points</b> by filling a <a href="requests.php" target="_blank">Request</a>.</div>
            <div class="note">Receive <b>50 points</b> for every torrent you upload.</div>
            <div class="note">For every thanks/reputation point in your uploaded torrents, you will receive <b>5 points</b></div>
            <div class="note">A user can gift you up to <b>1000 points</b> in your uploaded torrent. So try to upload quality contents.</div>
          `;
        }
      };

      showSeedbonusEstimation();
      transformSeedbonusTable();
    }

    const insertToggleButton = () => {
      const seasonTriggers = [...document.querySelectorAll('.sc-trigger[href^="season"]')];
      const episodeTriggers = [...document.querySelectorAll('tr.epi-trigger')];

      if (!seasonTriggers.length && !episodeTriggers.length) return;

      let isExpanded = false;

      const toggleClick = (elements, condition) => elements.forEach(element => {
        const icon = element.querySelector('i');
        if (icon && condition(icon.textContent)) element.click();
      });

      const toggleElements = () => {
        toggleClick(seasonTriggers, text => isExpanded ? text === 'expand_less' : text === 'expand_more');
        toggleClick(episodeTriggers, () => true);
        isExpanded = !isExpanded;
      };

      const buttonContainer = document.querySelector('.center-align.mtiub') || document.querySelector('tbody');

      if (buttonContainer && !document.getElementById('toggle-button')) {
        const toggleButton = document.createElement('a');
        toggleButton.id = 'toggle-button';
        toggleButton.className = 'btn topsl-btn';
        toggleButton.style.marginLeft = '10px';
        toggleButton.innerHTML = '<i class="material-icons left">unfold_more</i>Toggle';
        toggleButton.addEventListener('click', toggleElements);
        buttonContainer.appendChild(toggleButton);
      }
    };

    const insertCopyIDs = () => {
      const style = document.createElement('style');
      style.textContent = `
        #forum-copy-icon { color: inherit !important; }
        #torrent-id-btn:active { background-color: inherit !important; color: inherit !important; box-shadow: none !important; }
      `;
      document.head.appendChild(style);

      const addCopyButton = (containerSelector, triggerSelector, dataAttr, title, prefix, isButton = false) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const trigger = isButton ? container.querySelector(triggerSelector) : container.querySelector(triggerSelector);
        const id = isButton ? trigger.value : trigger.getAttribute(dataAttr);
        if (!id) return;

        if (isButton) {
          const copyButton = document.createElement('a');
          copyButton.id = 'torrent-id-btn';
          copyButton.className = 'btn waves-effect inline tgaction';
          copyButton.href = '#';
          copyButton.innerHTML = '<i class="material-icons left">content_copy</i> Torrent ID';
          copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(`${prefix}=${id}`)
              .then(() => Utils.showToast(`Copied Torrent ID: ${id}`))
              .catch(() => Utils.showToast('Failed to copy Torrent ID.'));
          });
          const wrapper = document.createElement('div');
          wrapper.classList.add('torrtopbtn-wrapper');
          wrapper.appendChild(copyButton);
          container.appendChild(wrapper);
        } else {
          const copyIcon = document.createElement('i');
          copyIcon.id = 'forum-copy-icon';
          copyIcon.className = trigger.className;
          copyIcon.title = title;
          copyIcon.textContent = 'content_copy';
          copyIcon.addEventListener('click', () => {
            navigator.clipboard.writeText(`${prefix}=${id}`)
              .then(() => Utils.showToast(`Copied Topic ID: ${id}`))
              .catch(() => Utils.showToast('Failed to copy Topic ID.'));
          });
          copyIcon.addEventListener('mousedown', (e) => e.preventDefault());
          container.insertBefore(copyIcon, trigger);
        }
      };

      addCopyButton('#ftta-container', '#ft-follow', 'data-topic-id', 'Copy Topic ID', 'TopicID');
      addCopyButton('.col.s12.m5.l4.center', 'input[name="id"]', 'value', 'Copy Torrent ID', 'TorrentID', true);
    };

    const shoutboxTweaks = () => {
      const limitInputLength = (inputElement, maxLength) => {
        inputElement.addEventListener('input', () => {
          inputElement.value = inputElement.value.slice(0, maxLength);
        });
      }
      const handleActiveFocus = (shoutboxContainer, shoutInput) => {
        const focusInput = () => shoutInput.focus();
        shoutboxContainer.addEventListener('mouseover', () => !window.getSelection().toString() && focusInput());
      }

      const shoutboxContainer = document.querySelector('#shoutbox-container');
      const shoutInput = document.querySelector('#shout_text');
      const MAX_CHAR_LIMIT = 200;
      limitInputLength(shoutInput, MAX_CHAR_LIMIT);
      handleActiveFocus(shoutboxContainer, shoutInput);
    }

    const disableNonFreeleech = () => {
      if (!Utils.isPersonalFreeleech()) {
        const selectors = [
          ['.card-content.torr-card', 'img[alt="Freeleech"]', '#dl-btn'],
          ['tr', 'td.torrent-name img.rel-icon', 'td > a[href*="download.php?id="]'],
          ['.torrents-table tbody tr', 'img[alt="FL"]', 'td a[href*="download.php?id="]'],
          ['tr', 'td.torrent-name img.rel-icon', 'td a[href*="download.php?id="]']
        ];

        selectors.forEach(([itemSelector, iconSelector, buttonSelector]) => {
          document.querySelectorAll(itemSelector).forEach(item => {
            const downloadButton = item.querySelector(buttonSelector), icon = item.querySelector(iconSelector);
            if (downloadButton && !icon && !downloadButton.classList.contains('disabled-freeleech-button')) {
              downloadButton.classList.add('disabled-disableNonFreeleech-button');
              downloadButton.removeAttribute('href');
              downloadButton.style.cssText = 'opacity: 0.5; cursor: not-allowed;';
            }
          });
        });

        if (!document.body.dataset.freeleechListenerAttached) {
          document.body.addEventListener('click', element => {
            const button = element.target.closest('.disabled-disableNonFreeleech-button');
            if (button) { element.preventDefault(); Utils.showToast("Enable Personal Freeleech or Wait for Sitewide Freeleech!"); }
          });
          document.body.dataset.freeleechListenerAttached = "true";
        }
      }
    };

    const customSorting = () => {
      const sortTable = (table, columnIndex, type, descending) => {
        const rows = Array.from(table.querySelector('tbody').querySelectorAll('tr')).filter((row) => !row.classList.contains('mt_more') && !row.querySelector('.mt_more-trigger'));

        rows.sort((a, b) => {
          const aText = a.children[columnIndex].innerText.trim();
          const bText = b.children[columnIndex].innerText.trim();

          let aValue, bValue;
          if (type === 'size') {
            aValue = Utils.convertToGiB(aText);
            bValue = Utils.convertToGiB(bText);
          } else {
            aValue = Utils.extractNumber(aText);
            bValue = Utils.extractNumber(bText);
          }

          return descending ? bValue - aValue : aValue - bValue;
        });

        rows.forEach((row) => table.querySelector('tbody').appendChild(row));
      };

      const expandShowMore = () => {
        const button = document.querySelector('.mt_more-trigger');
        if (button) button.click();
      };

      const updateHeaderIcons = (allHeaders, activeHeader, descending) => {
        allHeaders.forEach((header) => {
          const icon = header.querySelector('.torr-sort-icon i');
          if (icon) icon.innerText = '';
          header.classList.remove('sorted');
        });

        let activeIcon = activeHeader.querySelector('.torr-sort-icon i');
        if (!activeIcon) {
          const span = document.createElement('span');
          span.classList.add('torr-sort-icon');
          span.innerHTML = `<i class="material-icons tiny"></i>`;
          activeHeader.appendChild(span);
          activeIcon = span.querySelector('i');
        }

        activeIcon.innerText = descending ? 'arrow_drop_down' : 'arrow_drop_up';
        activeHeader.classList.add('sorted');
      };

      const table = document.querySelector('table.torrents-table.movie-torrents-table');
      if (!table) return;

      const sortableHeaders = [
        { headerText: 'Size', index: 4, type: 'size' },
        { headerText: 'S', index: 5, type: 'number' },
        { headerText: 'L', index: 6, type: 'number' },
        { headerText: 'C', index: 7, type: 'number' }
      ];

      table.querySelectorAll('thead th').forEach((th) => {
        const header = sortableHeaders.find((h) => h.headerText === th.innerText.trim());
        if (header) {
          th.classList.add('tab-sortable', 'mtt-sort');
          th.setAttribute('data-sort', header.type);

          let clickCount = 0;
          th.addEventListener('click', () => {
            clickCount++;
            const descending = clickCount % 2 === 1;
            expandShowMore();
            sortTable(table, header.index, header.type, descending);
            updateHeaderIcons(table.querySelectorAll('thead th'), th, descending);
          });
        }
      });
    };

    const showSummary = () => {
      const showTradeSummary = () => {
        const createElement = (tag, text, styles) => {
          const element = document.createElement(tag);
          if (text) element.textContent = text;
          if (styles) Object.assign(element.style, styles);
          return element;
        };
        const getRedeemData = (cells, category) => {
          const hours = category === "Freeleech" ? parseInt(cells[3]?.textContent.trim().match(/\d+/)?.[0], 10) || 0 : 0;
          const traffic = category === "Traffic" ? parseFloat((cells[3]?.textContent.trim().match(/([\d\.]+)\s*(TiB|GiB)/) || [])[1]) * (cells[3]?.textContent.includes('TiB') ? 1024 : 1) : 0;
          return category === "Traffic" ? { value: traffic, unit: 'GiB' } : { value: hours, unit: 'hours' };
        };
        const formatRedeemText = data => data.unit === 'traffic' ? Utils.formatTraffic(data.redeem) : (data.redeem + (['hours', 'torrents', 'times'].includes(data.unit) ? ` ${data.unit}` : ''));
        const createRow = (category, data, isTotal = false) => {
          const row = document.createElement('tr');
          const style = isTotal ? { fontWeight: 'bold', backgroundColor: '#27292f' } : {};
          row.innerHTML = `<td style="padding:6px 8px; text-align:left">${category}</td>
                           <td style="padding:6px 8px; text-align:center">${data.count}</td>
                           <td style="padding:6px 8px; text-align:center">${formatRedeemText(data)}</td>
                           <td style="padding:6px 8px; text-align:right">${Utils.formatNumber(data.sum)}</td>`;
          if (isTotal) Object.assign(row.style, style);

          return row;
        };

        const createTable = (categorySums) => {
          let totalPoints = 0;
          const table = createElement('table', null, { className: 'bordered simple-data-table', marginLeft: '20px', marginRight: '20px', width: '80%' });
          table.innerHTML = `<tr style="background-color: #27292f;">
                               <th style="padding:6px 8px; text-align:left">Category</th>
                               <th style="padding:6px 8px; text-align:center;">Count</th>
                               <th style="padding:6px 8px; text-align:center;">Redeem</th>
                               <th style="padding:6px 8px; text-align:right;">Points</th>
                             </tr>`;
          Object.keys(categorySums).forEach(category => {
            const row = createRow(category, categorySums[category]);
            table.appendChild(row);
            totalPoints += categorySums[category].sum;
          });
          table.appendChild(createRow('Total', { sum: totalPoints, count: '', redeem: '', unit: '' }, true));
          return table;
        };

        const rows = document.querySelectorAll('.bordered.simple-data-table tbody tr');
        const categorySums = {
          Traffic: { sum: 0, count: 0, redeem: 0, unit: 'traffic' },
          Freeleech: { sum: 0, count: 0, redeem: 0, unit: 'hours' },
          Featured: { sum: 0, count: 0, redeem: 0, unit: 'torrents' },
          Username: { sum: 0, count: 0, redeem: 0, unit: 'times' },
          Rank: { sum: 0, count: 0, redeem: 0, unit: 'times' }
        };

        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          const category = cells[1]?.textContent.trim() || "Featured";
          const points = parseInt(cells[2]?.textContent.trim().replace(',', ''), 10);
          const redeem = getRedeemData(cells, category);
          if (!isNaN(points)) {
            categorySums[category].sum += points;
            categorySums[category].count++;
            categorySums[category].redeem += redeem.value;
          }
        });

        categorySums.Featured.redeem = categorySums.Featured.count;
        categorySums.Username.redeem = categorySums.Username.count;
        categorySums.Rank.redeem = categorySums.Rank.count;

        const resultTable = createTable(categorySums);
        const tableTitle = createElement('div', 'Summary', { fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginBottom: '5px', marginLeft: '10px' });
        const parentElement = document.querySelector('.content-title');
        parentElement?.parentNode.insertBefore(tableTitle, parentElement.nextSibling);
        parentElement?.parentNode.insertBefore(resultTable, tableTitle.nextSibling);
      };

      const showBreakdownSummary = () => {
        const sizeCategories = [
          { label: "100 MiB ≤ size < 1 GiB", maxRate: 0.4, match: (sizeGiB) => sizeGiB >= 0.09765625 && sizeGiB < 1 },
          { label: "1 GiB ≤ size < 2 GiB",   maxRate: 25,  match: (sizeGiB) => sizeGiB >= 1 && sizeGiB < 2 },
          { label: "2 GiB ≤ size < 5 GiB",   maxRate: 40,  match: (sizeGiB) => sizeGiB >= 2 && sizeGiB < 5 },
          { label: "Above 5 GiB",            maxRate: 50,  match: (sizeGiB) => sizeGiB >= 5 }
        ];

        // Source table must exist with at least one data row; otherwise exit silently.
        const tableBody = document.querySelector('.simple-data-table tbody');
        if (!tableBody) return;
        const rows = tableBody.querySelectorAll('tr:not(:first-child)');
        if (!rows.length) return;

        const stats = {};
        sizeCategories.forEach(cat => {
          stats[cat.label] = { count: 0, maxed: 0, volume: 0, earning: 0, maxRate: cat.maxRate, totalSeedTime: 0 };
        });

        rows.forEach(row => {
          const sizeText     = row.children[1]?.textContent.trim();
          const seedTimeText = row.children[2]?.textContent.trim();
          const bonusText    = row.children[3]?.textContent.trim();

          const sizeGiB       = Number(Utils.convertToGiB(sizeText));
          const bonus         = Number(Utils.extractNumber(bonusText));
          const seedTimeHours = Number(Utils.convertSeedtimeToHours(seedTimeText));

          if (!Number.isFinite(sizeGiB) || !Number.isFinite(bonus) || !Number.isFinite(seedTimeHours)) return;

          const cat = sizeCategories.find(c => c.match(sizeGiB));
          if (!cat) return;

          const s = stats[cat.label];
          s.count += 1;
          s.volume += sizeGiB;
          s.earning += bonus;
          s.totalSeedTime += seedTimeHours;
          if (bonus >= cat.maxRate) s.maxed += 1;
        });

        let total = { count: 0, maxed: 0, volume: 0, earning: 0, potential: 0, totalSeedTime: 0 };

        const formatSize = (v) => {
          if (v <= 0 || !Number.isFinite(v)) return '–';
          return v >= 1024 ? (v / 1024).toFixed(2) + ' TiB'
               : v >= 1    ? v.toFixed(2) + ' GiB'
                           : (v * 1024).toFixed(2) + ' MiB';
        };

        const formatNumber = (val) =>
          Number.isFinite(val) ? val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '–';

        const tbody = Object.entries(stats).map(([label, s]) => {
          const potential  = s.count * s.maxRate;
          const progress   = potential > 0 ? (s.earning / potential * 100) : 0;
          const efficiency = s.volume > 0 ? (s.earning / s.volume) : 0;

          total.count     += s.count;
          total.maxed     += s.maxed;
          total.volume    += s.volume;
          total.earning   += s.earning;
          total.potential += potential;
          total.totalSeedTime += s.totalSeedTime;

          return `
            <tr>
              <td style="padding:6px 8px;">${label}</td>
              <td style="padding:6px 8px; text-align:right;">${s.count}</td>
              <td style="padding:6px 8px; text-align:right;">${s.maxed}</td>
              <td style="padding:6px 8px; text-align:right;">${formatNumber(potential)}</td>
              <td style="padding:6px 8px; text-align:right;">${formatNumber(s.earning)}</td>
              <td style="padding:6px 8px; text-align:right;">${progress.toFixed(2)}%</td>
              <td style="padding:6px 8px; text-align:right;">${formatSize(s.volume)}</td>
              <td style="padding:6px 8px; text-align:right;">${efficiency.toFixed(2)}</td>
            </tr>`;
        }).join('');

        // If no data was aggregated (e.g., all rows filtered), do nothing.
        if (total.count === 0 && total.volume === 0 && total.earning === 0) return;

        const totalProgress   = total.potential > 0 ? (total.earning / total.potential * 100) : 0;
        const totalEfficiency = total.volume > 0 ? (total.earning / total.volume) : 0;

        const totalRow = `
          <tr style="font-weight:bold; background:#27292f;">
            <td style="padding:6px 8px;">Total</td>
            <td style="padding:6px 8px; text-align:right;">${total.count}</td>
            <td style="padding:6px 8px; text-align:right;">${total.maxed}</td>
            <td style="padding:6px 8px; text-align:right;">${formatNumber(total.potential)}</td>
            <td style="padding:6px 8px; text-align:right;">${formatNumber(total.earning)}</td>
            <td style="padding:6px 8px; text-align:right;">${totalProgress.toFixed(2)}%</td>
            <td style="padding:6px 8px; text-align:right;">${formatSize(total.volume)}</td>
            <td style="padding:6px 8px; text-align:right;">${totalEfficiency.toFixed(2)}</td>
          </tr>`;

        const table = document.createElement('table');
        table.style.margin = '20px auto';
        table.style.width = '95%';
        table.style.borderCollapse = 'collapse';
        table.style.borderSpacing = '0';
        table.innerHTML = `
          <thead>
            <tr style="background:#27292f; font-weight:bold;">
              <th style="padding:6px 8px;">Category</th>
              <th style="padding:6px 8px; text-align:right;">Count</th>
              <th style="padding:6px 8px; text-align:right;">Maxed</th>
              <th style="padding:6px 8px; text-align:right;">Potential</th>
              <th style="padding:6px 8px; text-align:right;">Earning</th>
              <th style="padding:6px 8px; text-align:right;">Progress</th>
              <th style="padding:6px 8px; text-align:right;">SeedSize</th>
              <th style="padding:6px 8px; text-align:right;">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            ${tbody}
            ${totalRow}
          </tbody>`;

        // Only insert if target container and "How it Works" box exist.
        const panel = document.querySelector('.card-panel.col.s12.overflow-x');
        const howItWorksBox = panel?.querySelector('a[href*="faq.php"]')?.parentNode;
        if (!panel || !howItWorksBox) return;

        const title = document.createElement('div');
        title.textContent = 'Summary';
        Object.assign(title.style, {
          fontSize: '20px',
          fontWeight: 'bold',
          margin: '10px 0 5px',
          color: '#ccc',
          textAlign: 'left'
        });

        howItWorksBox.parentNode.insertBefore(title, howItWorksBox);
        howItWorksBox.parentNode.insertBefore(table, howItWorksBox);
        howItWorksBox.remove(); // clean only when we actually inserted
      };

      const showSeedingSummary = () => {
        const sizeCategories = [
          { label: "Under 100 MiB", match: (g) => g < 0.09765625 },
          { label: "100 MiB ≤ size < 1 GiB", match: (g) => g >= 0.09765625 && g < 1 },
          { label: "1 GiB ≤ size < 2 GiB", match: (g) => g >= 1 && g < 2 },
          { label: "2 GiB ≤ size < 5 GiB", match: (g) => g >= 2 && g < 5 },
          { label: "Above 5 GiB", match: (g) => g >= 5 }
        ];

        const stats = {};
        sizeCategories.forEach(c => stats[c.label] = { count: 0, size: 0, seedTime: 0, downloaded: 0, uploaded: 0 });

        const allRows = document.querySelectorAll('#seeding + .col.overflow-x tr');
        const rows = Array.from(allRows).filter(row => {
          return (
            row.querySelectorAll('td').length > 0 &&
            !row.style.fontWeight &&
            row !== allRows[allRows.length - 1]
          );
        });

        let total = { count: 0, size: 0, seedTime: 0, downloaded: 0, uploaded: 0 };

        rows.forEach(row => {
          const sizeText = row.querySelector('td div')?.textContent.trim() || '';
          const seedTimeText = row.children[1]?.textContent.trim() || '';
          const downText = row.children[2]?.textContent.trim() || '';
          const upText = row.children[3]?.textContent.trim() || '';
          const gSize = Utils.convertToGiB(sizeText);
          const gDown = Utils.convertToGiB(downText);
          const gUp = Utils.convertToGiB(upText);
          const hoursSeeded = Utils.convertSeedtimeToHours(seedTimeText);

          const cat = sizeCategories.find(c => c.match(gSize));
          if (!cat) return;

          const s = stats[cat.label];
          s.count++;
          s.size += gSize;
          s.seedTime += hoursSeeded;
          s.downloaded += gDown;
          s.uploaded += gUp;

          total.count++;
          total.size += gSize;
          total.seedTime += hoursSeeded;
          total.downloaded += gDown;
          total.uploaded += gUp;
        });

        const formatSize = (v) => {
          if (v <= 0) return '–';
          return v >= 1024 ? (v / 1024).toFixed(2) + ' TiB'
               : v >= 1 ? v.toFixed(2) + ' GiB'
               : (v * 1024).toFixed(2) + ' MiB';
        };

        const formatCompactTime = (hours) => {
          if (hours <= 0) return '–';
          const years = Math.floor(hours / 8760);
          hours %= 8760;
          const months = Math.floor(hours / 720);
          hours %= 720;
          const days = Math.floor(hours / 24);
          hours %= 24;
          const h = Math.floor(hours);
          const m = Math.round((hours - h) * 60);

          const parts = [];
          if (years) parts.push(`${years}y`);
          if (months) parts.push(`${months}mo`);
          if (days) parts.push(`${days}d`);
          if (h) parts.push(`${h}h`);
          if (m && !h) parts.push(`${m}m`);

          return parts.slice(0, 2).join(' ');
        };

        const bodyRows = Object.entries(stats).map(([label, s]) => {
          const ratio = s.downloaded > 0 ? (s.uploaded / s.downloaded).toFixed(2) : '–';
          return `
            <tr>
              <td style="padding:6px 8px;">${label}</td>
              <td style="padding:6px 8px; text-align:right;">${s.count}</td>
              <td style="padding:6px 8px; text-align:right;">${formatSize(s.size)}</td>
              <td style="padding:6px 8px; text-align:right;">${formatCompactTime(s.seedTime)}</td>
              <td style="padding:6px 8px; text-align:right;">${formatSize(s.downloaded)}</td>
              <td style="padding:6px 8px; text-align:right;">${formatSize(s.uploaded)}</td>
              <td style="padding:6px 8px; text-align:right;">${ratio}</td>
            </tr>`;
        }).join('');

        // **Updated total ratio calculation**
        const totalRatio = total.downloaded > 0 ? (total.uploaded / total.downloaded).toFixed(2) : '–';

        const summaryTable = document.createElement('table');
        summaryTable.style.margin = '20px auto';
        summaryTable.style.width = '95%';
        summaryTable.style.borderCollapse = 'collapse';
        summaryTable.style.border = 'none';
        summaryTable.style.borderSpacing = '0';
        summaryTable.innerHTML = `
          <thead>
            <tr style="background:#27292f; color:#ccc; font-weight:bold;">
              <th style="padding:6px 8px; text-align:left; border-bottom:none;">Category</th>
              <th style="padding:6px 8px; text-align:right; border-bottom:none;">Count</th>
              <th style="padding:6px 8px; text-align:right; border-bottom:none;">Size</th>
              <th style="padding:6px 8px; text-align:right; border-bottom:none;">Seedtime</th>
              <th style="padding:6px 8px; text-align:right; border-bottom:none;">Downloaded</th>
              <th style="padding:6px 8px; text-align:right; border-bottom:none;">Uploaded</th>
              <th style="padding:6px 8px; text-align:right; border-bottom:none;">Ratio</th>
            </tr>
          </thead>
          <tbody>
            ${bodyRows}
            <tr style="background:#27292f; color:#ccc; font-weight:bold;">
              <td style="padding:6px 8px;">Total</td>
              <td style="padding:6px 8px; text-align:right;">${total.count}</td>
              <td style="padding:6px 8px; text-align:right;">${formatSize(total.size)}</td>
              <td style="padding:6px 8px; text-align:right;">${formatCompactTime(total.seedTime)}</td>
              <td style="padding:6px 8px; text-align:right;">${formatSize(total.downloaded)}</td>
              <td style="padding:6px 8px; text-align:right;">${formatSize(total.uploaded)}</td>
              <td style="padding:6px 8px; text-align:right;">${totalRatio}</td>
            </tr>
          </tbody>`;

        const panel = document.getElementById('seeding')?.parentNode;
        const searchBox = panel?.querySelector('.mt-10.mb-10');

        if (!searchBox) {
          console.error('Seeding Summary: could not find insertion point');
          return;
        }

        const title = document.createElement('div');
        title.textContent = 'Summary';
        Object.assign(title.style, {
          fontSize: '20px',
          fontWeight: 'bold',
          margin: '10px 0 5px',
          color: '#ccc',
          textAlign: 'left'
        });

        searchBox.parentNode.insertBefore(title, searchBox);
        searchBox.parentNode.insertBefore(summaryTable, searchBox);
      };

      if (Utils.isPage('/seedbonus-history.php')) showTradeSummary();
      if (Utils.isPage('/seedbonus-breakdown.php')) showBreakdownSummary();
      if (Utils.isPage('/activities.php')) showSeedingSummary();
    };

    const makeSeedingTableSortable = () => {
      const table = document.querySelector('.simple-data-table');
      if (!table) return;

      // Helper function to get cell values
      const getCellValue = (tr, idx) => tr.children[idx]?.innerText.trim();

      // Convert Size (in any unit) to bytes for sorting
      const convertSizeToBytes = (text) => {
        if (!text) return 0;
        // Remove commas and split the text into value and unit
        const [value, unit] = text.replace(',', '').split(' ');
        const num = parseFloat(value);
        if (isNaN(num)) return 0;

        // Conversion rates based on units
        const unitToBytes = {
          PiB: 1024 ** 5, // PiB to bytes
          TiB: 1024 ** 4, // TiB to bytes
          GiB: 1024 ** 3, // GiB to bytes
          MiB: 1024 ** 2, // MiB to bytes
          KiB: 1024,      // KiB to bytes
          B: 1            // Byte
        };

        return num * (unitToBytes[unit] || 0); // Default to 0 if unit is not recognized
      };

      // Convert Seedtime (e.g., "7mo 1d") to total hours
      const convertTimeToHours = (text) => {
        if (!text) return 0;

        // Regex to match all possible time formats (y, mo, d, h)
        const regex = /(\d+)(y|mo|d|h)/g;
        let totalHours = 0;
        let match;

        // Match and process each component
        while ((match = regex.exec(text)) !== null) {
          const value = parseInt(match[1], 10);
          const unit = match[2];
          if (unit === 'y') {
            totalHours += value * 8760; // 1 year = 8760 hours
          } else if (unit === 'mo') {
            totalHours += value * 720; // 1 month = 720 hours
          } else if (unit === 'd') {
            totalHours += value * 24; // 1 day = 24 hours
          } else if (unit === 'h') {
            totalHours += value; // 1 hour = 1 hour
          }
        }

        return totalHours;
      };

      // Parse ratio (download/upload) to handle sorting
      const parseRatio = (text) => {
        const num = parseFloat(text.replace(',', ''));
        return isNaN(num) ? 0 : num;
      };

      // Comparison function for sorting
      const comparer = (idx, type, asc) => (a, b) => {
        const v1 = getCellValue(a, idx);
        const v2 = getCellValue(b, idx);

        let comparison = 0;

        if (type === 'size' || type === 'downloaded' || type === 'uploaded') {
          // Compare based on bytes
          comparison = convertSizeToBytes(v1) - convertSizeToBytes(v2);
        } else if (type === 'time') {
          // Compare seed time in hours
          comparison = convertTimeToHours(v1) - convertTimeToHours(v2);
        } else if (type === 'ratio') {
          // Compare ratios
          comparison = parseRatio(v1) - parseRatio(v2);
        } else {
          // Default string comparison
          comparison = v1.localeCompare(v2);
        }

        return asc ? comparison : -comparison;
      };

      const tbody = table.querySelector('tbody');
      const allRows = Array.from(tbody.querySelectorAll('tr'));
      const headerRow = allRows[0];
      const dataRows = allRows.slice(1, allRows.length - 1); // Skip the "Total" row

      if (!headerRow) return;

      // Add event listeners to each column header
      headerRow.querySelectorAll('th').forEach((th, idx) => {
        let type = 'text';
        const header = th.innerText.trim().toLowerCase();

        // Determine the type based on the column header text
        if (header === 'size' || header === 'downloaded' || header === 'uploaded') {
          type = 'size';  // Handle all size-related columns
        } else if (header === 'seedtime') {
          type = 'time';
        } else if (header === 'hourly seedbonus') {
          type = 'ratio';  // Assuming it's for "Hourly Seedbonus" column
        }

        th.style.cursor = 'pointer';
        th.classList.add('tab-sortable');

        // Add sorting functionality to each header
        th.addEventListener('click', function () {
          const ascending = !this.classList.contains('asc');

          // Clear previous sort indicators
          headerRow.querySelectorAll('th.tab-sortable').forEach(t => {
            t.classList.remove('asc', 'desc');
            const oldIcon = t.querySelector('.torr-sort-icon');
            if (oldIcon) oldIcon.remove();
          });

          // Set the new sorting direction (asc or desc)
          this.classList.add(ascending ? 'asc' : 'desc');

          // Add the sort icon
          const iconWrapper = document.createElement('span');
          iconWrapper.className = 'torr-sort-icon';
          const icon = document.createElement('i');
          icon.className = 'material-icons tiny';
          icon.textContent = ascending ? 'arrow_drop_up' : 'arrow_drop_down';
          iconWrapper.appendChild(icon);
          this.appendChild(iconWrapper);

          // Sort the rows based on the selected column and direction
          const sortedRows = [...dataRows].sort(comparer(idx, type, ascending));
          sortedRows.forEach(tr => tbody.insertBefore(tr, allRows[allRows.length - 1]));
        });
      });
    };

    const updateTotalRow = () => {
      // Get the rows in the table, excluding hidden ones
      const rows = document.querySelectorAll('.simple-data-table tbody tr:not([style="display: none;"])');

      // Initialize counters for the totals
      let totalDownloaded = 0;
      let totalUploaded = 0;
      let totalSize = 0;
      let totalSeedtime = 0;
      let rowCount = 0;

      // Loop through the rows to gather data
      rows.forEach(row => {
        const downloadedText = row.cells[2].textContent.trim(); // Downloaded column
        const uploadedText = row.cells[3].textContent.trim(); // Uploaded column
        const seedtimeText = row.cells[1].textContent.trim(); // Seedtime column
        const sizeText = row.querySelector('div') ? row.querySelector('div').textContent.split(':')[1].trim() : '';

        // Function to convert size strings like 'GiB' or 'TiB' to bytes
        const convertToBytes = (str) => {
          if (!str) return 0;
          const value = parseFloat(str);
          if (str.includes('GiB')) {
            return value * 1024 ** 3;
          } else if (str.includes('TiB')) {
            return value * 1024 ** 4;
          } else if (str.includes('MiB')) {
            return value * 1024 ** 2;
          }
          return 0;
        };

        // Convert the downloaded, uploaded, and size values to bytes
        totalDownloaded += convertToBytes(downloadedText);
        totalUploaded += convertToBytes(uploadedText);
        totalSize += convertToBytes(sizeText);

        // Use Utils.convertSeedtimeToHours for seedtime conversion
        const seedtimeHours = Utils.convertSeedtimeToHours(seedtimeText);
        totalSeedtime += seedtimeHours;

        rowCount++; // Increment the row count
      });

      // Function to format bytes into human-readable format
      const formatBytes = (bytes) => {
        if (bytes < 1024) return `${bytes.toFixed(2)} B`;
        const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
      };

      // Function to convert hours to months and days format
      const formatSeedtime = (hours) => {
        if (hours <= 0) return '–';
        const months = Math.floor(hours / (30 * 24)); // 1 month = 720 hours
        hours %= (30 * 24);
        const days = Math.floor(hours / 24); // 1 day = 24 hours
        return `${months}mo ${days}d`;
      };

      // Calculate the average seedtime in months and days
      const avgSeedtime = rowCount > 0 ? totalSeedtime / rowCount : 0;
      const formattedAvgSeedtime = formatSeedtime(avgSeedtime);

      // Update the total row with the calculated totals
      const totalRow = document.querySelector('.simple-data-table tbody tr:last-child');
      if (totalRow) {
        const sizeCell = totalRow.cells[0];
        const downloadedCell = totalRow.cells[2];
        const uploadedCell = totalRow.cells[3];
        const ratioCell = totalRow.cells[4];
        const seedtimeCell = totalRow.cells[1];

        // Setting the total values
        sizeCell.innerHTML = `Size: <br>${formatBytes(totalSize)}`;
        downloadedCell.innerHTML = `Downloaded: <br>${formatBytes(totalDownloaded)}`;
        uploadedCell.innerHTML = `Uploaded: <br>${formatBytes(totalUploaded)}`;

        // Set the average seedtime value in the last row
        seedtimeCell.innerHTML = `Avg: <br>${formattedAvgSeedtime}`;

        // Calculate and set the ratio (uploaded / downloaded)
        const ratio = totalDownloaded !== 0 ? (totalUploaded / totalDownloaded) : 0;
        ratioCell.innerHTML = `Ratio: <br>${ratio.toFixed(2)}`;
      }

      // Ensure the total row is updated when the search input is cleared or changed
      document.querySelector('.occurrence-finder').addEventListener('input', () => {
        updateTotalRow(); // Update total row on any search or clearing action
      });

      // Ensure the total row is updated when the search is cleared
      document.querySelector('.clear-search-button').addEventListener('click', () => {
        const searchField = document.querySelector('.occurrence-finder');
        searchField.value = ''; // Clear the search input
        updateTotalRow(); // Update total row based on the cleared search
      });
    };

    const miscellaneousTweaks = () => {
      const openLinksInCurrentTab = () => {
        const links = document.querySelectorAll('a')
        links.forEach(link => link.removeAttribute('target'))
      }
      openLinksInCurrentTab();
      const fixSeedbonusLogs = () => {
        const createElement = (type, text, style) => {
          const element = document.createElement(type);
          element.textContent = text;
          Object.assign(element.style, style);
          return element;
        };

        const table = document.querySelector('.bordered.simple-data-table');
        const rows = table.querySelectorAll('tbody tr');
        const tableTitle = createElement('div', 'Trading', { fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginTop: '20px' });

        table.parentNode.insertBefore(tableTitle, table);

        rows.forEach(row => {
          let cell1Text = row.cells[1]?.textContent.trim();

          if (cell1Text === 'Username') {
            row.cells[3].textContent = "Changed Username";
          } else if (!cell1Text) {
            row.cells[1].textContent = "Featured";
            row.cells[3].textContent = "Featured Torrent";
          }
        });
      };
      if (Utils.isPage('/seedbonus-history.php')) fixSeedbonusLogs();

      const quickGo = () => {
        // Define the regular expression patterns for different IDs
        const regexTorrentID = /TorrentID=(\d+)/g;
        const regexUserID = /UserID=(\d+)/g;
        const regexTopicID = /TopicID=(\d+)/g;
        const regexRequestID = /RequestID=(\d+)/g;
        const regexPostID = /PostID=(\d+)/g;

        // Get the current domain extension (e.g., torrentbd.net, torrentbd.org, etc.)
        const currentDomain = window.location.hostname;

        // Find all text-containing elements
        const elements = document.body.querySelectorAll('p, span, div, a, li, td, th'); // You can adjust this list to specific tags

        elements.forEach(element => {
          // Check if element contains text
          if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            let textContent = element.textContent;

            // Match all occurrences for TorrentID, UserID, TopicID, RequestID, PostID
            let updatedText = textContent;

            // Replace each match with the appropriate hyperlink
            updatedText = updatedText.replace(regexTorrentID, (match, id) => {
              return `<a href="https://${currentDomain}/torrents-details.php?id=${id}" target="_blank">TorrentID=${id}</a>`;
            });

            updatedText = updatedText.replace(regexUserID, (match, id) => {
              return `<a href="https://${currentDomain}/account-details.php?id=${id}" target="_blank">UserID=${id}</a>`;
            });

            updatedText = updatedText.replace(regexTopicID, (match, id) => {
              return `<a href="https://${currentDomain}/forums.php?action=viewtopic&topicid=${id}" target="_blank">TopicID=${id}</a>`;
            });

            updatedText = updatedText.replace(regexRequestID, (match, id) => {
              return `<a href="https://${currentDomain}/requests.php?module=show&id=${id}" target="_blank">RequestID=${id}</a>`;
            });

            updatedText = updatedText.replace(regexPostID, (match, id) => {
              return `<a href="https://${currentDomain}/forums.php?action=viewpost&postid=${id}" target="_blank">PostID=${id}</a>`;
            });

            // If the text has changed, update the element's HTML with the new content
            if (updatedText !== textContent) {
              element.innerHTML = updatedText;
            }
          }
        });
      };
      quickGo();

      const getStats = () => {
        // Get the container where the stats will be displayed
        const statsContainer = document.querySelector('.movie-title-block');

        if (!statsContainer) {
          console.log('Stats container not found');
          return;
        }

        let seeders = 0;
        let leechers = 0;
        let completions = 0;

        // Use XPath to select the cells for seeders, leechers, and completions
        const seedersCells = document.evaluate('/html/body/main/div/div[2]/div[5]/table/tbody/tr/td[6]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const leechersCells = document.evaluate('/html/body/main/div/div[2]/div[5]/table/tbody/tr/td[7]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const completionsCells = document.evaluate('/html/body/main/div/div[2]/div[5]/table/tbody/tr/td[8]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // Check if the XPath results return any cells
        if (seedersCells.snapshotLength === 0 || leechersCells.snapshotLength === 0 || completionsCells.snapshotLength === 0) {
          console.log('Could not find the necessary cells');
          return;
        }

        // Sum the values from the seeders, leechers, and completions columns
        for (let i = 0; i < seedersCells.snapshotLength; i++) {
          const seedCount = parseInt(seedersCells.snapshotItem(i).textContent.trim(), 10);
          const leecherCount = parseInt(leechersCells.snapshotItem(i).textContent.trim(), 10);
          const completionCount = parseInt(completionsCells.snapshotItem(i).textContent.trim(), 10);

          if (!isNaN(seedCount)) seeders += seedCount;
          if (!isNaN(leecherCount)) leechers += leecherCount;
          if (!isNaN(completionCount)) completions += completionCount;
        }

        // Create a new div to display the stats with the specific icons and tooltips
        const statsText = `
          <div class="col s12 center" style="margin-top:12px; margin-bottom:8px; text-align:left;">
            <div class="inline-item green100 tooltipped mr-20" data-position="bottom" data-delay="20" data-tooltip="Seeders">
              <i class="material-icons left">file_upload</i> ${seeders}
            </div>
            <div class="inline-item red100 tooltipped mr-20" data-position="bottom" data-delay="20" data-tooltip="Leechers">
              <i class="material-icons left">file_download</i> ${leechers}
            </div>
            <div class="inline-item orange100 tooltipped mr-20" data-position="bottom" data-delay="20" data-tooltip="Times Completed">
              <i class="material-icons left">done_all</i> ${completions}
            </div>
          </div>
        `;

        const statsElement = document.createElement('div');
        statsElement.style.marginTop = '10px';
        statsElement.style.fontWeight = 'bold';
        statsElement.innerHTML = statsText;

        // Insert the stats element right below the movie title block, before the genres
        const genreBlock = document.querySelector('.movie-title-block + h6'); // Targeting the genres block
        if (genreBlock) {
          genreBlock.parentNode.insertBefore(statsElement, genreBlock);
        }
      };

      // Run the function after the DOM is fully loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', getStats);
      } else {
        getStats();
      }
    }

    const formatSeedBonus = () => {
      // Select both .crc-wrapper and .table.profile-info-table td:has(a[id="user-sb"])
      const seedBonusElements = document.querySelectorAll('.crc-wrapper[title*="Seedbonus"] .cr-value, .table.profile-info-table td:has(a[id="user-sb"])');

      // Iterate through each element
      seedBonusElements.forEach(element => {
        let seedBonusText = element.textContent.trim();

        // Extract the numeric value from the text
        let seedBonus = parseFloat(seedBonusText.replace(/[^\d.-]/g, ''));

        // Check if seedBonus is in millions and greater than or equal to 10 million
        if (seedBonus >= 1000 && seedBonusText.includes('M')) {
          // If seedBonus >= 1000 million, convert to billion
          const formattedBonus = (seedBonus / 1000).toFixed(2) + ' B';

          // If it's from the .table.profile-info-table (with a hyperlink)
          if (element.closest('td') && element.closest('td').querySelector('a[id="user-sb"]')) {
            // Hyperlink the Seedbonus for table rows
            element.innerHTML = `<a href="seedbonus.php" id="user-sb" data-tippy-content="Use it to redeem Upload credit, Rank upgrade, Username change & more. Click for details." data-tippy-allowhtml="true">${formattedBonus}</a>`;
          } else {
            // For .crc-wrapper elements, just update the value without hyperlink
            element.textContent = formattedBonus;
          }
        }
      });
    };

    const faqClipper = () => {
      const applyStyles = (element, styles) => {
        Object.entries(styles).forEach(([property, value]) => {
          element.style[property] = value;
        });
      };

      const injectFAQClipperStyles = () => {
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        const styleSheet = styleElement.sheet;
        const rules = [
          `.copy-button-icon {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            font-size: 12px;
            color: #B0BEC5;
            vertical-align: middle;
            margin-right: 5px;
          }`,
          `.copy-button-icon:hover {
            color: #78909C;
          }`,
          `.copy-button-icon-right {
            float: right;
            margin-left: auto;
            margin-right: 5px;
          }`
        ];
        rules.forEach(rule => styleSheet.insertRule(rule));
      };

      const copyToClipboard = (text) => navigator.clipboard.writeText(text).catch(() => Utils.showToast('Failed to copy. Please try again.'));

      const handleCopy = async (event, faqTitle, faqLink, isRightAligned) => {
        event.stopPropagation();
        let linkToCopy = faqLink;
        if (isRightAligned) {
          linkToCopy = faqLink.replace(/lang=(en|bn)/, (match, lang) => lang === 'en' ? 'lang=bn' : 'lang=en');
          try {
            const response = await fetch(linkToCopy);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const titleEl = doc.querySelector('#middle-block h4.spidq');
            faqTitle = titleEl ? titleEl.textContent.trim() : faqTitle;
          } catch {
            Utils.showToast('Failed to fetch alternate language');
            return;
          }
        }

        copyToClipboard(`[url=${linkToCopy}]${faqTitle}[/url]`);
        Utils.showToast(`Copied: ${faqTitle}`);
      };

      const createCopyButtons = (faqHeader, faqTitle, link) => {
        const buttons = [
          { isRightAligned: false, label: '' },
          { isRightAligned: true, label: window.location.href.includes('lang=bn') ? 'EN' : 'BN' }
        ];

        buttons.forEach(({ isRightAligned, label }) => {
          const btn = document.createElement('div');
          btn.classList.add('copy-button-icon');
          if (isRightAligned) btn.classList.add('copy-button-icon-right');

          const icon = document.createElement('i');
          icon.classList.add('material-icons');
          icon.textContent = 'content_copy';

          btn.appendChild(icon);
          btn.appendChild(document.createTextNode(` ${label}`));
          btn.addEventListener('click', (e) => handleCopy(e, faqTitle, link, isRightAligned));

          isRightAligned ? faqHeader.appendChild(btn) : faqHeader.prepend(btn);
        });
      };

      const addCopyButtons = (faqHeader) => {
        faqHeader.querySelectorAll('.copy-button-icon').forEach(btn => btn.remove());
        const faqTitle = faqHeader.childNodes[0].textContent.trim().replace(/\s*\(Updated|New\)$/, '').trim();
        const faqLink = faqHeader.parentElement.querySelector('.collapsible-body .right a[href*="faq.php"]');
        if (!faqLink) return;
        createCopyButtons(faqHeader, faqTitle, faqLink.href);
      };

      const observeDynamicContainer = () => {
        const container = document.querySelector('.th-class-container-dyanmic');
        if (!container) return;

        const observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE && node.matches('li')) {
                const faqHeader = node.querySelector('.collapsible-header.faqq');
                if (faqHeader) addCopyButtons(faqHeader);
              }
            });
          });
        });

        observer.observe(container, { childList: true, subtree: true });
      };

      injectFAQClipperStyles();
      document.querySelectorAll('.collapsible-header.faqq').forEach(addCopyButtons);
      observeDynamicContainer();
    };

    const torrentExport = () => {
      const config = {
        allowedPaths: [
          '/',
          'index.php',
          '/account-details.php',
          '/activities.php',
          '/activity.php',
          '/seedbonus-breakdown.php',
          '/download-history.php'
        ],
        tableSelectors: {
          main: ['table.torrents-table', 'table.simple-data-table', 'table.striped.boxed.notif-table'],
          kuddus: ['.kuddus-torrents-table']
        },
        toast: {
          className: 'custom-toast-notification',
          visibleClass: 'visible',
          cancelButtonClass: 'toast-cancel-button',
          messageClass: 'toast-message',
          progressBarClass: 'toast-progress-bar',
          progressInnerClass: 'toast-progress-inner'
        },
        button: {
          className: 'enhanced-button',
          iconClass: 'material-icons',
          spanClass: 'button-text'
        },
        ui: {
          mainClass: 'torrent-links-ui',
          kuddusClass: 'kuddus-torrent-links-ui',
          countCheckboxId: 'countCB',
          countCheckboxClass: 'filled-in',
          kuddusCountCheckboxId: 'kuddus-countCB',
          kuddusCountCheckboxClass: 'filled-in'
        }
      };

      const state = {
        isMainPathAllowed: false,
        abortControllers: [],
        cancelDownload: false,
        downloadedFiles: [],
        errors: [],
        isProcessing: false
      };

      function initialize() {
        state.isMainPathAllowed = config.allowedPaths.some(path => window.location.pathname.includes(path));
        injectStyles();
        ensureMaterialIcons();
        if (state.isMainPathAllowed) {
          createAndInsertUI(false);
        }
        handleKuddusSection();
        observeDOMChanges();
      }

      function injectStyles() {
        const styles = `
          body {
            font-family: 'IBM Plex Sans', Verdana, sans-serif;
            font-size: 14px;
            color: rgba(184, 198, 204, 1);
          }

          .${config.toast.className} {
            font-family: 'IBM Plex Sans', Verdana, sans-serif;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(50, 50, 50, 0.95);
            color: #fff;
            padding: 10px 15px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            font-size: 14px;
            max-width: 400px;
            width: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .${config.toast.className}.${config.toast.visibleClass} {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
          .${config.toast.className} .${config.toast.messageClass} {
            margin-bottom: 5px;
            text-align: center;
            flex: 1;
            word-wrap: break-word;
          }
          .${config.toast.className} .${config.toast.progressBarClass} {
            width: 100%;
            height: 6px;
            background-color: #555;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 5px;
          }
          .${config.toast.className} .${config.toast.progressInnerClass} {
            height: 100%;
            background-color: #4b8b61;
            width: 0%;
            transition: width 0.3s ease;
          }

          .${config.toast.cancelButtonClass} {
            position: absolute;
            top: 5px;
            right: 10px;
            background: transparent;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            transition: color 0.3s ease;
          }
          .${config.toast.cancelButtonClass}:hover {
            color: #ff5252;
          }

          .${config.button.className} {
            display: inline-flex;
            align-items: center;
            color: #B0BEC5;
            text-decoration: none;
            gap: 4px;
            cursor: pointer;
            transition: color 0.3s ease;
          }
          .${config.button.className} .${config.button.iconClass} {
            font-size: 20px;
            color: #B0BEC5;
            transition: color 0.3s ease;
          }
          .${config.button.className} span.${config.button.spanClass} {
            font-size: 14px;
            transition: color 0.3s ease;
          }
          .${config.button.className}:hover .${config.button.iconClass},
          .${config.button.className}:hover span.${config.button.spanClass} {
            color: #4b8b61 !important;
          }

          .${config.button.className}.disabled {
            pointer-events: none;
            opacity: 0.5;
          }

          .${config.ui.mainClass}, .${config.ui.kuddusClass} {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px 0;
            gap: 10px;
            flex-wrap: wrap;
          }
          .${config.ui.mainClass} input[type="checkbox"],
          .${config.ui.kuddusClass} input[type="checkbox"] {
            transform: scale(1.2);
            margin-right: 5px;
          }
        `;
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);
      }

      function ensureMaterialIcons() {
        if (!document.querySelector('link[href*="fonts.googleapis.com/icon"]')) {
          const link = document.createElement('link');
          link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      }

      function toggleButtonsState(disabled) {
        const buttons = document.querySelectorAll(`.${config.button.className}`);
        const checkboxes = document.querySelectorAll(`.${config.ui.mainClass} input[type="checkbox"], .${config.ui.kuddusClass} input[type="checkbox"]`);
        buttons.forEach(button => {
          if (disabled) {
            button.classList.add('disabled');
          } else {
            button.classList.remove('disabled');
          }
        });
        checkboxes.forEach(checkbox => {
          checkbox.disabled = disabled;
        });
      }

      function showToast({ message, showProgress = false, cancelable = false, onCancel = null, autoClose = 3000 }) {
        const existingToast = document.querySelector(`.${config.toast.className}`);
        if (existingToast) {
          existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.classList.add(config.toast.className);

        const messageDiv = document.createElement('div');
        messageDiv.classList.add(config.toast.messageClass);
        messageDiv.textContent = message;
        toast.appendChild(messageDiv);

        if (cancelable) {
          const cancelButton = document.createElement('button');
          cancelButton.classList.add(config.toast.cancelButtonClass);
          cancelButton.innerHTML = '&times;';
          cancelButton.title = 'Cancel';
          toast.appendChild(cancelButton);

          cancelButton.addEventListener('click', () => {
            if (onCancel && typeof onCancel === 'function') {
              onCancel();
            }
            closeToast(toast);
          });
        }

        if (showProgress) {
          const progressBar = document.createElement('div');
          progressBar.classList.add(config.toast.progressBarClass);
          const progressInner = document.createElement('div');
          progressInner.classList.add(config.toast.progressInnerClass);
          progressBar.appendChild(progressInner);
          toast.appendChild(progressBar);
        }

        document.body.appendChild(toast);
        void toast.offsetWidth;

        const highestZIndex = Array.from(document.querySelectorAll('*')).reduce((maxZ, element) => {
          const zIndex = parseInt(window.getComputedStyle(element).zIndex, 10);
          return isNaN(zIndex) ? maxZ : Math.max(maxZ, zIndex);
        }, 0);

        toast.style.zIndex = highestZIndex + 10;

        toast.classList.add(config.toast.visibleClass);

        if (!cancelable && autoClose > 0) {
          setTimeout(() => closeToast(toast), autoClose);
        }

        return {
          updateMessage: (newMessage) => {
            messageDiv.textContent = newMessage;
          },
          updateProgress: (percent) => {
            if (showProgress) {
              toast.querySelector(`.${config.toast.progressInnerClass}`).style.width = `${percent}%`;
            }
          },
          close: () => closeToast(toast),
        };
      }

      function closeToast(toast) {
        toast.classList.remove(config.toast.visibleClass);
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }

      function createStyledButton(iconName, tooltipTitle, onClickHandler) {
        const button = document.createElement('a');
        button.href = '#';
        button.title = tooltipTitle;
        button.classList.add(config.button.className);

        const icon = document.createElement('i');
        icon.classList.add(config.button.iconClass);
        icon.textContent = iconName;
        button.appendChild(icon);

        const span = document.createElement('span');
        span.classList.add(config.button.spanClass);
        span.textContent = tooltipTitle.split(' ')[0];
        button.appendChild(span);

        button.addEventListener('click', (event) => {
          event.preventDefault();
          if (!button.classList.contains('disabled')) {
            onClickHandler();
          }
        });

        return button;
      }

      function createAndInsertUI(isKuddus = false) {
        const uiClass = isKuddus ? config.ui.kuddusClass : config.ui.mainClass;

        if (document.querySelector(`.${uiClass}`)) {
          return;
        }

        const controlDiv = document.createElement('div');
        controlDiv.classList.add(uiClass);

        const countCheckbox = document.createElement('input');
        countCheckbox.type = 'checkbox';
        countCheckbox.id = isKuddus ? config.ui.kuddusCountCheckboxId : config.ui.countCheckboxId;
        countCheckbox.classList = isKuddus ? config.ui.kuddusCountCheckboxClass : config.ui.countCheckboxClass;
        controlDiv.appendChild(countCheckbox);

        const countLabel = document.createElement('label');
        countLabel.htmlFor = isKuddus ? config.ui.kuddusCountCheckboxId : config.ui.countCheckboxId;
        countLabel.textContent = 'Count';
        controlDiv.appendChild(countLabel);

        const copyButton = createStyledButton('content_copy', 'Copy Links', () => handleClipboard('copy', isKuddus));
        const saveButton = createStyledButton('save', 'Save Links', () => handleClipboard('save', isKuddus));
        const downloadButton = createStyledButton('download', 'Download Torrents', () => downloadTorrentsAsZip(isKuddus));

        controlDiv.append(copyButton, saveButton, downloadButton);

        if (isKuddus) {
          const kuddusContainer = document.querySelector('.kuddus-torrents-table');
          if (kuddusContainer) {
            kuddusContainer.parentNode.insertBefore(controlDiv, kuddusContainer);
          }
        } else {
          let container;
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath.includes('account-details.php') || currentPath.includes('index.php')) {
            container = document.querySelector('#torrents-main .torrents-container');
          } else if (currentPath.includes('activities.php') || currentPath.includes('activity.php') || currentPath.includes('seedbonus-breakdown.php')) {
            container = document.querySelector('table.simple-data-table');
          } else if (currentPath.includes('download-history.php')) {
            container = document.querySelector('.pagination');
          }
          if (container) {
            container.parentNode.insertBefore(controlDiv, container);
          }
        }
      }

      function handleKuddusSection() {
        const kuddusContainer = document.querySelector('.kuddus-torrents-table');
        if (kuddusContainer) {
          createAndInsertUI(true);
        }
      }

      function observeDOMChanges() {
        let timeout;
        const observer = new MutationObserver(mutationsList => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            mutationsList.forEach(mutation => {
              if (mutation.type === 'childList') {
                if (state.isMainPathAllowed) {
                  createAndInsertUI(false);
                }
                handleKuddusSection();
              }
            });
          }, 300);
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }

      function handleClipboard(action, isKuddus = false) {
        const output = isKuddus ? getKuddusTorrentLinks() : getMainTorrentLinks();
        if (!output) {
          showToast({ message: 'No links found!', cancelable: false });
          return;
        }

        toggleButtonsState(true);
        state.isProcessing = true;

        if (action === 'copy') {
          navigator.clipboard.writeText(output).then(() => {
            showToast({ message: 'Copied to Clipboard', cancelable: false });
            toggleButtonsState(false);
            state.isProcessing = false;
          }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = output;
            document.body.appendChild(textarea);
            textarea.select();
            try {
              document.execCommand('copy');
              showToast({ message: 'Copied to Clipboard', cancelable: false });
            } catch {
              showToast({ message: 'Failed to Copy!', cancelable: false });
            }
            document.body.removeChild(textarea);
            toggleButtonsState(false);
            state.isProcessing = false;
          });
        } else if (action === 'save') {
          const filename = 'TorrentLinks.txt';
          downloadFile(output, filename);
          showToast({ message: `Saved as ${filename}`, cancelable: false });
          toggleButtonsState(false);
          state.isProcessing = false;
        }
      }

      function downloadFile(data, fileName, mimeType = 'text/plain') {
        const blob = typeof data === 'string' ? new Blob([data], { type: mimeType }) : data;
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
      }

      async function downloadTorrentsAsZip(isKuddus = false) {
        const output = isKuddus ? getKuddusTorrentLinks() : getMainTorrentLinks();
        if (!output) {
          showToast({ message: 'No links found!', cancelable: false });
          return;
        }
        const links = output.split('\n').filter(link => link.trim() !== '');
        state.downloadedFiles = [];
        state.errors = [];
        state.abortControllers = [];
        state.cancelDownload = false;

        toggleButtonsState(true);

        const toast = showToast({
          message: `Starting download of ${links.length} torrent(s)...`,
          showProgress: true,
          cancelable: true,
          onCancel: () => {
            state.cancelDownload = true;
            state.abortControllers.forEach(controller => controller.abort());
            toast.updateMessage('Download Cancelled');
            setTimeout(() => toast.close(), 3000);
            toggleButtonsState(false);
            state.isProcessing = false;
          }
        });

        for (let i = 0; i < links.length; i++) {
          if (state.cancelDownload) break;
          const link = links[i];
          const torrentID = extractTorrentID(link);
          if (torrentID) {
            const downloadURL = `${window.location.origin}/download.php?id=${torrentID}`;
            await downloadTorrent(downloadURL, state.downloadedFiles, document.getElementById(isKuddus ? config.ui.kuddusCountCheckboxId : config.ui.countCheckboxId)?.checked ? i + 1 : null, state.abortControllers, state.errors);
            if (state.cancelDownload) break;
            const progressPercent = Math.round(((i + 1) / links.length) * 100);
            toast.updateProgress(progressPercent);
            toast.updateMessage(`Downloading... (${progressPercent}%)`);
            await new Promise(resolve => setTimeout(resolve, 100));
          } else {
            state.errors.push(`Invalid torrent link: ${link}`);
          }
        }

        if (state.downloadedFiles.length > 0 && !state.cancelDownload) {
          createZip(state.downloadedFiles);
          showToast({ message: `Downloaded ${state.downloadedFiles.length} torrent(s)`, cancelable: false });
        } else if (!state.cancelDownload) {
          toast.updateMessage('No torrents Downloaded!');
        }

        if (state.errors.length > 0) {
          const errorMessage = state.errors.length === 1
            ? state.errors[0]
            : `${state.errors.length} errors occurred:\n` + state.errors.join('\n');
          showToast({ message: errorMessage, cancelable: false });
        }

        toggleButtonsState(false);
        state.isProcessing = false;
      }

      async function downloadTorrent(downloadURL, downloadedFiles, count = null, abortControllers, errors) {
        const controller = new AbortController();
        abortControllers.push(controller);

        try {
          const response = await fetch(downloadURL, { credentials: 'include', signal: controller.signal });
          if (!response.ok) throw new Error(`Failed to Download: ${response.statusText}`);

          const blob = await response.blob();
          const torrentID = extractTorrentID(downloadURL);
          let filename = `[TorrentBD]${torrentID}.torrent`;
          const disposition = response.headers.get('Content-Disposition');
          const matches = disposition?.match(/filename[^;=\n]*=([^;\n]*)/);
          if (matches?.[1]) filename = matches[1].trim().replace(/['"]/g, '');

          if (count !== null) {
            filename = `${count}. ${filename}`;
          }

          downloadedFiles.push({ blob, filename });
        } catch (error) {
          if (error.name === 'AbortError') {
            const message = state.cancelDownload ? 'Download Canceled' : 'Download Aborted';
            showToast({ message, cancelable: false });
          } else {
            errors.push(`Error downloading ${downloadURL}: ${error.message}`);
          }
        }
      }

      function createZip(files) {
        if (typeof JSZip === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js';
          script.onload = proceedWithZip;
          document.head.appendChild(script);
        } else {
          proceedWithZip();
        }

        function proceedWithZip() {
          const zip = new JSZip();
          files.forEach(file => zip.file(file.filename, file.blob));

          zip.generateAsync({ type: 'blob' }).then(content => {
            const anchor = document.createElement('a');
            anchor.href = window.URL.createObjectURL(content);
            anchor.download = 'TorrentMetaFiles.zip';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(anchor.href);
            showToast({ message: `Downloaded ${files.length} torrent(s)`, cancelable: false });
          }).catch(() => {
            showToast({ message: `Error Creating Zip!`, cancelable: false });
          });
        }
      }

      function getMainTorrentLinks() {
        const isCountEnabled = document.getElementById(config.ui.countCheckboxId)?.checked || false;
        return extractTorrentLinks(config.tableSelectors.main, isCountEnabled);
      }

      function getKuddusTorrentLinks() {
        const isCountEnabled = document.querySelector(`.${config.ui.kuddusClass} #${config.ui.kuddusCountCheckboxId}`)?.checked || false;
        return extractTorrentLinks(config.tableSelectors.kuddus, isCountEnabled);
      }

      function extractTorrentLinks(selectors, isCountEnabled) {
        const links = [];
        const baseUrl = window.location.origin;
        let count = isCountEnabled ? 1 : 0;

        selectors.forEach(selector => {
          const tables = document.querySelectorAll(selector);
          tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
              const linkElement = row.querySelector('a[href*="torrents-details.php?id="]');
              if (linkElement) {
                const href = linkElement.getAttribute('href');
                const torrentID = extractTorrentID(href);
                if (torrentID) {
                  const fullLink = `${baseUrl}/torrents-details.php?id=${torrentID}`;
                  const linkWithCount = isCountEnabled ? `${count}. ${fullLink}` : fullLink;
                  if (isCountEnabled) count += 1;
                  links.push(linkWithCount);
                }
              }
            });
          });
        });

        return links.join('\n');
      }

      function extractTorrentID(link) {
        try {
          const url = new URL(link, window.location.origin);
          return parseInt(url.searchParams.get('id'), 10) || null;
        } catch (e) {
          return null;
        }
      }

      initialize();
    };

    const initializeTweaks = () => {
      if (config.profileDetailsTweaksEnabled && Utils.isPage('/account-details.php')) profileDetailsTweaks();
      if (config.seedbonusPageTweaksEnabled && Utils.isPage('/seedbonus.php')) seedbonusPageTweaks();
      if (config.autoExpandSeasonsEnabled && (Utils.isPage('/movies.php') || Utils.isPage('/tv.php'))) insertToggleButton();
      if (config.insertCopyIDsEnabled && (Utils.isPage('/forums.php') || Utils.isPage('/torrents-details.php'))) insertCopyIDs();
      if (config.shoutboxTweaksEnabled && (Utils.isPage('/') || Utils.isPage('/index.php'))) shoutboxTweaks();
      if (config.customMovieSortingEnabled && Utils.isPage('/movies.php')) customSorting();
      if (config.showTradeSummaryEnabled) showSummary();
      if (config.makeSortableEnabled && (Utils.isPage('/activities.php') || Utils.isPage('/seedbonus-breakdown.php'))) makeSeedingTableSortable();
      if (config.fixTotalRowEnabled && Utils.isPage('/activities.php')) document.querySelector('.occurrence-finder').addEventListener('input', updateTotalRow);
      if (config.miscellaneousTweaksEnabled) miscellaneousTweaks();
      if (config.faqClipperEnabled && Utils.isPage('/faq.php')) faqClipper();
      if (config.torrentExportEnabled) torrentExport();

      const observer = new MutationObserver(() => {
        formatSeedBonus();
        changeLabels();
        if (config.disableNonFreeleechEnabled && (Utils.isPage('/') || Utils.isPage('/index.php') || Utils.isPage('/torrents-details.php') || Utils.isPage('/movies.php') || Utils.isPage('/tv.php'))) {
          disableNonFreeleech();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    initializeTweaks();

  };
  TweaxBD();
})();