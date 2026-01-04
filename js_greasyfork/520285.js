// ==UserScript==
// @name         GitHub Code Language Icons
// @description  Replaces GitHub's boring round code language icons with Material Design Icons.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      2.0
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/520285/GitHub%20Code%20Language%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/520285/GitHub%20Code%20Language%20Icons.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const CONFIG = {
    case_01: true, // The average of all icons
    case_02: true, // Organization's Repositories (https://github.com/orgs/yt-dlp/repositories)
    case_03: true, // Languages
    case_04: true, // Other Languages
    case_05: true, // Filter by (https://github.com/search?q=spotify&type=code)
    case_06: true, // More languages... (https://github.com/search?q=spotify&type=repositories)
    case_07: true  // Search's Languages (https://github.com/search?q=spotify&type=repositories)
  };

  const BASE_URL = 'https://raw.githubusercontent.com/afkarxyz/userscripts/refs/heads/main/assets/material/';
  const ICON_BASE_URL = `${BASE_URL}icons/`;

  let languageMappings = {};

  async function fetchLanguageMappings() {
    const cacheKey = 'githubLanguageRemapCache';
    const currentTime = Date.now();
    const cachedData = JSON.parse(GM_getValue(cacheKey, '{}'));
    
    if (cachedData.timestamp && (currentTime - cachedData.timestamp < 7 * 24 * 60 * 60 * 1000)) {
      return cachedData.mappings;
    }
    
    try {
      const response = await fetch(`${BASE_URL}remap.json`);
      const data = await response.json();
      
      GM_setValue(cacheKey, JSON.stringify({
        mappings: data.iconRemap,
        timestamp: currentTime
      }));
      
      return data.iconRemap;
    } catch (error) {
      console.error('Failed to fetch language mappings:', error);
      return cachedData.mappings || {};
    }
  }

  function normalizeLanguageName(language) {
    const normalizedLanguage = language.toLowerCase();

    for (const [iconName, languageList] of Object.entries(languageMappings)) {
      if (languageList.includes(normalizedLanguage)) {
        return iconName;
      }
    }

    return normalizedLanguage;
  }

  async function fetchAvailableIcons() {
    const cacheKey = 'githubLanguageIconsCache';
    const currentTime = Date.now();
    const cachedData = JSON.parse(GM_getValue(cacheKey, '{}'));

    if (cachedData.timestamp && (currentTime - cachedData.timestamp < 7 * 24 * 60 * 60 * 1000)) {
      return cachedData.fileTypes;
    }

    try {
      const response = await fetch(`${BASE_URL}icons.json`);
      const data = await response.json();

      GM_setValue(cacheKey, JSON.stringify({
        fileTypes: data.fileTypes,
        timestamp: currentTime
      }));

      return data.fileTypes;
    } catch (error) {
      console.error('Failed to fetch icon list:', error);
      return cachedData.fileTypes || [];
    }
  }

  async function replaceLanguageIcons() {
    let availableIcons;
    try {
      availableIcons = await fetchAvailableIcons();
    } catch (error) {
      console.error('Error getting available icons:', error);
      return;
    }

    const processedElements = new Set();

    async function replaceOtherIcon(targetSvg) {
      if (!CONFIG.case_04) return;

      try {
        const response = await fetch(`${ICON_BASE_URL}other.svg`);
        const svgText = await response.text();

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const newSvg = svgDoc.querySelector('svg');

        const attributes = targetSvg.attributes;
        for (let i = 0; i < attributes.length; i++) {
          const attr = attributes[i];
          if (attr.name !== 'class') {
            newSvg.setAttribute(attr.name, attr.value);
          }
        }

        newSvg.setAttribute('width', '16');
        newSvg.setAttribute('height', '16');
        newSvg.setAttribute('viewBox', '0 0 24 24');

        const innerGroup = newSvg.querySelector('g') || newSvg.querySelector('path');
        if (innerGroup) {
          innerGroup.setAttribute('transform', 'scale(0.67)');
        }

        const targetClasses = Array.from(targetSvg.classList);
        targetClasses.forEach(className => {
          newSvg.classList.add(className);
        });

        newSvg.style.width = '16px';
        newSvg.style.height = '16px';
        newSvg.style.minWidth = '16px';
        newSvg.style.minHeight = '16px';

        targetSvg.parentNode.replaceChild(newSvg, targetSvg);
      } catch (error) {
        console.error('Failed to replace Other icon:', error);
      }
    }

    function processElement(element) {
      if (processedElements.has(element)) return;
      processedElements.add(element);

      let langElement, language;

      // Case 1: The average of all icons
      if (CONFIG.case_01 && element.matches('.repo-language-color')) {
        const languageSpan = element.parentElement.querySelector('[itemprop="programmingLanguage"]');

        if (languageSpan && !languageSpan.dataset.iconProcessed) {
          language = normalizeLanguageName(languageSpan.textContent);

          if (availableIcons.includes(language)) {
            const iconImg = document.createElement('img');
            iconImg.src = `${ICON_BASE_URL}${language}.svg`;
            iconImg.alt = `${language} icon`;
            iconImg.width = 16;
            iconImg.height = 16;
            iconImg.style.marginRight = '2px';
            iconImg.style.verticalAlign = 'sub';

            element.parentElement.insertBefore(iconImg, element);
            element.remove();
            languageSpan.dataset.iconProcessed = 'true';
          }
        }
      }
      // Case 2: Organization's Repositories 
      else if (CONFIG.case_02 && element.matches('.Box-sc-g0xbh4-0.fCvgBf')) {
        const languageSpan = element.querySelector('.prc-Text-Text-0ima0');
        
        if (languageSpan && !languageSpan.dataset.iconProcessed) {
          const languageText = languageSpan.textContent.trim();
          language = normalizeLanguageName(languageText);
          
          element.innerHTML = '';
          
          const newLanguageSpan = document.createElement('span');
          newLanguageSpan.className = 'Box-sc-g0xbh4-0 fVplbS prc-Text-Text-0ima0';
          newLanguageSpan.textContent = languageText;
          
          if (availableIcons.includes(language)) {
            const iconImg = document.createElement('img');
            iconImg.src = `${ICON_BASE_URL}${language}.svg`;
            iconImg.alt = `${language} icon`;
            iconImg.width = 16;
            iconImg.height = 16;
            iconImg.style.verticalAlign = 'middle';
            
            element.appendChild(iconImg);
          }
          
          element.appendChild(newLanguageSpan);
          newLanguageSpan.dataset.iconProcessed = 'true';
        }
      }
      // Case 3: Languages
      else if (CONFIG.case_03 && element.matches('.d-inline')) {
        langElement = element.querySelector('.text-bold');

        if (!langElement || langElement.textContent.toLowerCase() === 'other' || element.dataset.iconChecked) return;

        language = normalizeLanguageName(langElement.textContent);
        element.dataset.iconChecked = 'true';

        const svg = element.querySelector('svg');

        if (!svg || !availableIcons.includes(language)) return;

        const img = document.createElement('img');
        img.src = `${ICON_BASE_URL}${language}.svg`;
        img.width = 16;
        img.height = 16;
        img.className = 'mr-2';
        img.style.verticalAlign = 'middle';

        svg.parentNode.replaceChild(img, svg);
      }
      // Case 4: Other Languages
      else if (CONFIG.case_04 && element.matches('.octicon-dot-fill')) {
        const parentElement = element.closest('.d-inline');
        if (parentElement) {
          const languageElement = parentElement.querySelector('.text-bold');
          if (languageElement && languageElement.textContent.toLowerCase() === 'other' && !element.dataset.iconProcessed) {
            element.dataset.iconProcessed = 'true';
            replaceOtherIcon(element);
          }
        }
      }
      // Case 5: Filter by
      else if (CONFIG.case_05 && element.matches('.Box-sc-g0xbh4-0.hjDqIa')) {
        const languageSpan = element.nextElementSibling;
        if (languageSpan && languageSpan.getAttribute('aria-label') && !languageSpan.dataset.iconProcessed) {
          language = normalizeLanguageName(languageSpan.getAttribute('aria-label').replace(' language', ''));

          if (availableIcons.includes(language)) {
            const iconImg = document.createElement('img');
            iconImg.src = `${ICON_BASE_URL}${language}.svg`;
            iconImg.alt = `${language} icon`;
            iconImg.width = 16;
            iconImg.height = 16;
            iconImg.style.marginRight = '4px';
            iconImg.style.verticalAlign = 'middle';

            element.style.display = 'none';
            languageSpan.parentNode.insertBefore(iconImg, languageSpan);
            languageSpan.dataset.iconProcessed = 'true';
          }
        }
      }
      // Case 6: More languages...
      else if (CONFIG.case_06 && element.matches('.ActionListItem-visual.ActionListItem-visual--leading')) {
        const languageLabel = element.closest('.ActionListContent')?.querySelector('.ActionListItem-label.text-normal');
        if (!languageLabel || !languageLabel.textContent || element.dataset.iconChecked) return;

        language = normalizeLanguageName(languageLabel.textContent);
        element.dataset.iconChecked = 'true';

        const colorDiv = element.querySelector('div');
        if (!colorDiv || !availableIcons.includes(language)) return;

        const img = document.createElement('img');
        img.src = `${ICON_BASE_URL}${language}.svg`;
        img.width = 16;
        img.height = 16;
        img.style.verticalAlign = 'middle';

        colorDiv.replaceWith(img);
      }
      // Case 7: Search's Languages
      else if (CONFIG.case_07 && element.matches('.prc-ActionList-LeadingVisual-dxXxW, .prc-ActionList-VisualWrap-rfjV-')) {
        if (element.dataset.iconChecked) return;
        element.dataset.iconChecked = 'true';
        
        const listItem = element.closest('.prc-ActionList-ActionListItem-uq6I7');
        if (!listItem) return;
        
        const languageDiv = listItem.querySelector('.Truncate__StyledTruncate-sc-23o1d2-0');
        if (!languageDiv || !languageDiv.title) return;
        
        language = normalizeLanguageName(languageDiv.title);
        
        const colorDiv = element.querySelector('.Box-sc-g0xbh4-0');
        if (!colorDiv || !availableIcons.includes(language)) return;
        
        const img = document.createElement('img');
        img.src = `${ICON_BASE_URL}${language}.svg`;
        img.alt = `${language} icon`;
        img.width = 16;
        img.height = 16;
        img.style.verticalAlign = 'middle';
        
        colorDiv.replaceWith(img);
      }
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches('.d-inline, .Box-sc-g0xbh4-0.fCvgBf, .repo-language-color, .Box-sc-g0xbh4-0.hjDqIa, .ActionListItem-visual.ActionListItem-visual--leading, .octicon-dot-fill, .prc-ActionList-LeadingVisual-dxXxW, .prc-ActionList-VisualWrap-rfjV-')) {
              processElement(node);
            } else {
              node.querySelectorAll('.d-inline, .Box-sc-g0xbh4-0.fCvgBf, .repo-language-color, .Box-sc-g0xbh4-0.hjDqIa, .ActionListItem-visual.ActionListItem-visual--leading, .octicon-dot-fill, .prc-ActionList-LeadingVisual-dxXxW, .prc-ActionList-VisualWrap-rfjV-').forEach(processElement);
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    document.querySelectorAll('.d-inline, .Box-sc-g0xbh4-0.fCvgBf, .repo-language-color, .Box-sc-g0xbh4-0.hjDqIa, .ActionListItem-visual.ActionListItem-visual--leading, .octicon-dot-fill, .prc-ActionList-LeadingVisual-dxXxW, .prc-ActionList-VisualWrap-rfjV-').forEach(processElement);
  }

  async function init() {
    languageMappings = await fetchLanguageMappings();
    replaceLanguageIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();