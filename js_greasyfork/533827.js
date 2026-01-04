// ==UserScript==
// @name         Asimov's Lens
// @namespace    http://tampermonkey.net/
// @version      0.9.4
// @description  Floating debug panel for Monetate ATP experiments with Adidas styling and accurate grouping. Unlisted (not public, only accessible via link). 
// @include      *://*.adidas.*/*
// @grant        none
// @run-at       document-start
// @license      CC BY-NC 4.0
// @author       David Swinstead
// @downloadURL https://update.greasyfork.org/scripts/533827/Asimov%27s%20Lens.user.js
// @updateURL https://update.greasyfork.org/scripts/533827/Asimov%27s%20Lens.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const allExperiments = [];

  function extractMonetateExperiments(payload) {
    const actions = payload?.data?.responses?.[0]?.actions || [];
    return actions.map((action) => {
      const ir = action.impressionReporting?.[0] || {};
      return {
        testName: action.json?.test_name || "Unknown",
        variant: action.json?.test_variant || "Unknown",
        variant_label: ir.variant_label || "",
        component: action.json?.test_component || "Unknown",
        experienceLabel: ir.experience_label || "Unknown",
        experienceName: ir.experience_name || "Unknown",
        experienceId: ir.experience_id || "Unknown",
        experienceType: ir.experience_type || "Unknown",
        isControl: ir.is_control || false,
      };
    });
  }

  function removeDuplicateExperiments(newExperiments) {
    // Create a map to track unique experiments by their key identifiers
    const uniqueMap = new Map();

    // First, add existing experiments to the map
    allExperiments.forEach(exp => {
      const key = `${exp.experienceId}-${exp.experienceName}-${exp.variant_label}-${exp.isControl}`;
      uniqueMap.set(key, exp);
    });

    // Then add new experiments, overwriting any duplicates
    newExperiments.forEach(exp => {
      const key = `${exp.experienceId}-${exp.experienceName}-${exp.variant_label}-${exp.isControl}`;
      uniqueMap.set(key, exp);
    });

    // Convert map values back to array
    return Array.from(uniqueMap.values());
  }

  function addExperiments(newExperiments) {
    if (newExperiments.length === 0) return;

    // Remove duplicates and update the array
    const deduplicatedExperiments = removeDuplicateExperiments(newExperiments);

    // Clear and repopulate the array
    allExperiments.length = 0;
    allExperiments.push(...deduplicatedExperiments);

    // Update the global reference
    window.debugMonetateExperiments = allExperiments;

    console.log(`🔍 [Monetate Debug] Added ${newExperiments.length} experiments, total unique: ${allExperiments.length}`);
  }

  function createDebugPanel(experiments) {
    if (document.getElementById('monetate-debug-panel')) return;

    // Check if component is sleeping
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const sleepUntil = getCookie('monetateDebugSleepUntil');
    if (sleepUntil) {
      const sleepTime = parseInt(sleepUntil);
      if (Date.now() < sleepTime) {
        return; // Component is sleeping
      } else {
        // Sleep period is over, clear it
        document.cookie = 'monetateDebugSleepUntil=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }

    const container = document.createElement('div');
    container.id = 'monetate-debug-panel';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 99999;
      background: #fff;
      border: 2px solid #000;
      border-radius: 6px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      font-size: 14px;
      color: #000;
      min-width: 425px;
      cursor: default;
    `;

    // Load saved position
    const savedPosition = localStorage.getItem('monetateDebugPosition');
    if (savedPosition) {
      try {
        const { top, left } = JSON.parse(savedPosition);

        // Check if position is within viewport bounds
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const panelWidth = 300; // min-width from CSS
        const panelHeight = 200; // estimated height

        let newTop = top;
        let newLeft = left;
        let needsReset = false;

        // Check if panel would be outside viewport
        if (parseInt(left) < 0 || parseInt(left) + panelWidth > viewportWidth) {
          newLeft = '20px';
          needsReset = true;
        }

        if (parseInt(top) < 0 || parseInt(top) + panelHeight > viewportHeight) {
          newTop = '20px';
          needsReset = true;
        }

        container.style.top = newTop;
        container.style.left = newLeft;

        // If we had to reset, update the saved position
        if (needsReset) {
          const position = { top: newTop, left: newLeft };
          localStorage.setItem('monetateDebugPosition', JSON.stringify(position));
        }
      } catch (e) {
        console.warn('Failed to load saved position:', e);
      }
    }

    const header = document.createElement('div');
    header.style.cssText = `
      background: #000;
      color: #fff;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      font-weight: bold;
      font-size: 13px;
      text-transform: uppercase;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      cursor: move;
    `;

    const title = document.createElement('div');
    title.innerText = 'Asimov\'s Lens 🔍 | Monetate Experiment Tracker';

    const controls = document.createElement('div');

    const minimizeBtn = document.createElement('button');
    minimizeBtn.innerText = '–';
    minimizeBtn.style.cssText = `
      margin-right: 8px;
      font-weight: bold;
      font-size: 16px;
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
    `;

    const sleepBtn = document.createElement('button');
    sleepBtn.innerText = '💤';
    sleepBtn.title = 'Sleep for a week';
    sleepBtn.style.cssText = `
      margin-right: 8px;
      font-size: 14px;
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerText = '×';
    closeBtn.style.cssText = `
      font-size: 18px;
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 12px 14px;
      max-height: calc(80vh - 60px);
      overflow-y: auto;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    `;
      if (localStorage.getItem('monetateDebugMinimized') === 'true') {
          content.style.display = 'none';
          minimizeBtn.innerText = '+';
      }


      minimizeBtn.onclick = () => {
          const isNowHidden = content.style.display === 'none';
          content.style.display = isNowHidden ? 'block' : 'none';
          minimizeBtn.innerText = isNowHidden ? '–' : '+';
          localStorage.setItem('monetateDebugMinimized', isNowHidden ? 'false' : 'true');
      };

    sleepBtn.onclick = () => {
        const sleepUntil = Date.now() + (7 * 24 * 60 * 60 * 1000); // 1 week from now
        const expires = new Date(sleepUntil).toUTCString();
        document.cookie = `monetateDebugSleepUntil=${sleepUntil}; expires=${expires}; path=/`;
        alert('Component will sleep for a week, or until you clear your browser cookies');
        container.remove();
    };

    closeBtn.onclick = () => container.remove();

    controls.appendChild(minimizeBtn);
    controls.appendChild(sleepBtn);
    controls.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(controls);
    container.appendChild(header);

    function makeGroup(titleText, items, collapsed = false) {
      const section = document.createElement('div');
      const heading = document.createElement('div');
      heading.style.marginTop = '10px';
      heading.style.fontWeight = 'bold';
      heading.style.color = '#116688';
      heading.style.cursor = 'pointer';
      heading.innerText = titleText;
      section.appendChild(heading);

      const list = document.createElement('ul');
      list.style.margin = '6px 0 12px 14px';
      list.style.padding = '0';
      list.style.listStyle = 'none';
      list.style.display = collapsed ? 'none' : 'block';

      items.forEach((exp, index) => {
        const li = document.createElement('li');
        li.style.padding = '3px';
        li.style.fontWeight = 'normal';
        li.style.fontFamily = 'system-ui, sans-serif';
        if (items.length > 1 && index % 2 === 1) {
          li.style.background = '#f0f0f0';
        }

        // Create the text content with potential links
        const experienceName = exp.experienceName || '';
        const experienceId = exp.experienceId || '';

        // Check for ATP-XXX JIRA ticket numbers in the experience name
        const jiraRegex = /ATP-\d+/gi;
        const jiraMatches = experienceName.match(jiraRegex);

        // Create domain mapping for Monetate account links
        const domainToMonetateMap = {
          // Verified domains
          'adidas.com': 'adidas.us',
          'adidas.co.uk': 'adidas.uk',
          'adidas.de': 'adidas.de',
          'adidas.fr': 'adidas.fr',
          'adidas.es': 'adidas.es',
          'adidas.it': 'adidas.it',
          'adidas.nl': 'adidas.nl',
          'adidas.be': 'adidas.be',
          'adidas.at': 'adidas.at',
          'adidas.ch': 'adidas.ch',
          'adidas.pl': 'adidas.pl',
          'adidas.cz': 'adidas.cz',
          'adidas.sk': 'adidas.sk',
          'adidas.dk': 'adidas.dk',
          'adidas.no': 'adidas.no',
          'adidas.se': 'adidas.se',
          'adidas.fi': 'adidas.fi',
          'adidas.ie': 'adidas.ie',
          'adidas.gr': 'adidas.gr',
          'adidas.pt': 'adidas.pt',
          'adidas.ru': 'adidas.ru',
          'adidas.tr': 'adidas.tr',
          'adidas.ca': 'adidas.ca',
          'adidas.mx': 'adidas.mx',
          'adidas.com.br': 'adidas.br',
          'adidas.com.ar': 'adidas.ar',
          'adidas.cl': 'adidas.cl',
          'adidas.co': 'adidas.co',
          'adidas.pe': 'adidas.pe',
          'adidas.com.au': 'adidas.au',
          'adidas.co.nz': 'adidas.nz',
          'adidas.jp': 'adidas.jp',
          'adidas.co.kr': 'adidas.kr',
          'adidas.co.in': 'adidas.in',
          'adidas.com.sg': 'adidas.sg',
          'adidas.my': 'adidas.my',
          'adidas.co.th': 'adidas.th',
          'adidas.com.ph': 'adidas.ph',
          'adidas.com.vn': 'adidas.vn',
          'adidas.co.id': 'adidas.id'
        };

        // Get current hostname and find matching Monetate domain
        const currentHostname = window.location.hostname.replace(/^www\./, '');
        const monetateDomain = domainToMonetateMap[currentHostname];

        let processedName = experienceName;

        // Replace JIRA ticket numbers with links
        if (jiraMatches) {
          jiraMatches.forEach(jiraTicket => {
            const jiraLink = `<a href="https://jira.tools.3stripes.net/browse/${jiraTicket}" target="_blank" style="color: #000; font-weight: bold; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${jiraTicket}</a>`;
            processedName = processedName.replace(new RegExp(jiraTicket, 'gi'), jiraLink);
          });
        }

        // Build the final content with experience ID handling
        if (experienceId) {
          if (monetateDomain) {
            // Create Monetate experience link for supported sites
            const monetateLink = `<a href="https://marketer.monetate.net/control/a-24f48522/p/${monetateDomain}/experience/${experienceId}" target="_blank" style="color: #000; font-weight: bold; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">(${experienceId})</a>`;
            li.innerHTML = `${processedName} ${monetateLink}`;
          } else {
            // Regular text for experience ID if domain not mapped
            li.innerHTML = `${processedName} (${experienceId})`;
          }
        } else {
          li.innerHTML = processedName;
        }

        list.appendChild(li);
      });

      heading.addEventListener('click', () => {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
      });

      section.appendChild(list);
      content.appendChild(section);
    }

    const controlGroup = [], variantGroup = [], otherTrackedGroup = [], allTheRestGroup = [];

    experiments.forEach(exp => {
      const type = (exp.experienceType || '').toLowerCase();
      const experienceName = (exp.experienceName || '').toLowerCase();

      // No more 100% filtering - show all experiments
      // const nameMatch = (exp.experienceLabel + exp.experienceName).toUpperCase().includes("ATP");
      const nameMatch = (exp.experienceLabel + exp.experienceName).toUpperCase().includes("ATP");
      const variantLabel = (exp.variant_label || '').toLowerCase();

      const isVariant = variantLabel === 'b' || variantLabel.includes('variant') || variantLabel.includes('variation') || experienceName.includes('variant');
      const isControl = variantLabel === 'a' || variantLabel.includes('control') || variantLabel.includes('base') || experienceName.includes('control');

      if (nameMatch) {
        if (isVariant) variantGroup.push(exp);
        else if (isControl) controlGroup.push(exp);
        else if (exp.isControl) controlGroup.push(exp);
        else otherTrackedGroup.push(exp); // ATP experiments that don't fit control/variant
      } else {
        console.log("🔍 [Monetate Debug] Non-ATP experience going to All The Rest:", exp.experienceName);
        allTheRestGroup.push(exp);
      }
    });

    // Debug summary
    console.log("🔍 [Monetate Debug] Experiment breakdown:", {
      total: experiments.length,
      control: controlGroup.length,
      variant: variantGroup.length,
      otherTracked: otherTrackedGroup.length,
      allTheRest: allTheRestGroup.length,
      filtered: experiments.length - controlGroup.length - variantGroup.length - otherTrackedGroup.length - allTheRestGroup.length
    });

    // Check if we have any experiments to show
    if (controlGroup.length === 0 && variantGroup.length === 0 && otherTrackedGroup.length === 0 && allTheRestGroup.length === 0) {
      const noTestsMessage = document.createElement('div');
      noTestsMessage.style.cssText = `
        padding: 20px;
        text-align: center;
        color: #666;
        font-style: italic;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      `;
      noTestsMessage.innerText = 'No running tests detected in this pageload';
      content.appendChild(noTestsMessage);
    } else {
      if (controlGroup.length) makeGroup("🟦 In Control Group", controlGroup);
      if (variantGroup.length) makeGroup("🟥 In Variant Group", variantGroup);
      if (otherTrackedGroup.length) makeGroup("📊 Other Experiences Tracked (with an ATP)", otherTrackedGroup, true);
      if (allTheRestGroup.length) makeGroup("📂 All The Rest", allTheRestGroup, true);
    }

    container.appendChild(content);
    document.body.appendChild(container);

    let isDragging = false, offsetX, offsetY;
    header.addEventListener('mousedown', function (e) {
      isDragging = true;
      offsetX = e.clientX - container.offsetLeft;
      offsetY = e.clientY - container.offsetTop;
      header.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', function (e) {
      if (isDragging) {
        container.style.left = `${e.clientX - offsetX}px`;
        container.style.top = `${e.clientY - offsetY}px`;
      }
    });
    document.addEventListener('mouseup', function () {
      isDragging = false;
      header.style.cursor = 'move';

      // Save position
      const position = {
        top: container.style.top,
        left: container.style.left
      };
      localStorage.setItem('monetateDebugPosition', JSON.stringify(position));
    });
  }

  const originalXhrOpen = XMLHttpRequest.prototype.open;
  const originalXhrSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url;
    return originalXhrOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    const url = this._url || '';
    if (url.includes("personalizationengine")) {
      this.addEventListener("load", function () {
        const handleJSON = (json) => {
          const newExperiments = extractMonetateExperiments(json);
          addExperiments(newExperiments);
          if (document.readyState === "complete") {
            createDebugPanel(allExperiments);
          } else {
            window.addEventListener("load", () => createDebugPanel(allExperiments));
          }
        };
        if (this.responseType === "" || this.responseType === "text") {
          try {
            const json = JSON.parse(this.responseText);
            handleJSON(json);
          } catch (err) {
            console.warn("❌ [Monetate Debug] JSON parse error (text):", err);
          }
        } else if (this.responseType === "blob") {
          const reader = new FileReader();
          reader.onload = function () {
            try {
              const json = JSON.parse(reader.result);
              handleJSON(json);
            } catch (err) {
              console.warn("❌ [Monetate Debug] JSON parse error (blob):", err);
            }
          };
          reader.readAsText(this.response);
        }
      });
    }
    return originalXhrSend.call(this, body);
  };

  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const [resource] = args;
    const url = typeof resource === 'string' ? resource : resource.url;

    if (url.includes("personalizationengine")) {
      console.log("📡 [Monetate Debug] fetch() matched:", url);
      try {
        const response = await originalFetch(...args);
        const clone = response.clone();
        const text = await clone.text();
        const json = JSON.parse(text);
        const newExperiments = extractMonetateExperiments(json);
        addExperiments(newExperiments);

        if (document.readyState === "complete") {
          createDebugPanel(allExperiments);
        } else {
          window.addEventListener("load", () => createDebugPanel(allExperiments));
        }

        return response;
      } catch (err) {
        console.warn("❌ [Monetate Debug] fetch() parse error:", err);
        return originalFetch(...args);
      }
    }

    return originalFetch(...args);
  };
})();