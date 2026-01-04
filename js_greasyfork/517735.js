// ==UserScript==
// @name          TorrentBD: uxEnhancer - Improves Browsing Experience
// @namespace     eLibrarian-userscripts
// @description   Improves user experience on TorrentBD by implementing various tweaks and hidden surprises!
// @version       0.1.7.5
// @author        eLib
// @license       GPL-3.0-or-later
// @match         https://*.torrentbd.net/*
// @match         https://*.torrentbd.com/*
// @match         https://*.torrentbd.org/*
// @match         https://*.torrentbd.me/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/517735/TorrentBD%3A%20uxEnhancer%20-%20Improves%20Browsing%20Experience.user.js
// @updateURL https://update.greasyfork.org/scripts/517735/TorrentBD%3A%20uxEnhancer%20-%20Improves%20Browsing%20Experience.meta.js
// ==/UserScript==

(function () {
  'use strict';

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
    formatNumber: (number) => {
      if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
      if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
      if (number >= 1e3) return (number / 1e3).toFixed(2) + 'K';
      return number.toFixed(2);
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

    updateLabels('.cr-wrapper .cr-label', Utils.labelMappings['.cr-wrapper .cr-label']);  //: account-details page's seed info labels
    updateLabels('td.center-align', Utils.labelMappings['td.center-align']);              //: activities page's table labels
    updateLabels('.short-links', Utils.labelMappings['.short-links']);                    //: profile card labels
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
      const textContent = seedBonusElement.textContent.trim().replace(/,/g, '');
      const match = textContent.match(/(\d+(\.\d+)?)\s*x\s*(\d+)\s*=\s*(\d+(\.\d+)?)/i);
      const hourlyPoints = match ? parseFloat(match[4]) : Utils.extractNumber(textContent);
      const displayPoints = match
        ? `${parseFloat(match[1]).toFixed(2)} <span style="color: #ff0000;" onmouseover="this.style.color='#d00';" onmouseout="this.style.color='#ff0000';">x${parseInt(match[3], 10)} = ${parseFloat(match[4]).toFixed(2)}</span>`
        : `${Utils.extractNumber(textContent).toFixed(2)}`;
      const seedPoints = Object.fromEntries(
        Object.entries(Utils.timeMultipliers).map(([period, multiplier]) => [period, hourlyPoints * multiplier])
      );

      const linkConfigs = {
        hour: { text: displayPoints, title: 'Click to see details seedbonus breakdown', color: '#66ff66', hoverColor: '#5fe3b7', fontSize: '1.5em' },
        day: { text: `${Utils.formatNumber(seedPoints.day)}/day`, title: `${seedPoints.day.toFixed(2)} per day`, color: '#4caf50', hoverColor: '#a6f5a6' },
        week: { text: `${Utils.formatNumber(seedPoints.week)}/week`, title: `${seedPoints.week.toFixed(2)} per week`, color: '#2196f3', hoverColor: '#90d8ff' },
        month: { text: `${Utils.formatNumber(seedPoints.month)}/month`, title: `${seedPoints.month.toFixed(2)} per month`, color: '#ffab40', hoverColor: '#ffe680' },
        year: { text: `${Utils.formatNumber(seedPoints.year)}/year`, title: `${seedPoints.year.toFixed(2)} per year`, color: '#ff7043', hoverColor: '#ffa480' }
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

        if (currentSeedBonus >= billionairePoints) message = `Congratulations, you're already a <span class="tbdrank star-uploader">billionaire</span>! 🎉`;
        else if (currentSeedBonus >= millionairePoints) message = `You're already a <span class="tbdrank wizard">millionaire</span>! 🎉 Keep it up! You are approximately <span class="tbdrank mvp">${Utils.timeMessage(hoursToBillionaire)}</span> away from becoming a <span class="tbdrank star-uploader">billionaire</span>.`;
        else message = `You're on your way to becoming a <span class="tbdrank wizard">millionaire</span>! It will take you approximately <span class="tbdrank mvp">${Utils.timeMessage(hoursToMillionaire)}</span> to get there.`;

        const span = document.createElement('span');
        span.innerHTML = message;
        fragment.appendChild(span);
      };
      const currentSeedBonus = parseFloat(document.querySelector('h5.intro-h.center-align span').textContent);
      const millionairePoints = 1000000;
      const billionairePoints = 1000000000;
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
      const focusInput = (element) => shoutInput.focus();
      ['mouseover'].forEach(event =>
        shoutboxContainer.addEventListener(event, (element) => !window.getSelection().toString() && focusInput(element))
      );
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
      let totalPoints = 0, totalTraffic = 0;
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
        if (category === 'Traffic') totalTraffic += categorySums[category].redeem;
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

  const miscellaneousTweaks = () => {
    const openLinksInCurrentTab = () => {
      const links = document.querySelectorAll('a')
      links.forEach(link => link.removeAttribute('target'))
    }
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
    openLinksInCurrentTab();
    if (Utils.isPage('/seedbonus-history.php')) fixSeedbonusLogs();
  }

  const initializeTweaks = () => {
    if (Utils.isPage('/account-details.php')) profileDetailsTweaks();
    if (Utils.isPage('/seedbonus.php')) seedbonusPageTweaks();
    if (Utils.isPage('/movies.php') || Utils.isPage('/tv.php')) insertToggleButton();
    if (Utils.isPage('/forums.php') || Utils.isPage('/torrents-details.php')) insertCopyIDs();
    if (Utils.isPage('/') || Utils.isPage('/index.php')) shoutboxTweaks();
    if (Utils.isPage('/movies.php')) customSorting();
    if (Utils.isPage('/seedbonus-history.php')) showTradeSummary();
    miscellaneousTweaks();
  };
  initializeTweaks();

  const observer = new MutationObserver(() => {
    changeLabels();
    //if (Utils.isPage('/') || Utils.isPage('/index.php') || Utils.isPage('/torrents-details.php') || Utils.isPage('/movies.php') || Utils.isPage('/tv.php')) disableNonFreeleech();
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();