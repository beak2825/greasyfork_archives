// ==UserScript==
// @name         GitHub Custom Global Navigation
// @namespace    https://github.com/blakegearin/github-custom-global-navigation
// @version      1.7.0
// @description  Customize GitHub's new global navigation
// @author       Blake Gearin <hello@blakeg.me> (https://blakegearin.com)
// @match        https://github.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM.getValue
// @grant        GM.setValue
// @icon         https://raw.githubusercontent.com/blakegearin/github-custom-global-navigation/main/img/light_logo.png
// @supportURL   https://github.com/blakegearin/github-custom-global-navigation/issues
// @license      MIT
// @copyright    2023–2025, Blake Gearin (https://blakegearin.com)
// @downloadURL https://update.greasyfork.org/scripts/478687/GitHub%20Custom%20Global%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/478687/GitHub%20Custom%20Global%20Navigation.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* global GM_config */

(function () {
  'use strict';

  const VERSION = '1.7.0';
  const USERSCRIPT_NAME = 'GitHub Custom Global Navigation';

  const SILENT = 0;
  const QUIET = 1;
  const INFO = 2;
  const DEBUG = 3;
  const VERBOSE = 4;
  const TRACE = 5;

  // Change to SILENT, QUIET, INFO, DEBUG, VERBOSE, or TRACE
  const LOG_LEVEL_OVERRIDE = null;

  const LOG_LEVELS = {
    default: QUIET,
    getName: (level) => {
      return {
        0: 'silent',
        1: 'quiet',
        2: 'info',
        3: 'debug',
        4: 'verbose',
        5: 'trace',
      }[level];
    },
    getValue: (name) => {
      return {
        silent: SILENT,
        quiet: QUIET,
        info: INFO,
        debug: DEBUG,
        verbose: VERBOSE,
        trace: TRACE,
      }[name];
    },
  };

  let CURRENT_LOG_LEVEL = LOG_LEVELS.default;

  function log (level, message, variable = undefined) {
    if (CURRENT_LOG_LEVEL < level) return;

    const levelName = LOG_LEVELS.getName(level);

    const log = `[${VERSION}] [${levelName}] ${USERSCRIPT_NAME}: ${message}`;

    console.groupCollapsed(log);

    if (variable !== undefined) console.dir(variable, { depth: null });

    console.trace();
    console.groupEnd();
  }

  function logError (message, error = undefined) {
    const log = `[${VERSION}] [error] ${USERSCRIPT_NAME}: ${message}`;

    console.groupCollapsed(log);

    if (error !== undefined) console.error(error);

    console.trace();
    console.groupEnd();
  }

  log(TRACE, 'Starting');

  function updateHeader() {
    log(DEBUG, 'updateHeader()');

    if (CONFIG.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.self}
        {
          background-color: ${CONFIG.backgroundColor} !important;
        }
      `;
    }

    updateHamburgerButton();
    updateLogo();

    if (CONFIG.repositoryHeader.import) importRepositoryHeader();

    updatePageTitle();
    updateSearch();
    updateCopilot();

    if (CONFIG.divider.remove) removeDivider();

    if (CONFIG.marketplace.add) createMarketplaceLink();
    if (CONFIG.explore.add) createExploreLink();

    updateLink('issues');
    updateLink('pullRequests');
    updateLink('repos');

    if (CONFIG.marketplace.add) updateLink('marketplace');
    if (CONFIG.explore.add) updateLink('explore');

    if (CONFIG.flipIssuesPullRequests) flipIssuesPullRequests();

    updateCreateNewButton();
    updateInboxLink();

    if (CONFIG.flipCreateInbox) flipCreateInbox();

    updateAvatar();

    updateGlobalBar();
    updateLocalBar();

    updateSidebars();

    modifyThenObserve(() => {
      document.body.appendChild(HEADER_STYLE);
    });
  }

  function updateHamburgerButton() {
    log(DEBUG, 'updateHamburgerButton()');

    const configKey = 'hamburgerButton';
    const elementConfig = CONFIG.hamburgerButton;
    log(DEBUG, 'elementConfig', elementConfig);

    const hamburgerButton = HEADER.querySelector(SELECTORS[configKey]);

    if (!hamburgerButton) {
      logError(`Selector '${SELECTORS[configKey]}' not found`);
      return;
    }

    if (elementConfig.remove) {
      HEADER_STYLE.textContent += cssHideElement(SELECTORS[configKey]);

      return;
    }
  }

  function updateLogo() {
    log(DEBUG, 'updateLogo()');

    const configKey = 'logo';

    const elementConfig = CONFIG[configKey];
    const elementSelector = SELECTORS[configKey];

    if (elementConfig.remove) {
      HEADER_STYLE.textContent += cssHideElement(elementSelector.topDiv);
    }

    const logo = HEADER.querySelector(elementSelector.svg);

    if (elementConfig.color !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.svg} path
        {
          fill: ${elementConfig.color} !important;
        }
      `;
    }

    if (elementConfig.customSvg !== '') {
      const oldSvg = logo;

      let newSvg;

      if (isValidURL(elementConfig.customSvg)) {
        newSvg = document.createElement('img');
        newSvg.src = elementConfig.customSvg;
      } else {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(elementConfig.customSvg, 'image/svg+xml');
        newSvg = svgDoc.documentElement;
      }

      oldSvg.parentNode.replaceChild(newSvg, oldSvg);
    }
  }

  function removePageTitle() {
    HEADER_STYLE.textContent += cssHideElement(createId(SELECTORS.pageTitle.id));
  }

  function updatePageTitle() {
    log(DEBUG, 'updatePageTitle()');

    const elementConfig = CONFIG.pageTitle;
    log(DEBUG, 'elementConfig', elementConfig);

    const pageTitle = HEADER.querySelector(SELECTORS.pageTitle.topDiv);

    if (!pageTitle) {
      logError(`Selector '${SELECTORS.pageTitle.topDiv}' not found`);
      return;
    }

    pageTitle.setAttribute('id', SELECTORS.pageTitle.id);

    if (elementConfig.remove) {
      removePageTitle();
      return;
    }

    if (elementConfig.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.pageTitle.links}
        {
          color: ${elementConfig.color} !important;
        }
      `;
    }

    if (elementConfig.hover.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.pageTitle.links}:hover
        {
          color: ${elementConfig.hover.color} !important;
        }
      `;
    }

    if (elementConfig.hover.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.pageTitle.links}:hover
        {
          background-color: ${elementConfig.hover.backgroundColor} !important;
        }
      `;
    }
  }

  function updateSearch() {
    log(DEBUG, 'updateSearch()');

    const configKey = 'search';

    const elementConfig = CONFIG[configKey];
    const elementSelector = SELECTORS[configKey];

    let topDivSelector = elementSelector.id;
    const topDiv = HEADER.querySelector(createId(elementSelector.id)) ||
      HEADER.querySelector(elementSelector.topDiv);

    if (!topDiv) {
      logError(`Selectors '${createId(elementSelector.id)}' and '${elementSelector.topDiv}' not found`);
      return;
    }

    topDiv.setAttribute('id', elementSelector.id);

    if (elementConfig.remove) {
      HEADER_STYLE.textContent += cssHideElement(createId(elementSelector.id));
      return;
    }

    if (elementConfig.alignLeft) {
      const response = cloneAndLeftAlignElement(createId(topDivSelector), topDivSelector);

      if (response.length === 0) return;

      // Also need to hide button due to it showing up on larger screen widths
      HEADER_STYLE.textContent += cssHideElement(`${createId(topDivSelector)} ${elementSelector.input}`);

      HEADER_STYLE.textContent += `
        ${createId(topDivSelector)}
        {
          flex-grow: 1 !important;
        }
      `;

      const [cloneId, _cloneElement] = response;

      topDivSelector = createId(cloneId);

      HEADER_STYLE.textContent += `
        ${topDivSelector}
        {
          flex: 0 1 auto !important;
          justify-content: flex-start !important;
        }
      `;
    }

    if (elementConfig.width === 'max') {
      log(DEBUG, 'elementSelector', elementSelector);

      HEADER_STYLE.textContent += `
        @media (min-width: 1012px) {
          ${elementSelector.input}
          {
            width: auto !important
          }

          ${SELECTORS.header.leftAligned}
          {
            flex: 0 1 auto !important;
          }

          ${SELECTORS.header.rightAligned}
          {
            flex: 1 1 auto !important;
            justify-content: space-between !important;
          }

          ${createId(topDivSelector)}
          {
            display: block !important;
          }

          ${elementSelector.topDiv}-whenRegular
          {
            max-width: none !important;
          }
        }
      `;
    } else if (elementConfig.width !== '') {
      HEADER_STYLE.textContent += `
        @media (min-width: 1012px)
        {
          ${topDivSelector},
          ${elementSelector.input}
          {
            width: ${elementConfig.width} !important
          }
        }

        @media (min-width: 768px)
        {
          ${topDivSelector},
          ${elementSelector.input}
          {
            --feed-sidebar: 320px;
          }
        }

        @media (min-width: 1400px)
        {
          ${topDivSelector},
          ${elementSelector.input}
          {
            --feed-sidebar: 336px;
          }
        }
      `;
    }

    if (elementConfig.margin.left !== '') {
      HEADER_STYLE.textContent += `
        @media (min-width: 1012px)
        {
          ${elementSelector.input}
          {
            margin-left: ${elementConfig.margin.left} !important
          }
        }
      `;
    }

    if (elementConfig.margin.right!== '') {
      HEADER_STYLE.textContent += `
        @media (min-width: 1012px)
        {
          ${elementSelector.input}
          {
            margin-right: ${elementConfig.margin.right} !important
          }
        }
      `;
    }

    if (elementConfig.rightButton !== 'command palette') {
      const commandPaletteButton = HEADER.querySelector(elementSelector.commandPalette);
      if (!commandPaletteButton) {
        logError(`Selector '${elementSelector.commandPalette}' not found`);
      } else {
        HEADER_STYLE.textContent += cssHideElement(elementSelector.commandPalette);
      }
    }

    const placeholderSpan = HEADER.querySelector(elementSelector.placeholderSpan);

    if (!placeholderSpan) {
      logError(`Selector '${elementSelector.placeholderSpan}' not found`);
      return;
    }

    if (elementConfig.placeholder.text !== '') {
      // Without this, the placeholder text is overwritten by the shadow DOM
      // You may see the following error in the console:
      // qbsearch-input-element.ts:421 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'innerHTML')
      placeholderSpan.setAttribute('data-target', 'avoidShadowDOM');
      placeholderSpan.innerText = elementConfig.placeholder.text;
    }

    if (elementConfig.placeholder.color !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.placeholderSpan}
        {
          color: ${elementConfig.placeholder.color} !important;
        }
      `;
    }

    const searchButton = HEADER.querySelector(elementSelector.button);

    if (!searchButton) {
      logError(`Selector '${elementSelector.button}' not found`);
      return;
    }

    if (elementConfig.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.button}
        {
          background-color: ${elementConfig.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.borderColor !== '') {
      // There are different buttons at different widths
      HEADER_STYLE.textContent += `
        ${elementSelector.input} button
        {
          border-color: ${elementConfig.borderColor} !important;
        }
      `;
    }

    if (elementConfig.boxShadow !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.button}
        {
          box-shadow: ${elementConfig.boxShadow} !important;
        }
      `;
    }

    if (elementConfig.magnifyingGlassIcon.remove) {
      HEADER_STYLE.textContent += cssHideElement(elementSelector.magnifyingGlassIcon);
    }

    if (elementConfig.modal.width !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.modal}
        {
          width: ${elementConfig.modal.width} !important;
        }
      `;
    }

    if (elementConfig.rightButton === 'slash key') {
      HEADER_STYLE.textContent += `
        ${elementSelector.placeholderSpan}
        {
          width: 100% !important;
        }
      `;

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(
        '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" aria-hidden="true"><path fill="none" stroke="#979A9C" opacity=".4" d="M3.5.5h12c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3h-12c-1.7 0-3-1.3-3-3v-13c0-1.7 1.3-3 3-3z"></path><path fill="#979A9C" d="M11.8 6L8 15.1h-.9L10.8 6h1z"></path></svg>',
        'image/svg+xml',
      );
      const slashImg = svgDoc.documentElement;
      slashImg.alt = 'slash key to search';

      const placeholderDiv = HEADER.querySelector(elementSelector.placeholderDiv);

      if (!placeholderDiv) {
        logError(`Selector '${elementSelector.placeholderDiv}' not found`);
        return;
      }

      HEADER_STYLE.textContent += `
        ${elementSelector.placeholderDiv}
        {
          display: flex !important;
        }

        ${elementSelector.button}
        {
          padding-inline-start: 8px !important;
        }
      `;

      placeholderDiv.appendChild(slashImg);
    }

    log(DEBUG, `Updates applied to ${configKey}`);
  }

  function updateCopilot() {
    log(DEBUG, 'updateCopilot()');

    const configKey = 'copilot';

    const elementConfig = CONFIG[configKey];
    const elementSelector = SELECTORS[configKey];

    let topDivSelector = elementSelector.id;
    const topDiv = HEADER.querySelector(createId(elementSelector.id)) ||
      HEADER.querySelector(elementSelector.topDiv);

    if (!topDiv) {
      logError(`Selectors '${createId(elementSelector.id)}' and '${elementSelector.topDiv}' not found`);
      return;
    }

    topDiv.setAttribute('id', elementSelector.id);

    if (elementConfig.remove) {
      HEADER_STYLE.textContent += cssHideElement(createId(elementSelector.id));
      return;
    }

    if (!elementConfig.tooltip && SELECTORS.toolTips[configKey]?.id) {
      HEADER_STYLE.textContent += cssHideElement(createId(SELECTORS.toolTips[configKey].id));
    }

    const button = HEADER.querySelector(elementSelector.button);

    let textContent = elementConfig.text.content;

    if (elementConfig.icon.remove) {
      const svgId = `${configKey}-svg`;
      const svg = button.querySelector('svg');

      if (!svg) {
        logError(`Selector '${configKey} svg' not found`);

        return;
      }

      svg.setAttribute('id', svgId);

      HEADER_STYLE.textContent += cssHideElement(createId(svgId));
    } else {
      button.querySelector('svg').style.setProperty('fill', elementConfig.icon.color);
      textContent = UNICODE_NON_BREAKING_SPACE + textContent;
    }

    modifyThenObserve(() => {
      HEADER.querySelector(createId(elementSelector.textContent))?.remove();
    });

    if (elementConfig.text.content !== '') {
      const spanElement = document.createElement('span');
      const spanId = `${configKey}-text-content-span`;
      spanElement.setAttribute('id', spanId);

      const padding = '0.5rem';

      HEADER_STYLE.textContent += `
        ${elementSelector.button}
        {
          padding-left: ${padding} !important;
          padding-right: ${padding} !important;
          width: auto !important;
          text-decoration: none !important;
          display: flex !important;
        }
      `;

      if (elementConfig.text.color) {
        HEADER_STYLE.textContent += `
          ${createId(spanId)}
          {
            color: ${elementConfig.text.color} !important;
          }
        `;
      }

      const textNode = document.createTextNode(textContent);
      spanElement.appendChild(textNode);

      button.appendChild(spanElement);
    }

    if (!elementConfig.border) {
      HEADER_STYLE.textContent += `
        ${createId(topDivSelector)}
        {
          border: none !important;
        }
      `;
    }

    if (elementConfig.boxShadow !== '') {
      HEADER_STYLE.textContent += `
        ${createId(topDivSelector)}
        {
          box-shadow: ${elementConfig.boxShadow} !important;
        }
      `;
    }

    if (elementConfig.hover.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${createId(topDivSelector)}:hover
        {
          background-color: ${elementConfig.hover.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.hover.color !== '') {
      HEADER_STYLE.textContent += `
        ${createId(topDivSelector)} span:hover
        {
          color: ${elementConfig.hover.color} !important;
        }
      `;
    }

    log(DEBUG, `Updates applied to ${configKey}`);
  }

  function removeDivider() {
    log(DEBUG, 'removeDivider()');

    HEADER_STYLE.textContent += `
      ${SELECTORS.header.actionsDiv}::before
      {
        content: none !important;
      }
    `;
  }

  function updateLink(configKey) {
    log(DEBUG, `updateLink() with ${configKey}`);

    const elementConfig = CONFIG[configKey];
    const elementSelector = SELECTORS[configKey];

    let link;
    const tooltipElement = SELECTORS.toolTips[configKey];

    if (tooltipElement) {
      link = tooltipElement.previousElementSibling;
      log(DEBUG, `Found link for ${configKey} using tooltipElement.previousElementSibling`);
    } else {
      log(DEBUG, `Tooltip for '${configKey}' not found`);

      const linkId = createId(SELECTORS[configKey].id);
      log(DEBUG, `Trying HEADER.querySelector(${linkId}) for ${configKey}`);
      link = HEADER.querySelector(linkId);

      if (!link) {
        log(DEBUG, `HEADER.querySelector(${linkId}) not found, trying SELECTORS[configKey].link: ${elementSelector.link}`);
        link = HEADER.querySelector(elementSelector.link);
        if (!link) {
          logError(`Selector '${linkId}' and '${elementSelector.link}' not found for ${configKey}`);
          return;
        } else {
          log(DEBUG, `Found link for ${configKey} using selector: ${elementSelector.link}`);
        }
      } else {
        log(DEBUG, `Found link for ${configKey} using id selector: ${linkId}`);
      }
    }

    let linkSelector = elementSelector.id;
    link.setAttribute('id', linkSelector);

    if (elementConfig.remove) {
      HEADER_STYLE.textContent += cssHideElement(createId(configKey));
      return;
    }

    if (!elementConfig.tooltip && SELECTORS.toolTips[configKey]?.id) {
      HEADER_STYLE.textContent += cssHideElement(createId(SELECTORS.toolTips[configKey].id));
    }

    if (elementConfig.alignLeft) {
      const response = cloneAndLeftAlignElement(createId(elementSelector.id), elementSelector.id);
      if (response.length === 0) return;
      const [cloneId, cloneElement] = response;
      elementSelector[CONFIG_NAME] = { leftAlignedId: cloneId };
      link = cloneElement;
      linkSelector = createId(cloneId);
    }

    const padding = '0.5rem';
    link.style.setProperty('padding-left', padding, 'important');
    link.style.setProperty('padding-right', padding, 'important');
    link.style.setProperty('display', 'flex');

    let textContent = elementConfig.text.content;

    if (elementConfig.icon.remove) {
      const svgId = `${configKey}-svg`;
      const svg = link.querySelector('svg');
      if (!svg) {
        logError(`Selector '${configKey} svg' not found`);
        log(INFO, `Could not find svg for ${configKey} in link element`);
        return;
      }
      svg.setAttribute('id', svgId);
      HEADER_STYLE.textContent += cssHideElement(createId(svgId));
    } else {
      link.querySelector('svg').style.setProperty('fill', elementConfig.icon.color);
      textContent = UNICODE_NON_BREAKING_SPACE + textContent;
    }

    modifyThenObserve(() => {
      HEADER.querySelector(createId(elementSelector.textContent))?.remove();
    });

    if (elementConfig.text.content !== '') {
      const spanElement = document.createElement('span');
      const spanId = `${configKey}-text-content-span`;
      spanElement.setAttribute('id', spanId);

      if (elementConfig.text.color) {
        HEADER_STYLE.textContent += `
          ${createId(spanId)}
          {
            color: ${elementConfig.text.color} !important;
          }
        `;
      }

      const textNode = document.createTextNode(textContent);
      spanElement.appendChild(textNode);

      link.appendChild(spanElement);
    }

    if (!elementConfig.border) {
      HEADER_STYLE.textContent += `
        ${linkSelector}
        {
          border: none !important;
        }
      `;
    }

    if (elementConfig.boxShadow !== '') {
      HEADER_STYLE.textContent += `
        ${linkSelector}
        {
          box-shadow: ${elementConfig.boxShadow} !important;
        }
      `;
    }

    if (elementConfig.hover.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${linkSelector}:hover
        {
          background-color: ${elementConfig.hover.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.hover.color !== '') {
      HEADER_STYLE.textContent += `
        ${linkSelector} span:hover
        {
          color: ${elementConfig.hover.color} !important;
        }
      `;
    }

    log(DEBUG, `Updates applied to link ${configKey}`, link);
  }

  function cloneAndFlipElements(firstElementSelector, secondElementSelector, firstElementId, secondElementId) {
    log(DEBUG, 'cloneAndFlipElements()');

    const firstElement = HEADER.querySelector(firstElementSelector);

    if (!firstElement) {
      logError(`Selector '${firstElementSelector}' not found`);
      return [];
    }

    const secondElement = HEADER.querySelector(secondElementSelector);

    if (!secondElement) {
      logError(`Selector '${secondElementSelector}' not found`);
      return [];
    }

    const firstElementClone = firstElement.cloneNode(true);
    const secondElementClone = secondElement.cloneNode(true);

    const firstElementCloneId = `${firstElementId}-clone`;
    const secondElementCloneId = `${secondElementId}-clone`;

    firstElementClone.setAttribute('id', firstElementCloneId);
    secondElementClone.setAttribute('id', secondElementCloneId);

    firstElementClone.style.setProperty('display', 'none');
    secondElementClone.style.setProperty('display', 'none');

    HEADER_STYLE.textContent = HEADER_STYLE.textContent.replace(
      new RegExp(escapeRegExp(firstElementSelector), 'g'),
      createId(firstElementCloneId),
    );

    HEADER_STYLE.textContent = HEADER_STYLE.textContent.replace(
      new RegExp(escapeRegExp(secondElementSelector), 'g'),
      createId(secondElementCloneId),
    );

    HEADER_STYLE.textContent += cssHideElement(firstElementSelector);
    HEADER_STYLE.textContent += cssHideElement(secondElementSelector);

    log(VERBOSE, `#${firstElementCloneId}, #${secondElementCloneId}`);
    HEADER_STYLE.textContent += `
      #${firstElementCloneId},
      #${secondElementCloneId}
      {
        display: flex !important;
      }
    `;

    if (secondElement.nextElementSibling === null) {
      secondElement.parentNode.appendChild(firstElementClone);
    } else {
      secondElement.parentNode.insertBefore(firstElementClone, secondElement.nextElementSibling);
    }

    if (firstElement.nextElementSibling === null) {
      firstElement.parentNode.appendChild(secondElementClone);
    } else {
      firstElement.parentNode.insertBefore(secondElementClone, firstElement.nextElementSibling);
    }

    if (firstElementSelector.includes('clone')) {
      firstElement.remove();
    }

    if (secondElementSelector.includes('clone')) {
      secondElement.remove();
    }

    NEW_ELEMENTS.push(firstElementClone);
    NEW_ELEMENTS.push(secondElementClone);

    return [firstElementClone, secondElementClone];
  }

  function flipIssuesPullRequests() {
    log(DEBUG, 'flipIssuesPullRequest()');

    const issuesId = SELECTORS.issues[CONFIG_NAME]?.leftAlignedId || SELECTORS.issues.id;
    log(VERBOSE, 'issuesId', issuesId);

    const pullRequestsId = SELECTORS.pullRequests[CONFIG_NAME]?.leftAlignedId || SELECTORS.pullRequests.id;
    log(VERBOSE, 'pullRequestsId', pullRequestsId);

    cloneAndFlipElements(
      createId(issuesId),
      createId(pullRequestsId),
      `${issuesId}-flip-div`,
      `${pullRequestsId}-flip-div`,
    );
  }

  function createOldLink(configKey, svgString) {
    const pullRequestsLink = HEADER.querySelector(SELECTORS.pullRequests.link);

    if (!pullRequestsLink) {
      logError(`Selector '${SELECTORS.pullRequests.link}' not found`);
      return;
    }

    const clonedLink = pullRequestsLink.cloneNode(true);

    const linkId = SELECTORS[configKey].id;
    clonedLink.setAttribute('id', linkId);

    const oldSvg = clonedLink.querySelector('svg');

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const newSvg = svgDoc.documentElement;

    oldSvg.parentNode.replaceChild(newSvg, oldSvg);

    const ariaId = `tooltip-${configKey}`;

    clonedLink.setAttribute('href', `/${configKey}`);
    clonedLink.setAttribute('aria-labelledby', ariaId);
    clonedLink.removeAttribute('data-analytics-event');

    clonedLink.querySelector('span')?.remove();

    pullRequestsLink.parentNode.appendChild(clonedLink);

    NEW_ELEMENTS.push(clonedLink);
  }

  function createMarketplaceLink() {
    log(DEBUG, 'createMarketplaceLink()');

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-gift">
        <path d="M2 2.75A2.75 2.75 0 0 1 4.75 0c.983 0 1.873.42 2.57 1.232.268.318.497.668.68 1.042.183-.375.411-.725.68-1.044C9.376.42 10.266 0 11.25 0a2.75 2.75 0 0 1 2.45 4h.55c.966 0 1.75.784 1.75 1.75v2c0 .698-.409 1.301-1 1.582v4.918A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V9.332C.409 9.05 0 8.448 0 7.75v-2C0 4.784.784 4 1.75 4h.55c-.192-.375-.3-.8-.3-1.25ZM7.25 9.5H2.5v4.75c0 .138.112.25.25.25h4.5Zm1.5 0v5h4.5a.25.25 0 0 0 .25-.25V9.5Zm0-4V8h5.5a.25.25 0 0 0 .25-.25v-2a.25.25 0 0 0-.25-.25Zm-7 0a.25.25 0 0 0-.25.25v2c0 .138.112.25.25.25h5.5V5.5h-5.5Zm3-4a1.25 1.25 0 0 0 0 2.5h2.309c-.233-.818-.542-1.401-.878-1.793-.43-.502-.915-.707-1.431-.707ZM8.941 4h2.309a1.25 1.25 0 0 0 0-2.5c-.516 0-1 .205-1.43.707-.337.392-.646.975-.879 1.793Z"></path>
      </svg>
    `;

    createOldLink('marketplace', svgString);
  }

  function createExploreLink() {
    log(DEBUG, 'createExploreLink()');

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-telescope">
        <path d="M14.184 1.143v-.001l1.422 2.464a1.75 1.75 0 0 1-.757 2.451L3.104 11.713a1.75 1.75 0 0 1-2.275-.702l-.447-.775a1.75 1.75 0 0 1 .53-2.32L11.682.573a1.748 1.748 0 0 1 2.502.57Zm-4.709 9.32h-.001l2.644 3.863a.75.75 0 1 1-1.238.848l-1.881-2.75v2.826a.75.75 0 0 1-1.5 0v-2.826l-1.881 2.75a.75.75 0 1 1-1.238-.848l2.049-2.992a.746.746 0 0 1 .293-.253l1.809-.87a.749.749 0 0 1 .944.252ZM9.436 3.92h-.001l-4.97 3.39.942 1.63 5.42-2.61Zm3.091-2.108h.001l-1.85 1.26 1.505 2.605 2.016-.97a.247.247 0 0 0 .13-.151.247.247 0 0 0-.022-.199l-1.422-2.464a.253.253 0 0 0-.161-.119.254.254 0 0 0-.197.038ZM1.756 9.157a.25.25 0 0 0-.075.33l.447.775a.25.25 0 0 0 .325.1l1.598-.769-.83-1.436-1.465 1Z"></path>
      </svg>
    `;

    createOldLink('explore', svgString);
  }

  function updateCreateNewButton() {
    log(DEBUG, 'updateCreateNewButton()');

    const configKey = 'create';
    const elementSelector = SELECTORS[configKey];
    const tooltipElement = SELECTORS.toolTips[configKey];

    if (!tooltipElement) {
      logError(`Selector '${SELECTORS.toolTips[configKey]}' not found`);
      return;
    }

    let button = HEADER.querySelector(elementSelector.button);
    let oldButtonId = null;

    if (!button) {
      logError(`Selector '${elementSelector.button}' not found`);

      oldButtonId = `${elementSelector.button}-old`;
      button = HEADER.querySelector(oldButtonId);

      if (!button) {
        logError(`Selector '${oldButtonId}' not found`);
        return;
      }
    }

    const elementConfig = CONFIG[configKey];

    if (elementConfig.remove) {
      HEADER_STYLE.textContent += cssHideElement(elementSelector.topDiv);

      return;
    } else if (!elementConfig.tooltip) {
      HEADER_STYLE.textContent += cssHideElement(createId(tooltipElement.id));
    }

    const topDiv = HEADER.querySelector(elementSelector.topDiv);

    if (!topDiv) {
      logError(`Selector '${elementSelector.topDiv}' not found`);
      return;
    }

    topDiv.setAttribute('id', elementSelector.id);

    const buttonLabel = button.querySelector(elementSelector.dropdownIcon);

    if (elementConfig.plusIcon.remove) {
      HEADER_STYLE.textContent += `
        ${oldButtonId || elementSelector.button} ${elementSelector.plusIcon}
        {
          display: none !important
        }
      `;
    } else {

      if (elementConfig.plusIcon.color !== '') {
        HEADER_STYLE.textContent += `
          ${elementSelector.plusIcon}
          {
            color: ${elementConfig.plusIcon.color} !important;
          }
        `;
      }

      if (elementConfig.plusIcon.hover.color !== '') {
        HEADER_STYLE.textContent += `
          ${elementSelector.plusIcon.split(' ').join(':hover ')} svg path
          {
            fill: ${elementConfig.plusIcon.hover.color} !important;
          }
        `;
      }

      if (elementConfig.plusIcon.marginRight !== '') {
        HEADER_STYLE.textContent += `
          ${elementSelector.plusIcon}
          {
            margin-right: ${elementConfig.plusIcon.marginRight} !important;
          }
        `;
      }
    }

    modifyThenObserve(() => {
      HEADER.querySelector(createId(SELECTORS[configKey].textContent))?.remove();
    });

    if (elementConfig.text.content !== '') {
      // Update the text's font properties to match the others
      HEADER_STYLE.textContent += `
        ${elementSelector.button}
        {
          font-size: var(--text-body-size-medium, 0.875rem) !important;
          font-weight: var(--base-text-weight-medium, 500) !important;
        }
      `;

      const spanElement = document.createElement('span');
      spanElement.setAttribute('id', elementSelector.textContent);

      spanElement.style.setProperty('color', elementConfig.text.color);
      spanElement.textContent = elementConfig.text.content;

      // New span is inserted between the plus sign and dropdown icon
      buttonLabel.parentNode.insertBefore(spanElement, buttonLabel);
    }

    if (elementConfig.dropdownIcon.remove) {
      HEADER_STYLE.textContent += `
        ${elementSelector.dropdownIcon}
        {
          display: none !important
        }
      `;
    } else {
      HEADER_STYLE.textContent += `
        ${elementSelector.dropdownIcon}
        {
          grid-area: initial !important;
        }
      `;

      if (elementConfig.dropdownIcon.color !== '') {
        HEADER_STYLE.textContent += `
          ${elementSelector.dropdownIcon}
          {
            color: ${elementConfig.dropdownIcon.color} !important;
          }
        `;
      }

      if (elementConfig.dropdownIcon.hover.color !== '') {
        HEADER_STYLE.textContent += `
          ${elementSelector.dropdownIcon.split(' ').join(':hover ')} svg path
          {
            fill: ${elementConfig.dropdownIcon.hover.color} !important;
          }
        `;
      }
    }

    if (!elementConfig.border) {
      HEADER_STYLE.textContent += `
        ${elementSelector.button}
        {
          border: none !important;
        }
      `;
    }

    if (elementConfig.boxShadow !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.button}
        {
          box-shadow: ${elementConfig.boxShadow} !important;
        }
      `;
    }

    if (elementConfig.hoverBackgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.button}:hover
        {
          background-color: ${elementConfig.hoverBackgroundColor} !important;
        }
      `;
    }
  }

  function updateInboxLink() {
    log(DEBUG, 'updateInboxLink()');

    const configKey = 'notifications';

    const elementConfig = CONFIG[configKey];
    const elementSelector = SELECTORS[configKey];

    const notificationIndicator =  HEADER.querySelector(createId(elementSelector.id)) ||
      HEADER.querySelector(elementSelector.indicator);

    if (!notificationIndicator) {
      logError(`Selectors '${createId(elementSelector.id)}' and '${elementSelector.indicator}' not found`);
      return;
    }

    notificationIndicator.setAttribute('id', elementSelector.id);

    const inboxLink = notificationIndicator.querySelector('a');

    if (!inboxLink) {
      logError(`Selector '${elementSelector.indicator} a' not found`);
      return;
    }

    if (elementConfig.remove) {
      HEADER_STYLE.textContent += cssHideElement(elementSelector.indicator);
    }

    if (!elementConfig.tooltip) {
      HEADER_STYLE.textContent += cssHideElement(createId(SELECTORS.toolTips.notifications.id));
    }

    if (elementConfig.dot.remove) {
      HEADER_STYLE.textContent += `
        ${elementSelector.dot}
        {
          content: none !important;
        }
      `;
    } else {
      if (elementConfig.dot.color !== '') {
        HEADER_STYLE.textContent += `
          ${elementSelector.dot}
          {
            background: ${elementConfig.dot.color} !important;
          }
        `;
      }

      if (elementConfig.dot.boxShadowColor !== '') {
        HEADER_STYLE.textContent += `
          ${elementSelector.dot}
          {
            box-shadow: 0 0 0 calc(var(--base-size-4, 4px)/2) ${elementConfig.dot.boxShadowColor} !important;
          }
        `;
      }
    }

    if (elementConfig.icon.symbol === 'inbox') {
      if (elementConfig.icon.color !== '') {
        HEADER_STYLE.textContent += `
          ${createId(elementSelector.id)} a svg
          {
            fill: elementConfig.icon.color !important;
          }
        `;
      }
    } else {
      const inboxSvgId = 'inbox-svg';
      const inboxSvg = inboxLink.querySelector('svg');
      inboxSvg.setAttribute('id', inboxSvgId);

      HEADER_STYLE.textContent += cssHideElement(createId(inboxSvgId));
    }

    if (elementConfig.icon.symbol === 'bell') {
      // Bell icon from https://gist.github.com
      const bellSvgId = 'bell-svg';
      const bellSvg = `
        <svg id=${bellSvgId} style="display: none;" aria-hidden='true' height='16' viewBox='0 0 16 16' version='1.1' width='16' data-view-component='true' class='octicon octicon-bell'>
          <path d='M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.519 1.519 0 0 1 13.482 13H2.518a1.516 1.516 0 0 1-1.263-2.36l1.703-2.554A.255.255 0 0 0 3 7.947Zm5-3.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.017.017 0 0 0-.003.01l.001.006c0 .002.002.004.004.006l.006.004.007.001h10.964l.007-.001.006-.004.004-.006.001-.007a.017.017 0 0 0-.003-.01l-1.703-2.554a1.745 1.745 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5Z'></path>
        </svg>
      `;

      inboxLink.insertAdjacentHTML('afterbegin', bellSvg);

      HEADER_STYLE.textContent += `
        ${createId(bellSvgId)}
        {
          display: initial !important;
        }
      `;

      if (elementConfig.icon.color !== '') {
        HEADER_STYLE.textContent += `
          ${createId(bellSvgId)} path
          {
            fill: ${elementConfig.icon.color} !important;
          }
        `;
      }
    }

    if (elementConfig.icon.hover.color !== '') {
      HEADER_STYLE.textContent += `
        ${createId(elementSelector.id)} a:hover svg path
        {
          fill: ${elementConfig.icon.hover.color} !important;
        }
      `;
    }

    modifyThenObserve(() => {
      HEADER.querySelector(createId(SELECTORS[configKey].textContent))?.remove();
    });

    if (elementConfig.text.content !== '') {
      const padding = '0.5rem';

      HEADER_STYLE.textContent += `
        ${createId(elementSelector.id)} a
        {
          padding-left: ${padding} !important;
          padding-right: ${padding} !important;
          width: auto !important;
          text-decoration: none !important;
          display: flex !important;
        }
      `;

      let textContent = elementConfig.text.content;

      if (elementConfig.icon !== '') {
        textContent = UNICODE_NON_BREAKING_SPACE + textContent;
      }

      const spanElement = document.createElement('span');
      spanElement.setAttribute('id', elementSelector.textContent);

      // Update the text's font properties to match the others
      spanElement.style.setProperty('font-size', 'var(--text-body-size-medium, 0.875rem)', 'important');
      spanElement.style.setProperty('font-weight', 'var(--base-text-weight-medium, 500)', 'important');

      if (elementConfig.text.color) spanElement.style.setProperty('color', elementConfig.text.color);

      const textNode = document.createTextNode(textContent);
      spanElement.appendChild(textNode);

      inboxLink.appendChild(spanElement);
    }

    if (!elementConfig.border) {
      HEADER_STYLE.textContent += `
        ${createId(elementSelector.id)} a
        {
          border: none !important;
        }
      `;
    }

    if (elementConfig.boxShadow !== '') {
      HEADER_STYLE.textContent += `
        ${createId(elementSelector.id)} a
        {
          box-shadow: ${elementConfig.boxShadow} !important;
        }
      `;
    }

    if (elementConfig.dot.displayOverIcon) {
      HEADER_STYLE.textContent += `
        ${elementSelector.dot}
        {
          top: 5px !important;
          left: 18px !important;
        }
      `;
    }

    if (elementConfig.hoverBackgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${createId(elementSelector.id)} a:hover
        {
          background-color: ${elementConfig.hoverBackgroundColor} !important;
        }
      `;
    }

    log(DEBUG, `Updates applied to link ${configKey}: `, inboxLink);
  }

  function insertAvatarDropdown() {
    log(DEBUG, 'insertAvatarDropdown()');

    const elementSelector = SELECTORS.avatar;
    const svgSelector = elementSelector.svg;

    if (HEADER.querySelector(createId(svgSelector))) {
      log(VERBOSE, `Selector ${createId(svgSelector)} not found`);
      return;
    }

    const dropdownSvg = `
      <svg id='${svgSelector}' style="display: none;" height="100%" width="100%" fill="#FFFFFF" class="octicon octicon-triangle-down" aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true">
        <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"></path>
      </svg>
    `;

    const button = HEADER.querySelector(elementSelector.button);

    if (!button) {
      logError(`Selector '${elementSelector.button}' not found`);
      return;
    }

    const divElement = document.createElement('div');
    divElement.insertAdjacentHTML('afterbegin', dropdownSvg);

    button.appendChild(divElement);
  }

  function updateAvatar() {
    log(DEBUG, 'updateAvatar()');

    const configKey = 'avatar';

    const elementConfig = CONFIG[configKey];
    const elementSelector = SELECTORS[configKey];

    if (elementConfig.remove) {
      HEADER_STYLE.textContent += cssHideElement(elementSelector.topDiv);

      return;
    }

    if (elementConfig.size !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.img}
        {
          height: ${elementConfig.size} !important;
          width: ${elementConfig.size} !important;
        }
      `;
    }

    if (elementConfig.dropdownIcon) {
      insertAvatarDropdown();

      HEADER_STYLE.textContent += `
        ${elementSelector.topDiv}
        {
          background-color: transparent !important;
        }

        ${createId(elementSelector.svg)}
        {
          display: initial !important;
          fill: #FFFFFF;
          height: 16px;
          width: 16px;
          margin-bottom: 1.5px;
        }

        ${elementSelector.button}:hover ${createId(elementSelector.svg)} path
        {
          fill: #FFFFFFB3 !important;
        }

        ${elementSelector.button}
        {
          gap: 0px !important;
        }
      `;
    }
  }

  function flipCreateInbox() {
    log(DEBUG, 'flipCreateInbox()');

    cloneAndFlipElements(
      createId(SELECTORS.create.id),
      createId(SELECTORS.notifications.id),
      `${SELECTORS.create.id}-flip`,
      `${SELECTORS.notifications.id}-flip`,
    );
  }

  function updateGlobalBar() {
    log(DEBUG, 'updateGlobalBar()');

    const elementConfig = CONFIG.globalBar;

    if (elementConfig.boxShadowColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.globalBar}
        {
          box-shadow: inset 0 calc(var(--borderWidth-thin, 1px)*-1) ${elementConfig.boxShadowColor} !important;
        }
      `;
    }

    if (elementConfig.rightAligned.gap !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.rightAligned}
        {
          gap: ${elementConfig.rightAligned.gap} !important;
        }
      `;
    }

    if (elementConfig.leftAligned.gap !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.leftAligned}
        {
          gap: ${elementConfig.leftAligned.gap} !important;
        }
      `;
    }
  }

  function updateLocalBar() {
    log(DEBUG, 'updateLocalBar()');

    const elementConfig = CONFIG.localBar;

    if (elementConfig.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.localBar.topDiv}
        {
          background-color: ${elementConfig.backgroundColor} !important;
          box-shadow: inset 0 calc(var(--borderWidth-thin, 1px)*-1) var(--borderColor-muted) !important;
        }
      `;
    }

    if (elementConfig.alignCenter) {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.localBar.underlineNavActions}
        {
          display: contents !important;
          padding-right: 0px !important;
        }

        ${SELECTORS.header.localBar.topDiv} nav
        {
          max-width: 1280px;
          margin-right: auto;
          margin-left: auto;
        }

        @media (min-width: 768px) {
          ${SELECTORS.header.localBar.topDiv} nav
          {
            padding-right: var(--base-size-24, 24px) !important;
            padding-left: var(--base-size-24, 24px) !important;
          }
        }

        @media (min-width: 1012px) {
          ${SELECTORS.header.localBar.topDiv} nav
          {
            padding-right: var(--base-size-32, 32px) !important;
            padding-left: var(--base-size-32, 32px) !important;
          }

          .notification-shelf > div
          {
            padding-right: var(--base-size-32, 32px) !important;
            padding-left: var(--base-size-32, 32px) !important;
            max-width: 1280px;
            margin-right: auto;
            margin-left: auto;
          }
        }
      `;
    } else {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.localBar.underlineNavActions}
        {
          padding-right: var(--base-size-16, var(--base-size-16)) !important;
        }
      `;
    }

    if (elementConfig.boxShadow.consistentColor) {
      HEADER_STYLE.textContent += `
        .UnderlineNav
        {
          box-shadow: none !important;
        }
      `;
    }

    if (elementConfig.links.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.localBar.topDiv} a,
        ${SELECTORS.header.localBar.topDiv} a span
        {
          color: ${elementConfig.links.color} !important;
        }
      `;
    }
  }

  function preloadLeftSidebar(elementSelector, retryCount = 0) {
    log(DEBUG, 'preloadLeftSidebar()');
    log(DEBUG, 'retryCount', retryCount);

    if (LEFT_SIDEBAR_PRELOADED) {
      log(DEBUG, 'Left sidebar already preloaded');
      return;
    }

    const topDiv = document.querySelector(SELECTORS.sidebars.left.topDiv);
    if (!topDiv) {
      if (retryCount < 50) {
        log(DEBUG, `Selector '${SELECTORS.sidebars.left.topDiv}' not found`);
        setTimeout(() => preloadLeftSidebar(elementSelector, retryCount + 1), 100);
      } else {
        log(DEBUG, `Selector '${SELECTORS.sidebars.left.topDiv}' not found after 2 seconds, giving up`);
      }

      return;
    }
    topDiv.style.setProperty('display', 'none');

    const button = HEADER.querySelector(SELECTORS.hamburgerButton);
    if (!button) {
      if (retryCount < 50) {
        log(DEBUG, `Selector '${SELECTORS.hamburgerButton}' not found`);
        setTimeout(() => preloadLeftSidebar(elementSelector, retryCount + 1), 100);
      } else {
        log(DEBUG, `Selector '${SELECTORS.hamburgerButton}' not found after 2 seconds, giving up`);
      }

      return;
    } else {
      log(DEBUG, `Clicking selector '${SELECTORS.hamburgerButton}' to preload left sidebar`);
      button.click();
      // This click isn't reliably triggering the dialog, likely due to race conditions on page load
    }

    function waitForLeftModalDialog(waitCount = 0) {
      const leftModalDialog = topDiv.querySelector(elementSelector.left.modalDialog);
      if (!leftModalDialog) {
        if (waitCount < 10) {
          setTimeout(() => waitForLeftModalDialog(waitCount + 1), 100);
        } else {
          log(DEBUG, `Selector '${elementSelector.left.modalDialog}' not found after 2 seconds, giving up`);
          setTimeout(() => preloadLeftSidebar(elementSelector, retryCount + 1), 100);
        }
        return;
      }
      leftModalDialog.remove();
      log(INFO, 'Left sidebar preloaded');
      LEFT_SIDEBAR_PRELOADED = true;

      button.click();
      topDiv.style.removeProperty('display');
    }

    waitForLeftModalDialog();
  }

  function updateSidebars() {
    log(DEBUG, 'updateSidebars()');

    const configKey = 'sidebars';

    const elementConfig = CONFIG[configKey];
    const elementSelector = SELECTORS[configKey];

    if (elementConfig.backdrop.color !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.left.backdrop},
        ${elementSelector.right.backdrop}
        {
          background: ${CONFIG.sidebars.backdrop.color} !important;
        }
      `;
    }

    if (elementConfig.left.preload) {
      window.addEventListener('load', () => {
        log(DEBUG, 'Attempting to preload left sidebar');
        preloadLeftSidebar(elementSelector);
      });
    }

    if (elementConfig.right.floatUnderneath) {
      HEADER_STYLE.textContent += `
        body:has(${elementSelector.right.modalDialog})
        {
          overflow: scroll !important;
        }

        ${elementSelector.right.backdrop}
        {
          position: relative;
          align-items: baseline;
          width: 100vw;
          height: 100vh;
          top: 0;
          left: 0;
        }

        ${elementSelector.right.modalDialog}
        {
          pointer-events: all;
          animation: .2s cubic-bezier(.33,1,.68,1) !important;
          border-top-right-radius: 0.75rem !important;
          border-bottom-right-radius: 0.75rem !important;
        }
      `;
    }

    if (elementConfig.right.maxHeight) {
      HEADER_STYLE.textContent += `
        ${elementSelector.right.modalDialog}
        {
          max-height: ${elementConfig.right.maxHeight} !important;
        }
      `;
    }

    if (elementConfig.right.width !== '') {
      HEADER_STYLE.textContent += `
        ${elementSelector.right.modalDialog}.Overlay.Overlay--size-small-portrait
        {
          --overlay-width: ${elementConfig.right.width};
        }
      `;
    }
  }

  function importRepositoryHeader() {
    log(DEBUG, 'importRepositoryHeader()');

    const configKey = 'repositoryHeader';
    const repositoryHeader = document.querySelector(SELECTORS[configKey].id);

    if (repositoryHeader) {
      log(INFO, `Selector '${SELECTORS[configKey].id}' found`);
    } else {
      log(INFO, `Selector '${SELECTORS[configKey].id}' not found; this is expected on the Issues tab or pages that aren't repositories`);
    }

    const topRepositoryHeaderElement = document.createElement('div');
    topRepositoryHeaderElement.style.setProperty('display', 'flex');
    topRepositoryHeaderElement.style.setProperty('padding', '0px');
    topRepositoryHeaderElement.style.setProperty('box-shadow', 'none');

    const elementConfig = CONFIG[configKey];

    if (elementConfig.backgroundColor !== '') {
      topRepositoryHeaderElement.style.setProperty('background-color', elementConfig.backgroundColor);
    }

    const tempHeaderPresent = HEADER.querySelector(createId(TEMP_REPOSITORY_HEADER_FLAG));

    if (!repositoryHeader || repositoryHeader.hidden) {
      log(INFO, 'A repo tab other than Code is being loaded for the first time');

      if (tempHeaderPresent) {
        log(DEBUG, `Selector '${createId(TEMP_REPOSITORY_HEADER_FLAG)}' found; skipping header creation`);
        return;
      }
      const contextRegionCrumbs = document.querySelectorAll('context-region context-region-crumb');

      if (contextRegionCrumbs.length === 1) {
        log(INFO, 'Detected non-repository page; skipping header creation');
        return;
      }

      // Perhaps check these in the future...
      // const userCardPresent = HEADER.querySelector('[data-hovercard-type="user"]');
      // const organizationCardPresent = HEADER.querySelector('[data-hovercard-type="organization"]');

      log(DEBUG, `Selector '${SELECTORS[configKey].id}' is not present or hidden`);

      if (!HEADER.querySelector(SELECTORS.pageTitle.separator)) {
        log(DEBUG, `Selector '${SELECTORS.pageTitle.separator}' not found, not creating a repository header`);

        return;
      }

      const pageTitle = HEADER.querySelector(SELECTORS.pageTitle.topDiv);

      if (!pageTitle) {
        logError(`Selector '${SELECTORS.pageTitle.topDiv}' not found`);
        return;
      }

      const repositoryHeaderElement = document.createElement('div');
      repositoryHeaderElement.setAttribute('id', TEMP_REPOSITORY_HEADER_FLAG);
      repositoryHeaderElement.classList.add(REPOSITORY_HEADER_CLASS, 'pt-3', 'mb-2', 'px-md-4');

      const clonedPageTitle = pageTitle.cloneNode(true);
      repositoryHeaderElement.appendChild(clonedPageTitle);

      topRepositoryHeaderElement.appendChild(repositoryHeaderElement);
      insertNewGlobalBar(topRepositoryHeaderElement);
    } else if (tempHeaderPresent) {
      log(DEBUG, `Selector '${createId(TEMP_REPOSITORY_HEADER_FLAG)}' found`);
      log(INFO, 'The Code tab is being loaded from another tab which has a temporary header');

      const tempRepositoryHeader = HEADER.querySelector(createId(TEMP_REPOSITORY_HEADER_FLAG));

      NEW_ELEMENTS = NEW_ELEMENTS.filter(element => element !== tempRepositoryHeader);
      tempRepositoryHeader.remove();

      insertPermanentRepositoryHeader(topRepositoryHeaderElement, repositoryHeader);
    } else {
      log(
        DEBUG,
        `'${SELECTORS[configKey].id}' is hidden and selector '${createId(TEMP_REPOSITORY_HEADER_FLAG)}' not found`,
      );
      log(INFO, 'The Code tab being loaded for the first time');

      insertPermanentRepositoryHeader(topRepositoryHeaderElement, repositoryHeader);
    }

    HEADER_STYLE.textContent += `
      ${SELECTORS.repositoryHeader.nav} context-region
      {
        display: flex !important;
      }

      ${SELECTORS.repositoryHeader.nav} context-region context-region-crumb
      {
        display: flex !important;
        align-items: center !important;
      }

      ${SELECTORS.repositoryHeader.nav} context-region-crumb:last-child context-region-divider
      {
        display: none !important;
      }

      #repo-title-component:has(> img[alt$="avatar"]) .AppHeader-context-item-label .avatar,
      #repo-title-component:has(> img[alt$="avatar"]) .AppHeader-context-item-label .avatar-user
      {
        display: none !important;
      }
    `;

    updateRepositoryHeaderName();

    if (elementConfig.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        .${REPOSITORY_HEADER_CLASS},
        .notification-shelf
        {
          background-color: ${elementConfig.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.alignCenter) {
      HEADER_STYLE.textContent += `
        .${REPOSITORY_HEADER_CLASS}
        {
          max-width: 1280px;
          margin-right: auto;
          margin-left: auto;
        }

        .${REPOSITORY_HEADER_CLASS} .rgh-ci-link
        {
          align-items: center;
          display: flex !important;
          margin-right: var(--base-size-24, 24px);
        }

        .${REPOSITORY_HEADER_CLASS} .rgh-ci-link summary
        {
          display: flex;
        }

        .${REPOSITORY_HEADER_CLASS} .commit-build-statuses
        {
          position: absolute;
        }

        @media (min-width: 768px) {
          .${REPOSITORY_HEADER_CLASS}
          {
            padding-right: var(--base-size-24, 24px) !important;
            padding-left: var(--base-size-24, 24px) !important;
          }
        }

        @media (min-width: 1012px) {
          .${REPOSITORY_HEADER_CLASS}
          {
            padding-right: var(--base-size-32, 32px) !important;
            padding-left: var(--base-size-32, 32px) !important;
          }
        }
      `;
    }

    if (elementConfig.link.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.repositoryHeader.links}
        {
          color: ${elementConfig.link.color} !important;
        }
      `;
    }

    if (elementConfig.link.hover.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.repositoryHeader.links}:hover
        {
          color: ${elementConfig.link.hover.color} !important;
        }
      `;
    }

    if (elementConfig.link.hover.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.repositoryHeader.links}:hover
        {
          background-color: ${elementConfig.link.hover.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.link.hover.textDecoration !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.repositoryHeader.links}:hover
        {
          text-decoration: ${elementConfig.link.hover.textDecoration} !important;
        }
      `;
    }

    HEADER_STYLE.textContent += `
      .${REPOSITORY_HEADER_CLASS}
      {
        flex: auto !important;
      }

      ${SELECTORS.repositoryHeader.details}
      {
        display: flex;
        align-items: center;
      }

      ${SELECTORS.pageTitle.topDiv}
      {
        flex: 0 1 auto !important;
        height: auto !important;
        min-width: 0 !important;
      }

      .AppHeader-context .AppHeader-context-compact
      {
        display: none !important;
      }

      .AppHeader-context .AppHeader-context-full
      {
        display: inline-flex !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }

      .AppHeader-context .AppHeader-context-full ul
      {
        display: flex;
        flex-direction: row;
      }

      .AppHeader-context .AppHeader-context-full li:first-child
      {
        flex: 0 100 max-content;
      }

      .AppHeader-context .AppHeader-context-full li
      {
        display: inline-grid;
        grid-auto-flow: column;
        align-items: center;
        flex: 0 99999 auto;
      }

      .AppHeader-context .AppHeader-context-full ul,
      .AppHeader .AppHeader-globalBar .AppHeader-context .AppHeader-context-full li
      {
        list-style: none;
      }

      .AppHeader-context .AppHeader-context-item
      {
        display: flex;
        align-items: center;
        min-width: 3ch;
        line-height: var(--text-body-lineHeight-medium, 1.4285714286);
        text-decoration: none !important;
        border-radius: var(--borderRadius-medium, 6px);
        padding-inline: var(--control-medium-paddingInline-condensed, 8px);
        padding-block: var(--control-medium-paddingBlock, 6px);
      }

      .AppHeader-context .AppHeader-context-full li:last-child .AppHeader-context-item
      {
        font-weight: var(--base-text-weight-semibold, 600);
      }

      .AppHeader-context .AppHeader-context-item-separator
      {
        color: var(--fgColor-muted, var(--color-fg-muted));
        white-space: nowrap;
        height: 16px;
        display: block;
      }

      .AppHeader-context .AppHeader-context-item-separator svg
      {
        display: block;
      }

      ${SELECTORS.header.globalBar}
      {
        padding: 16px !important;
      }
    `;

    if (elementConfig.removePageTitle) removePageTitle();

    return true;
  }

  function insertPermanentRepositoryHeader(topRepositoryHeaderElement, repositoryHeader) {
    log(DEBUG, 'insertPermanentRepositoryHeader()');

    const clonedRepositoryHeader = repositoryHeader.cloneNode(true);

    // This is needed to prevent pop-in via Turbo when navigating between tabs on a repo
    repositoryHeader.removeAttribute('data-turbo-replace');
    clonedRepositoryHeader.removeAttribute('data-turbo-replace');

    repositoryHeader.style.setProperty('display', 'none', 'important');

    clonedRepositoryHeader.classList.add(REPOSITORY_HEADER_SUCCESS_FLAG, REPOSITORY_HEADER_CLASS);

    topRepositoryHeaderElement.appendChild(clonedRepositoryHeader);

    insertNewGlobalBar(topRepositoryHeaderElement);

    clonedRepositoryHeader.firstElementChild.classList.remove('container-xl', 'px-lg-5', 'px-3');
    topRepositoryHeaderElement.style.setProperty('padding', '0 var(--base-size-16, var(--base-size-16))', 'important');

    NEW_ELEMENTS.push(clonedRepositoryHeader);
  }

  function updateRepositoryHeaderName() {
    log(DEBUG, 'updateRepositoryHeaderName()');

    const elementConfig = CONFIG.repositoryHeader;

    const name = document.querySelector(SELECTORS.repositoryHeader.name);

    if (!name) {
      // When not in a repo, this is expected
      log(DEBUG, `Selector '${SELECTORS.repositoryHeader.name}' not found`);
      return;
    }

    name.style.setProperty('display', 'none', 'important');

    const pageTitle = HEADER.querySelector(SELECTORS.pageTitle.topDiv);

    if (!pageTitle) {
      logError(`Selector '${SELECTORS.pageTitle.topDiv}' not found`);
      return;
    }

    const ownerImg = document.querySelector(SELECTORS.repositoryHeader.ownerImg);

    if (!ownerImg) {
      log(INFO, `Selector '${SELECTORS.repositoryHeader.ownerImg}' not found`);
      return;
    }

    const clonedPageTitle = pageTitle.cloneNode(true);
    clonedPageTitle.style.display = '';

    const pageTitleId = `${REPOSITORY_HEADER_CLASS}_pageTitle`;
    clonedPageTitle.setAttribute('id', pageTitleId);
    clonedPageTitle.querySelector('img')?.remove();

    HEADER_STYLE.textContent += `
      ${createId(pageTitleId)}
      {
        display: initial !important;
      }
    `;

    clonedPageTitle.querySelectorAll('svg.octicon-lock').forEach(svg => svg.remove());
    clonedPageTitle.querySelectorAll('a[href$="/stargazers"]').forEach(link => link.remove());

    ownerImg.parentNode.insertBefore(clonedPageTitle, ownerImg.nextSibling);
    NEW_ELEMENTS.push(clonedPageTitle);

    if (elementConfig.avatar.remove) {
      ownerImg.remove();
    } else if (elementConfig.avatar.customSvg !== '') {
      if (isValidURL(elementConfig.avatar.customSvg)) {
        ownerImg.src = elementConfig.avatar.customSvg;
      } else {
        const divElement = document.createElement('div');
        divElement.style.setProperty('display', 'flex');
        divElement.style.setProperty('align-items', 'center');

        divElement.innerHTML = elementConfig.avatar.customSvg;

        ownerImg.parentNode.replaceChild(divElement, ownerImg);
      }
    }

    HEADER_STYLE.textContent += cssHideElement(SELECTORS.repositoryHeader.bottomBorder);
  }

  function cloneAndLeftAlignElement(elementSelector, elementId) {
    log(DEBUG, 'cloneAndLeftAlignElement()');

    const leftAlignedDiv = HEADER.querySelector(SELECTORS.header.leftAligned);

    if (!leftAlignedDiv) {
      logError(`Selector '${SELECTORS.header.leftAligned}' not found`);
      return [];
    }

    const element = HEADER.querySelector(elementSelector);

    if (!element) {
      logError(`Selector '${elementSelector}' not found`);
      return [];
    }

    const elementClone = element.cloneNode(true);
    const elementCloneId = `${elementId}-clone`;

    elementClone.setAttribute('id', elementCloneId);

    elementClone.style.setProperty('display', 'none');

    HEADER_STYLE.textContent += cssHideElement(elementSelector);

    HEADER_STYLE.textContent += `
      ${createId(elementCloneId)}
      {
        display: flex !important;
      }
    `;

    leftAlignedDiv.appendChild(elementClone);

    NEW_ELEMENTS.push(elementClone);

    return [elementCloneId, elementClone];
  }

  function insertNewGlobalBar(element) {
    log(DEBUG, 'insertNewGlobalBar()');

    modifyThenObserve(() => {
      const elementToInsertAfter = HEADER.querySelector(SELECTORS.header.globalBar);
      elementToInsertAfter.parentNode.insertBefore(element, elementToInsertAfter.nextSibling);
    });
  }

  function createId(string) {
    log(TRACE, 'createId()');

    if (string.startsWith('#')) return string;

    if (string.startsWith('.')) {
      logError(`Attempted to create an id from a class: "${string}"`);
      return;
    }

    if (string.startsWith('[')) {
      logError(`Attempted to create an id from an attribute selector: "${string}"`);
      return;
    }

    return `#${string}`;
  }

  function cssHideElement(elementSelector) {
    log(TRACE, 'cssHideElement()');

    return `
      ${elementSelector}
      {
        display: none !important;
      }
    `;
  }

  function isValidURL(string) {
    log(DEBUG, 'isValidURL()');

    const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/i;
    return urlPattern.test(string);
  }

  function escapeRegExp(string) {
    log(DEBUG, 'escapeRegExp()');

    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function compareObjects(firstObject, secondObject, firstName, secondName) {
    log(DEBUG, 'compareObjects()');

    if (typeof firstObject !== 'object' || typeof secondObject !== 'object') {
      return 'Invalid input. Please provide valid objects.';
    }

    const differences = [];

    function findKeyDifferences(obj1, obj2, path = '') {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      keys1.forEach(key => {
        const nestedPath = path ? `${path}.${key}` : key;
        if (!keys2.includes(key)) {
          differences.push(`Found "${nestedPath}" in ${firstName} but not in ${secondName}`);
        } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
          findKeyDifferences(obj1[key], obj2[key], nestedPath);
        }
      });

      keys2.forEach(key => {
        const nestedPath = path ? `${path}.${key}` : key;
        if (!keys1.includes(key)) {
          differences.push(`Found "${nestedPath}" in ${secondName} but not in ${firstName}`);
        }
      });
    }

    findKeyDifferences(firstObject, secondObject);
    return differences.length > 0 ? differences : [];
  }

  // eslint-disable-next-line no-unused-vars
  function checkConfigConsistency(configs) {
    log(DEBUG, 'checkConfigConsistency()');

    const lightDarkDifference = compareObjects(
      configs.happyMedium.light,
      configs.happyMedium.dark,
      'Happy Medium Light',
      'Happy Medium Dark',
    );

    if (lightDarkDifference.length > 0) {
      logError('lightDarkDifference', lightDarkDifference);

      return false;
    }

    const typeDifference = compareObjects(
      configs.happyMedium,
      configs.oldSchool,
      'Happy Medium',
      'Old School',
    );

    if (typeDifference.length > 0) {
      logError('typeDifference', typeDifference);

      return false;
    }

    return true;
  }

  function updateSelectors() {
    log(DEBUG, 'updateSelectors()');

    const toolTips = Array.from(HEADER.querySelectorAll('tool-tip'));
    SELECTORS.toolTips = {
      copilot: toolTips.find(
        tooltip => tooltip.getAttribute('for') === 'copilot-chat-header-button',
      ),
      create: toolTips.find(
        tooltip => tooltip.textContent.includes('Create new'),
      ),
      pullRequests: toolTips.find(
        tooltip => tooltip.textContent.includes('Your pull requests'),
      ),
      issues: toolTips.find(
        tooltip => tooltip.textContent.includes('Your issues'),
      ),
      notifications: toolTips.find(
        tooltip => tooltip.getAttribute('data-target') === 'notification-indicator.tooltip',
      ),
    };
  }

  function addMenuItemToActionList(_event, retryCount = 0) {
    log(VERBOSE, 'addMenuItemToActionList()');
    log(VERBOSE, 'retryCount', retryCount);

    const liElementId = 'custom-global-navigation-menu-item';

    if (document.querySelector(createId(liElementId))) {
      log(DEBUG, 'Menu item already exists, skipping addition');
      return;
    }

    const actionList = document.querySelector(SELECTORS.sidebars.right.actionList);
    if (!actionList) {
      if (retryCount < 20) {
        log(DEBUG, 'Action list not found, retrying...');
        return setTimeout(() => addMenuItemToActionList(retryCount + 1), 100);
      } else {
        logError('Action list not found after 2 seconds, giving up');
        return;
      }
    }

    const signOutLink = actionList.querySelector(SELECTORS.sidebars.right.signOutLink);
    if (!signOutLink) {
      if (retryCount < 20) {
        log(DEBUG, 'Logout link not found, retrying...');
        return setTimeout(() => addMenuItemToActionList(retryCount + 1), 100);
      } else {
        logError('Logout link not found after 2 seconds, giving up');
        return;
      }
    }

    const signOutLi = signOutLink.parentNode;

    const newLiElement = signOutLi.cloneNode(true);
    newLiElement.setAttribute('id', liElementId);
    newLiElement.querySelector('a').removeAttribute('href');

    newLiElement.onclick = () => {
      const closeButton = document.querySelector(SELECTORS.sidebars.right.closeButton);
      if (!closeButton) {
        logError(`Selector '${SELECTORS.sidebars.right.closeButton}' not found`);
      } else {
        closeButton.click();
      }

      GMC.open();
    };

    const textElement = newLiElement.querySelector('a > [class^="prc-ActionList-ActionListSubContent-"]');
    textElement.textContent = gmcGet('menu_item_title');

    const oldSvg = newLiElement.querySelector('svg');

    const menuItemIcon = gmcGet('menu_item_icon');
    if (menuItemIcon === 'logo') {
      const newSvg = document.createElement('img');
      newSvg.setAttribute('height', '16px');
      newSvg.setAttribute('width', '16px');
      newSvg.src = `https://raw.githubusercontent.com/blakegearin/github-custom-global-navigation/main/img/${THEME}_logo.svg`;

      oldSvg.parentNode.replaceChild(newSvg, oldSvg);
    } else {
      let svgString;

      if (menuItemIcon === 'cog') {
        svgString = `
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-gear">
            <path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path>
          </svg>
        `;
      } else if (menuItemIcon === 'compass') {
        svgString = `
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm306.7 69.1L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
          </svg>
        `;
      }

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
      const newSvg = svgDoc.documentElement;

      oldSvg.parentNode.replaceChild(newSvg, oldSvg);
    }

    const divider = signOutLi.parentNode.querySelector(SELECTORS.sidebars.right.divider);
    if (!divider) {
      logError(`Selector '${SELECTORS.sidebars.right.divider}' not found`);
      return;
    }
    const newDivider = divider.cloneNode(true);

    actionList.insertBefore(newLiElement, signOutLi);
    actionList.insertBefore(newDivider, signOutLi);
  }

  function generateCustomConfig() {
    log(DEBUG, 'generateCustomConfig()');

    const customConfig = {
      light: {},
      dark: {},
    };

    function recursivelyGenerateCustomConfig(obj, customObj, themePrefix, parentKey = '') {
      for (const key in obj) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === 'object') {
          customObj[key] = {};
          recursivelyGenerateCustomConfig(obj[key], customObj[key], themePrefix, currentKey);
        } else {
          const gmcKey = `${themePrefix}_${currentKey.replace(/\./g, '_')}`;

          if (gmcKey in GMC.fields) {
            customObj[key] = gmcGet(gmcKey);
          } else {
            logError(`GMC field not found for key: ${gmcKey}`);
            return;
          }
        }
      }
    }

    recursivelyGenerateCustomConfig(configs.happyMedium.light, customConfig.light, 'light');
    recursivelyGenerateCustomConfig(configs.happyMedium.dark, customConfig.dark, 'dark');

    return customConfig;
  }

  function setTheme() {
    log(DEBUG, 'setTheme()');

    const dataColorMode = document.querySelector('html').getAttribute('data-color-mode');

    if (dataColorMode === 'auto') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        THEME = 'dark';
      }
    } else if (dataColorMode === 'dark') {
      THEME = 'dark';
    } else if (dataColorMode !== 'light')  {
      logError('Unknown color mode');
    }

    log(VERBOSE, `THEME: ${THEME}`);
  }

  function gmcInitialized() {
    log(DEBUG, 'gmcInitialized()');

    updateLogLevel();

    log(QUIET, 'Running');

    GMC.css.basic = '';

    startObserving();
  }

  function gmcAddSavedSpan(div) {
    log(DEBUG, 'gmcAddSavedSpan()');

    const savedDiv = document.createElement('div');
    savedDiv.setAttribute('id', 'gmc-saved');

    const iconSpan = document.createElement('span');
    iconSpan.style = 'margin-right: 4px;';

    iconSpan.innerHTML = `
      <svg aria-hidden="true" focusable="false" role="img" class="octicon octicon-check-circle-fill" viewBox="0 0 12 12" width="12" height="12" fill="currentColor" style="display: inline-block;user-select: none;vertical-align: text-bottom;">
        <path d="M6 0a6 6 0 1 1 0 12A6 6 0 0 1 6 0Zm-.705 8.737L9.63 4.403 8.392 3.166 5.295 6.263l-1.7-1.702L2.356 5.8l2.938 2.938Z"></path>
      </svg>
    `;

    const textSpan = document.createElement('span');
    textSpan.innerText = 'Saved';

    savedDiv.appendChild(iconSpan);
    savedDiv.appendChild(textSpan);

    div.insertBefore(savedDiv, div.firstChild);
  }

  function gmcAddNewIssueButton(div) {
    log(DEBUG, 'gmcAddNewIssueButton()');

    const small = document.createElement('small');
    small.classList.add('left-aligned');
    small.setAttribute('title', 'Submit bug or feature request');

    const link = document.createElement('a');
    link.href = 'https://github.com/blakegearin/github-custom-global-navigation/issues';
    link.innerText = 'submit bug or feature request';

    small.appendChild(link);

    div.insertBefore(small, div.firstChild);
  }

  function gmcOpened() {
    log(DEBUG, 'gmcOpened()');

    function updateCheckboxes() {
      log(DEBUG, 'updateCheckboxes()');

      const checkboxes = document.querySelectorAll('#gmc-frame input[type="checkbox"]');

      if (checkboxes.length > 0) {
        checkboxes.forEach(checkbox => {
          checkbox.classList.add('gmc-checkbox');
        });
      } else {
        setTimeout(updateCheckboxes, 100);
      }
    }

    updateCheckboxes();

    const configVars = document.querySelectorAll('.config_var');

    configVars.forEach(configVar => {
      const label = configVar.querySelector('.field_label');
      const input = configVar.querySelector('input');

      if (label && input && input.type === 'text') label.style.lineHeight = '33px';

      const select = configVar.querySelector('select');

      if (label && select) label.style.lineHeight = '33px';
    });

    modifyThenObserve(() => {
      document.querySelector('#gmc-frame .reset_holder').remove();

      const buttonHolderSelector = '#gmc-frame_buttons_holder';
      const parentDiv = document.querySelector(buttonHolderSelector);

      if (!parentDiv) {
        logError(`Selector ${buttonHolderSelector} not found`);
        return;
      }

      gmcAddSavedSpan(parentDiv);
      gmcAddNewIssueButton(parentDiv);
    });

    document.querySelector('#gmc').classList.remove('hidden');
  }

  function gmcRefreshTab() {
    location.reload();
  }

  function gmcRunScript() {
    applyCustomizations(true);
  }

  function gmcGet(key) {
    log(DEBUG, 'gmcGet()');

    try {
      return GMC.get(key);
    } catch (error) {
      logError(`Error setting GMC, key=${key}`, error);
    }
  }

  function gmcSet(key, value) {
    log(DEBUG, 'gmcSet()');

    try {
      return GMC.set(key, value);
    } catch (error) {
      logError(`Error setting GMC, key=${key}, value=${value}`, error);
    }
  }

  function gmcSave() {
    log(DEBUG, 'gmcSave()');

    try {
      return gmcSave();
    } catch (error) {
      logError('Error saving GMC', error);
    }
  }

  function updateLogLevel() {
    CURRENT_LOG_LEVEL = LOG_LEVELS.getValue(gmcGet('log_level'));

    if (LOG_LEVEL_OVERRIDE) CURRENT_LOG_LEVEL = LOG_LEVEL_OVERRIDE;
  }

  function gmcSaved() {
    log(DEBUG, 'gmcSaved()');

    const gmcSaved = document.getElementById('gmc-saved');

    gmcSaved.style.display = 'block';

    setTimeout(
      () => gmcSaved.style.display = 'none',
      2750,
    );

    updateLogLevel();

    switch (gmcGet('on_save')) {
      case 'refresh tab':
        gmcRefreshTab();
        break;
      case 'refresh tab and close':
        gmcRefreshTab();
        GMC.close();
        break;
      case 'run script':
        gmcRunScript();
        break;
      case 'run script and close':
        gmcRunScript();
        GMC.close();
        break;
    }
  }

  function gmcClosed() {
    log(DEBUG, 'gmcClosed()');

    switch (gmcGet('on_close')) {
      case 'refresh tab':
        gmcRefreshTab();
        break;
      case 'run script':
        gmcRunScript();
        break;
    }

    document.querySelector('#gmc').classList.add('hidden');
  }

  function gmcClearCustom() {
    log(DEBUG, 'gmcClearCustom()');

    const confirmed = confirm('Are you sure you want to clear your custom configuration? This is irreversible.');

    if (confirmed) {
      const currentType = gmcGet('type');
      GMC.reset();
      gmcSave();

      gmcSet('type', currentType);
      gmcSave();
    }
  }

  function configsToGMC(config, path = []) {
    log(DEBUG, 'configsToGMC()');

    for (const key in config) {
      if (typeof config[key] === 'object' && !Array.isArray(config[key])) {
        configsToGMC(config[key], path.concat(key));
      } else {
        const fieldName = path.concat(key).join('_');
        const fieldValue = config[key];

        log(VERBOSE, 'fieldName', fieldName);
        gmcSet(fieldName, fieldValue);
      }
    }
  }

  function gmcApplyCustomHappyMediumConfig() {
    log(DEBUG, 'gmcApplyCustomHappyMediumConfig()');

    const confirmed = confirm('Are you sure you want to overwrite your custom configuration with Happy Medium? This is irreversible.');

    if (confirmed) {
      configsToGMC(configs.happyMedium);
      gmcSave();
    }
  }

  function gmcApplyCustomOldSchoolConfig() {
    log(DEBUG, 'gmcApplyCustomOldSchoolConfig()');

    const confirmed = confirm('Are you sure you want to overwrite your custom configuration with Old School? This is irreversible.');

    if (confirmed) {
      configsToGMC(configs.oldSchool);
      gmcSave();
    }
  }

  function gmcBuildStyle() {
    log(DEBUG, 'gmcBuildStyle()');

    const headerIdPartials = [
      'hamburgerButton_remove_var',
      'logo_remove_var',
      'pageTitle_remove_var',
      'search_remove_var',
      'divider_remove_var',
      'create_remove_var',
      'issues_remove_var',
      'pullRequests_remove_var',
      'marketplace_add_var',
      'explore_add_var',
      'notifications_remove_var',
      'light_avatar_remove_var',
      'dark_avatar_remove_var',
      'globalBar_boxShadowColor_var',
      'localBar_backgroundColor_var',
      'sidebars_backdrop_color_var',
      'repositoryHeader_import_var',
      'flipCreateInbox_var',
      'flipIssuesPullRequests_var',
    ];

    const sectionSelectors = headerIdPartials
      .map(varName => `#gmc-frame .config_var[id*='${varName}']`)
      .join(',\n');

    const gmcFrameStyle = document.createElement('style');
    gmcFrameStyle.textContent += `
      /* Modal */

      #gmc
      {
        display: inline-flex !important;
        justify-content: center !important;
        align-items: center !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999;
        background: none !important;

        pointer-events: none;
      }

      #gmc.hidden
      {
        display: none !important;
      }

      #gmc-frame
      {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
        text-align: left;

        inset: initial !important;
        border: none !important;
        max-height: initial !important;
        max-width: initial !important;
        opacity: 1 !important;
        position: static !important;
        z-index: initial !important;

        width: 85% !important;
        height: 75% !important;
        overflow-y: auto !important;

        border: none !important;
        border-radius: 0.375rem !important;

        pointer-events: auto;
      }

      #gmc-frame_wrapper
      {
        display: flow-root !important;
        padding: 2rem !important;
      }

      /* Sections */

      #gmc-frame #gmc-frame_section_0
      {
        width: 100%;
        border-radius: 6px;
        display: table;
      }

      #gmc-frame #gmc-frame_section_1,
      #gmc-frame #gmc-frame_section_2,
      #gmc-frame #gmc-frame_section_3,
      #gmc-frame #gmc-frame_section_4
      {
        margin-top: 2rem;
        width: 49%;
        box-sizing: border-box;
      }

      #gmc-frame #gmc-frame_section_1
      {
        border-radius: 6px;
        float: left;
      }

      #gmc-frame #gmc-frame_section_2
      {
        border-radius: 6px;
        float: right;
      }

      #gmc-frame #gmc-frame_section_3
      {
        width: 49%;
        margin-top: 2rem;
        box-sizing: border-box;
        border-radius: 6px;
        float: left;
      }

      #gmc-frame #gmc-frame_section_4
      {
        display: inline-grid;
        width: 49%;
        margin-top: 2rem;
        box-sizing: border-box;
        border-radius: 6px;
        float: right
      }

      #gmc-frame #gmc-frame_section_3 .config_var:not(:last-child),
      #gmc-frame #gmc-frame_section_4 .config_var:not(:last-child)
      {
        padding-bottom: 1rem;
      }

      /* Fields */

      #gmc-frame .config_header
      {
        font-size: 2em;
        font-weight: 400;
        line-height: 1.25;

        padding-bottom: 0.3em;
        margin-bottom: 16px;
      }

      #gmc-frame #gmc-frame_type_var
      {
        display: inline-flex;
      }

      #gmc-frame .section_header
      {
        font-size: 1.5em;
        font-weight: 600;
        line-height: 1.25;

        margin-bottom: 16px;
        padding: 1rem 1.5rem;
      }

      #gmc-frame .section_desc,
      #gmc-frame h3
      {
        background: none;
        border: none;
        font-size: 1.25em;

        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
        text-align: left;
      }

      #gmc-frame .config_var
      {
        padding: 0rem 1.5rem;
        margin-bottom: 1rem;
        display: flex;
      }

      ${sectionSelectors}
      {
        display: flow;
        padding-top: 1rem;
      }

      #gmc-frame .config_var[id*='flipCreateInbox_var'],
      #gmc-frame .config_var[id*='flipIssuesPullRequests_var']
      {
        display: flex;
      }

      #gmc-frame .field_label
      {
        font-weight: 600;
        margin-right: 0.5rem;
      }

      #gmc-frame .field_label,
      #gmc-frame .gmc-label
      {
        width: 15vw;
      }

      #gmc-frame .radio_label:not(:last-child)
      {
        margin-right: 4rem;
      }

      #gmc-frame .radio_label
      {
        line-height: 17px;
      }

      #gmc-frame .gmc-label
      {
        display: table-caption;
        line-height: 17px;
      }

      #gmc-frame input[type="radio"]
      {
        appearance: none;
        border-style: solid;
        cursor: pointer;
        height: 1rem;
        place-content: center;
        position: relative;
        width: 1rem;
        border-radius: 624rem;
        transition: background-color 0s ease 0s, border-color 80ms cubic-bezier(0.33, 1, 0.68, 1) 0s;
        margin-right: 0.5rem;
        flex: none;
      }

      #gmc-frame input[type="checkbox"]
      {
        appearance: none;
        border-style: solid;
        border-width: 1px;
        cursor: pointer;
        place-content: center;
        position: relative;
        height: 17px;
        width: 17px;
        border-radius: 3px;
        transition: background-color 0s ease 0s, border-color 80ms cubic-bezier(0.33, 1, 0.68, 1) 0s;
      }

      #gmc-frame #gmc-frame_field_type
      {
        display: flex;
      }

      #gmc-frame input[type="radio"]:checked
      {
        border-width: 0.25rem;
      }

      #gmc-frame input[type="radio"]:checked,
      #gmc-frame .gmc-checkbox:checked
      {
        border-color: #2f81f7;
      }

      #gmc-frame .gmc-checkbox:checked
      {
        background-color: #2f81f7;
      }

      #gmc-frame .gmc-checkbox:checked::before
      {
        visibility: visible;
        transition: visibility 0s linear 0s;
      }

      #gmc-frame .gmc-checkbox::before,
      #gmc-frame .gmc-checkbox:indeterminate::before
      {
        animation: 80ms cubic-bezier(0.65, 0, 0.35, 1) 80ms 1 normal forwards running checkmarkIn;
      }

      #gmc-frame .gmc-checkbox::before
      {
        width: 1rem;
        height: 1rem;
        visibility: hidden;
        content: "";
        background-color: #FFFFFF;
        clip-path: inset(1rem 0 0 0);
        -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNzgwMyAwLjIxOTYyNUMxMS45MjEgMC4zNjA0MjcgMTIgMC41NTEzMDUgMTIgMC43NTAzMTNDMTIgMC45NDkzMjEgMTEuOTIxIDEuMTQwMTkgMTEuNzgwMyAxLjI4MUw0LjUxODYgOC41NDA0MkM0LjM3Nzc1IDguNjgxIDQuMTg2ODIgOC43NiAzLjk4Nzc0IDguNzZDMy43ODg2NyA4Ljc2IDMuNTk3NzMgOC42ODEgMy40NTY4OSA4LjU0MDQyTDAuMjAxNjIyIDUuMjg2MkMwLjA2ODkyNzcgNS4xNDM4MyAtMC4wMDMzMDkwNSA0Ljk1NTU1IDAuMDAwMTE2NDkzIDQuNzYwOThDMC4wMDM1NTIwNSA0LjU2NjQzIDAuMDgyMzg5NCA0LjM4MDgxIDAuMjIwMDMyIDQuMjQzMjFDMC4zNTc2NjUgNC4xMDU2MiAwLjU0MzM1NSA0LjAyNjgxIDAuNzM3OTcgNC4wMjMzOEMwLjkzMjU4NCA0LjAxOTk0IDEuMTIwOTMgNC4wOTIxNyAxLjI2MzM0IDQuMjI0ODJMMy45ODc3NCA2Ljk0ODM1TDEwLjcxODYgMC4yMTk2MjVDMTAuODU5NSAwLjA3ODk5MjMgMTEuMDUwNCAwIDExLjI0OTUgMEMxMS40NDg1IDAgMTEuNjM5NSAwLjA3ODk5MjMgMTEuNzgwMyAwLjIxOTYyNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
        -webkit-mask-size: 75%;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center center;
        display: block;
      }

      #gmc-frame .gmc-checkbox
      {
        appearance: none;
        border-style: solid;
        border-width: 1px;
        cursor: pointer;

        height: var(--base-size-16,16px);
        margin: 0.125rem 0px 0px;
        place-content: center;
        position: relative;
        width: var(--base-size-16,16px);
        border-radius: 3px;
        transition: background-color 0s ease 0s, border-color 80ms cubic-bezier(0.33, 1, 0.68, 1) 0s;
      }

      #gmc-frame input
      {
        color: fieldtext;
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: start;
        appearance: auto;
        -webkit-rtl-ordering: logical;
      }

      #gmc-frame .gmc-checkbox:checked
      {
        transition: background-color 0s ease 0s, border-color 80ms cubic-bezier(0.32, 0, 0.67, 0) 0ms;
      }

      #gmc-frame input[type="text"],
      #gmc-frame textarea,
      #gmc-frame select
      {
        padding: 5px 12px;
        border-radius: 6px;
      }

      #gmc-frame input[type="text"]:focus,
      #gmc-frame textarea:focus,
      #gmc-frame select:focus
      {
        border-color: #2f81f7;
        outline: 1px solid #2f81f7;
      }

      #gmc-frame svg
      {
        height: 17px;
        width: 17px;
        margin-left: 0.5rem;
      }

      #gmc small
      {
        font-size: x-small;
        font-weight: 600;
        margin-left: 3px;
      }

      /* Button bar */

      #gmc-frame #gmc-frame_buttons_holder
      {
        position: fixed;
        width: 85%;
        text-align: right;

        left: 50%;
        bottom: 2%;
        transform: translate(-50%, 0%);
        padding: 1rem;

        border-radius: 0.375rem;

        display: flex;
        align-items: center;
      }

      #gmc-frame #gmc-frame_buttons_holder .left-aligned
      {
        order: 1;
        margin-right: auto;
      }

      #gmc-frame #gmc-frame_buttons_holder > *
      {
        order: 2;
      }

      #gmc-frame .saveclose_buttons
      {
        margin-left: 0.5rem;
      }

      #gmc-frame [type=button],
      #gmc-frame .saveclose_buttons
      {
        position: relative;
        display: inline-block;
        padding: 5px 16px;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;
        border: 1px solid;
        border-radius: 6px;
        -webkit-appearance: none;
        appearance: none;

        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
      }

      @keyframes fadeOut
      {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      #gmc-saved
      {
        display: none;
        margin-right: 10px;
        animation: fadeOut 0.75s ease 2s forwards;
      }
    `;

    if (THEME === 'light') {
      gmcFrameStyle.textContent += `
        #gmc-frame
        {
          background-color: #F6F8FA;
          color: #1F2328;
          box-shadow: 0 0 0 1px #D0D7DE, 0 16px 32px rgba(1,4,9,0.2) !important;
        }

        #gmc-frame .section_header_holder
        {
          background-color: #FFFFFF;
          border: 1px solid #D0D7DE;
        }

        #gmc-frame_buttons_holder
        {
          background-color: #FFFFFF;
          box-shadow: 0 0 0 1px #D0D7DE, 0 16px 32px rgba(1,4,9,0.2) !important;
        }

        #gmc-frame input[type="text"],
        #gmc-frame textarea,
        #gmc-frame select
        {
          border: 1px solid #D0D7DE;
        }

        #gmc-frame select
        {
          background-color: #F6F8FA;
        }

        #gmc-frame select:hover
        {
          background-color: #F3F4F6;
          border-color: #1F232826;
        }

        #gmc-frame input[type="text"],
        #gmc-frame textarea
        {
          background-color: #F6F8FA;
          color: #1F2328;
        }

        #gmc-frame input[type="text"]:focus,
        #gmc-frame textarea:focus
        {
          background-color: #FFFFFF;
        }

        #gmc-frame [type=button],
        #gmc-frame .saveclose_buttons
        {
          background-color: #f6f8fa;
          border-color: #1f232826;
          box-shadow: 0 1px 0 rgba(31,35,40,0.04), inset 0 1px 0 rgba(255,255,255,0.25);
          color: #24292f;
        }

        #gmc-frame [type=button]:hover,
        #gmc-frame .saveclose_buttons:hover
        {
          background-color: #f3f4f6;
          border-color: #1f232826;
        }

        #gmc-frame .gmc-checkbox
        {
          border-color: #6E7781;
        }

        #gmc-frame input[type="radio"]
        {
          color: #6E7781;
        }

        #gmc-frame svg
        {
          fill: #000000;
        }

        #gmc-frame .section_header
        {
          border-bottom: 1px solid #D0D7DE;
        }

        ${sectionSelectors}
        {
          border-top: 1px solid #D0D7DE;
        }

        #gmc-frame #gmc-frame_section_3 .config_var:not(:last-child),
        #gmc-frame #gmc-frame_section_4 .config_var:not(:last-child)
        {
          border-bottom: 1px solid #D0D7DE;
        }

        #gmc-frame #gmc-frame_saveBtn
        {
          background-color: #1F883D;
          border-color: rgba(31, 35, 40, 0.15);
          box-shadow: rgba(31, 35, 40, 0.1) 0px 1px 0px;
          color: #FFFFFF;
        }

        #gmc-frame #gmc-frame_saveBtn:hover
        {
          background-color: rgb(26, 127, 55);
        }

        #gmc-frame #gmc-frame_section_4
        {
          border: 1px solid #FF818266;
        }

        #gmc-frame #gmc-frame_section_4 input
        {
          background-color: #F6F8FA;
          border-color: #1F232826;
          box-shadow: 0 1px 0 rgba(31,35,40,0.04), inset 0 1px 0 rgba(255,255,255,0.25);
          color: #CF222E;
        }

        #gmc-frame #gmc-frame_section_4 input:hover
        {
          background-color: #A40E26;
          border-color: #1F232826;
          box-shadow: 0 1px 0 rgba(31,35,40,0.04);
          color: #ffffff;
        }

        #gmc-saved
        {
          color: #1a7f37;
        }

        #gmc-saved svg path
        {
          fill: #1a7f37;
        }
      `;
    } else if (THEME === 'dark') {
      gmcFrameStyle.textContent += `
        #gmc-frame
        {
          background-color: #161B22;
          color: #E6EDF3;
          box-shadow: 0 0 0 1px #30363D, 0 16px 32px #010409 !important;
        }

        #gmc-frame .section_header_holder
        {
          background-color: #0D1117;
          border: 1px solid #30363D;
        }

        #gmc-frame_buttons_holder
        {
          background-color: #161B22;
          box-shadow: 0 0 0 1px #30363D, 0 16px 32px #010409 !important;
        }

        #gmc-frame input[type="text"],
        #gmc-frame textarea,
        #gmc-frame select
        {
          border: 1px solid #5B626C;
        }

        #gmc-frame input[type="text"],
        #gmc-frame textarea
        {
          background-color: #010409;
          color: #FFFFFF;
        }

        #gmc-frame [type=button]:hover,
        #gmc-frame .saveclose_buttons:hover
        {
          background-color: #30363d;
          border-color: #8b949e;
        }

        #gmc-frame .gmc-checkbox
        {
          border-color: #6E7681;
        }

        #gmc-frame input[type="radio"]
        {
          color: #6D7681;
        }

        #gmc-frame input[type="text"]:focus,
        textarea:focus
        {
          background-color: #0D1117;
        }

        #gmc-frame [type=button],
        #gmc-frame .saveclose_buttons
        {
          color: #c9d1d9;
          background-color: #21262d;
          border-color: #f0f6fc1a;
        }

        #gmc-frame svg
        {
          fill: #E6EDF3;
        }

        #gmc-frame .section_header
        {
          border-bottom: 1px solid #30363D;
        }

        ${sectionSelectors}
        {
          border-top: 1px solid #30363D;
        }

        #gmc-frame #gmc-frame_section_3 .config_var:not(:last-child),
        #gmc-frame #gmc-frame_section_4 .config_var:not(:last-child)
        {
          padding-bottom: 1rem;
          border-bottom: 1px solid #30363D;
        }

        #gmc-frame #gmc-frame_saveBtn
        {
          background-color: #238636;
          border-color: #F0F6FC1A;
          box-shadow: 0 0 transparent;
          color: #FFFFFF;
        }

        #gmc-frame #gmc-frame_saveBtn:hover
        {
          background-color: #2EA043;
          border-color: #F0F6FC1A;
        }

        #gmc-frame #gmc-frame_section_4
        {
          border: 1px solid #f8514966;
        }

        #gmc-frame #gmc-frame_section_4 input
        {
          background-color: #21262D;
          border-color: #F0F6FC1A;
        }

        #gmc-frame #gmc-frame_section_4 input
        {
          color: #F85149;
        }

        #gmc-frame #gmc-frame_section_4 input:hover
        {
          background-color: #DA3633;
          border-color: #F85149;
          color: #FFFFFF;
        }

        #gmc-saved
        {
          color: #3FB950;
        }

        #gmc-saved svg path
        {
          fill: #3FB950;
        }
      `;
    }

    document.head.appendChild(gmcFrameStyle);
  }

  function gmcBuildFrame() {
    log(DEBUG, 'gmcBuildFrame()');

    const body = document.querySelector('body');
    const gmcDiv = document.createElement('div');

    gmcDiv.setAttribute('id', 'gmc');
    gmcDiv.classList.add('hidden');

    body.appendChild(gmcDiv);

    const gmcFrameDiv = document.createElement('div');
    gmcFrameDiv.setAttribute('id', 'gmc-frame');

    gmcDiv.appendChild(gmcFrameDiv);

    gmcBuildStyle();

    return gmcFrameDiv;
  }

  function applyCustomizations(refresh = false) {
    log(DEBUG, 'applyCustomizations()');

    log(DEBUG, 'refresh', refresh);

    HEADER = document.querySelector(SELECTORS.header.self);

    if (!HEADER) return 'continue';

    const avatarButton = document.querySelector(SELECTORS.avatar.button);

    if (!avatarButton) {
      logError(`Selector ${SELECTORS.avatar.button} not found`);
      return 'break';
    }

    avatarButton.addEventListener('click', addMenuItemToActionList);

    CONFIG_NAME = {
      'Off': 'off',
      'Happy Medium': 'happyMedium',
      'Old School': 'oldSchool',
      'Custom': 'custom',
    }[gmcGet('type')];

    log(DEBUG, 'CONFIG_NAME', CONFIG_NAME);

    if (CONFIG_NAME === 'off') return 'break';

    if (CONFIG_NAME === 'custom') configs.custom = generateCustomConfig();

    CONFIG = configs[CONFIG_NAME][THEME];

    log(VERBOSE, 'CONFIG', CONFIG);

    const headerSuccessFlag = 'customizedHeader';

    const foundHeaderSuccessFlag = document.getElementById(headerSuccessFlag);
    log(DEBUG, 'foundHeaderSuccessFlag', foundHeaderSuccessFlag);

    const configurationApplied = HEADER.classList.contains(CONFIG_NAME);

    if (!configurationApplied && (foundHeaderSuccessFlag === null || refresh)) {
      updateSelectors();

      if (refresh) {
        modifyThenObserve(() => {
          document.querySelector(createId(SELECTORS.header.style))?.remove();
          HEADER_STYLE.textContent = '';

          HEADER.classList.remove(OLD_CONFIG_NAME);
          NEW_ELEMENTS.forEach((element) => element.remove());
        });
      }

      if (CONFIG_NAME === 'oldSchool') {
        HEADER_STYLE.textContent += `
          @media (max-width: 767.98px)
          {
            action-menu
            {
              display: none !important;
            }
          }

          action-menu
          {
            align-content: center;
          }

          .AppHeader ${SELECTORS.header.globalBar} .AppHeader-search input[type=search],
          .AppHeader ${SELECTORS.header.globalBar} .AppHeader-search .AppHeader-searchButton
          {
            padding-right: 4px;
          }

          ${SELECTORS.header.localBar.repositoryNav} ul
          {
            align-items: self-end;
          }

          ${SELECTORS.header.localBar.repositoryNav} ul li:has(.UnderlineNav-item.selected)
          {
            border: 1px solid var(--borderColor-muted);
            border-top-right-radius: 6px;
            border-top-left-radius: 6px;
            border-bottom: 0;
            background-color: var(--bgColor-default, var(--color-canvas-default)) !important;
          }

          ${SELECTORS.header.localBar.repositoryNav} ul li a
          {
            color: var(--fgColor-muted) !important;
            font-size: var(--text-body-size-medium)
            line-height: 23px !important;
            padding: var(--base-size-8) var(--control-medium-paddingInline-spacious);
            text-decoration: none;
            background-color: transparent;
          }

          ${SELECTORS.header.localBar.repositoryNav} ul li a *
          {
            color: var(--fgColor-muted) !important;
          }

          ${SELECTORS.header.localBar.repositoryNav} ul li:has(.UnderlineNav-item.selected) a *
          {
            fill: var(--fgColor-default) !important;
            color: var(--fgColor-default) !important;
          }

          ${SELECTORS.header.localBar.repositoryNav} ul li a:hover *
          {
            fill: var(--fgColor-default) !important;
            color: var(--fgColor-default) !important;
            -webkit-text-decoration: none;
            text-decoration: none;
            transition-duration: .1s;
          }

          ${SELECTORS.header.localBar.repositoryNav} :is(.UnderlineNav-item.selected):after
          {
            bottom: calc(43% + var(--base-size-24)) !important;
          }

          ${SELECTORS.header.leftAligned} > div:first-child
          {
            display: none !important;
          }
        `;

        HEADER.querySelector(SELECTORS.header.globalBar)?.classList.remove('pb-2');
      }

      HEADER_UPDATES_COUNT++;
      updateHeader();

      HEADER.setAttribute('id', headerSuccessFlag);
      HEADER.classList.add(CONFIG_NAME);

      OLD_CONFIG_NAME = CONFIG_NAME;

      log(QUIET, 'Complete');

      return 'break';
    } else {
      if (CONFIG.avatar.dropdownIcon) insertAvatarDropdown();

      if (CONFIG.repositoryHeader.import) {
        // When starting in a repository tab like Issues, the proper repository header
        // (including  Unwatch, Star, and Fork) is not present per GitHub's design.
        // If page title is removed, the page will be missing any location context in the header.
        // To improve this experience, a temporary repository header is created with the
        // page title or breadcrumbs.
        // The proper repository header replaces the temporary one when navigating to the Code tab.
        if (
          !document.querySelector(SELECTORS.repositoryHeader.id)?.hidden &&
          (
            document.querySelector(createId(TEMP_REPOSITORY_HEADER_FLAG)) ||
            !document.querySelector(`.${REPOSITORY_HEADER_SUCCESS_FLAG}`)
          )
        ) {
          const updated = importRepositoryHeader();

          if (updated) {
            HEADER_UPDATES_COUNT++;
            log(QUIET, 'Repository header updated');
          } else {
            IDLE_MUTATION_COUNT++;
          }

          return 'break';
        }
      }
    }

    if (CONFIG.avatar.dropdownIcon) insertAvatarDropdown();
  }

  function startObserving() {
    log(DEBUG, 'startObserving()');

    OBSERVER.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      },
    );
  }

  function modifyThenObserve(callback) {
    log(DEBUG, 'modifyThenObserve()');
    OBSERVER.disconnect();

    callback();

    startObserving();
  }

  function observeAndModify(mutationsList) {
    log(VERBOSE, 'observeAndModify()');

    if (IDLE_MUTATION_COUNT > MAX_IDLE_MUTATIONS) {
      // This is a failsafe to prevent infinite loops
      logError('MAX_IDLE_MUTATIONS exceeded');
      OBSERVER.disconnect();

      return;
    } else if (HEADER_UPDATES_COUNT >= MAX_HEADER_UPDATES) {
      // This is a failsafe to prevent infinite loops
      logError('MAX_HEADER_UPDATES exceeded');
      OBSERVER.disconnect();

      return;
    }

    for (const mutation of mutationsList) {
      // Use header id to determine if updates have already been applied
      if (mutation.type !== 'childList') return;

      log(TRACE, 'mutation', mutation);

      const outcome = applyCustomizations();

      log(DEBUG, 'outcome', outcome);

      if (outcome === 'continue') continue;
      if (outcome === 'break') break;
    }
  }

  const UNICODE_NON_BREAKING_SPACE = '\u00A0';
  const REPOSITORY_HEADER_SUCCESS_FLAG = 'permCustomizedRepositoryHeader';
  const TEMP_REPOSITORY_HEADER_FLAG = 'tempCustomizedRepositoryHeader';
  const REPOSITORY_HEADER_CLASS = 'customizedRepositoryHeader';
  const MAX_IDLE_MUTATIONS = 1000;
  const MAX_HEADER_UPDATES = 100;

  let CONFIG;
  let CONFIG_NAME;
  let OLD_CONFIG_NAME;
  let HEADER;

  let HEADER_STYLE = document.createElement('style');
  let THEME = 'light';
  let NEW_ELEMENTS = [];
  let LEFT_SIDEBAR_PRELOADED = false;
  let IDLE_MUTATION_COUNT = 0;
  let HEADER_UPDATES_COUNT = 0;
  let SELECTORS = {
    header: {
      self: 'header.AppHeader',
      actionsDiv: '.AppHeader-actions',
      globalBar: '.AppHeader-globalBar',
      localBar: {
        topDiv: '.AppHeader-localBar',
        underlineNavActions: '.UnderlineNav-actions',
        repositoryNav: '.AppHeader-localBar [aria-label="Repository"]',
      },
      leftAligned: '.AppHeader-globalBar-start',
      rightAligned: '.AppHeader-globalBar-end',
      style: 'customHeaderStyle',
    },
    logo: {
      topDiv: '.AppHeader-globalBar-start .AppHeader-logo',
      svg: '.AppHeader-logo svg',
    },
    hamburgerButton: '.AppHeader-globalBar-start div:first-child react-partial-anchor button',
    pageTitle: {
      id: 'custom-page-title',
      topDiv: '.AppHeader-context',
      links: '.AppHeader-context a',
      separator: '.AppHeader-context-item-separator',
    },
    search: {
      id: 'search-div',
      topDiv: '.AppHeader-search',
      input: '.search-input',
      button: '[data-target="qbsearch-input.inputButton"]',
      magnifyingGlassIcon: '.AppHeader-search-control label',
      commandPalette: '#AppHeader-commandPalette-button',
      placeholderSpan: '#qb-input-query',
      placeholderDiv: '.AppHeader-search-control .overflow-hidden',
      modal: '[data-target="qbsearch-input.queryBuilderContainer"]',
    },
    copilot: {
      id: 'copilot-div',
      topDiv: '.AppHeader-CopilotChat',
      button: '#copilot-chat-header-button',
      textContent: 'copilot-text-content-span',
    },
    create: {
      id: 'create-div',
      topDiv: '.AppHeader-actions react-partial-anchor',
      button: '#global-create-menu-anchor',
      overlay: '#global-create-menu-overlay',
      plusIcon: '#global-create-menu-anchor .Button-visual.Button-leadingVisual',
      dropdownIcon: '#global-create-menu-anchor .Button-label',
      textContent: 'create-text-content-span',
    },
    issues: {
      id: 'issues',
      link: '.AppHeader-globalBar-end .AppHeader-actions a[href="/issues"]',
      textContent: 'issues-text-content-span',
    },
    pullRequests: {
      id: 'pullRequests',
      link: '.AppHeader-globalBar-end .AppHeader-actions a[href="/pulls"]',
      textContent: 'pullRequests-text-content-span',
    },
    repos: {
      id: 'repos',
      link: '.AppHeader-globalBar-end .AppHeader-actions a[href="/repos"]',
      textContent: 'repos-text-content-span',
    },
    marketplace: {
      id: 'marketplace',
      link: '.AppHeader-globalBar-end .AppHeader-actions a[href="/marketplace"]',
      textContent: 'marketplace-text-content-span',
    },
    explore: {
      id: 'explore',
      link: '.AppHeader-globalBar-end .AppHeader-actions a[href="/explore"]',
      textContent: 'explore-text-content-span',
    },
    notifications: {
      id: 'custom-notifications',
      indicator: 'notification-indicator',
      dot: '.AppHeader-button.AppHeader-button--hasIndicator::before',
      textContent: 'textContent-text-content-spa',
    },
    avatar: {
      topDiv: '.AppHeader-user',
      button: '.AppHeader-user button',
      img: '.AppHeader-user button img.avatar',
      svg: 'avatar-dropdown',
    },
    repositoryHeader: {
      id: '#repository-container-header',
      ownerImg: `.${REPOSITORY_HEADER_CLASS} img`,
      name: `.${REPOSITORY_HEADER_CLASS} strong`,
      nav: `.${REPOSITORY_HEADER_CLASS} nav[role="navigation"]`,
      links: `.${REPOSITORY_HEADER_CLASS} nav[role="navigation"] a`,
      details: '#repository-details-container',
      bottomBorder: `.${REPOSITORY_HEADER_CLASS} .border-bottom.mx-xl-5`,
    },
    sidebars: {
      left: {
        topDiv: '#__primerPortalRoot__',
        backdrop: 'dialog[data-target="deferred-side-panel.panel"]::backdrop',
        modalDialog: 'div[data-position-regular="left"]',
      },
      right: {
        topDiv: '#__primerPortalRoot__',
        wrapper: '#__primerPortalRoot__ > div',
        backdrop: '#__primerPortalRoot__ > div > [data-position-regular="right"]',
        modalDialog: '#__primerPortalRoot__ div[role="dialog"]',
        closeButton: '#__primerPortalRoot__ button[aria-label="Close"]',
        divider: 'li[data-component="ActionList.Divider"]',
        actionList: '[class^="prc-ActionList-"]',
        signOutLink: '[class^="prc-ActionList-"] a[href="/logout"]',
      },
    },
  };

  HEADER_STYLE.setAttribute('id', SELECTORS.header.style);

  setTheme();

  const oldSchoolColor = '#F0F6FC';
  const oldSchoolHoverColor = '#FFFFFFB3';
  const oldSchoolHoverBackgroundColor = 'transparent';
  let configs = {
    happyMedium: {
      light: {
        backgroundColor: '',
        hamburgerButton: {
          remove: false,
        },
        logo: {
          remove: false,
          color: '',
          customSvg: '',
        },
        pageTitle: {
          remove: false,
          color: '',
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        search: {
          remove: false,
          backgroundColor: '',
          borderColor: '',
          boxShadow: '',
          alignLeft: false,
          width: 'max',
          margin: {
            left: '',
            right: '',
          },
          magnifyingGlassIcon: {
            remove: false,
          },
          placeholder: {
            text: '',
            color: '',
          },
          rightButton: 'command palette',
          modal: {
            width: '',
          },
        },
        copilot: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Copilot',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        divider: {
          remove: true,
        },
        flipCreateInbox: false,
        create: {
          remove: false,
          border: true,
          tooltip: false,
          boxShadow: '',
          hoverBackgroundColor: '',
          plusIcon: {
            remove: false,
            color: '',
            marginRight: '0.25rem',
            hover: {
              color: '',
            },
          },
          text: {
            content: 'Create',
            color: '',
          },
          dropdownIcon: {
            remove: false,
            color: '',
            hover: {
              color: '',
            },
          },
        },
        flipIssuesPullRequests: true,
        issues: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Issues',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        pullRequests: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Pull requests',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        repos: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Repos',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        marketplace: {
          add: false,
          border: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Marketplace',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        explore: {
          add: false,
          border: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Explore',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        notifications: {
          remove: false,
          border: true,
          tooltip: false,
          boxShadow: '',
          hoverBackgroundColor: '',
          icon: {
            symbol: 'bell', // Accepts 'inbox', 'bell', or ''
            color: '',
            hover: {
              color: '',
            },
          },
          text: {
            content: 'Inbox',
            color: '',
          },
          dot: {
            remove: false,
            boxShadowColor: '',
            color: '',
            displayOverIcon: true,
          },
        },
        avatar: {
          remove: false,
          size: '',
          dropdownIcon: false,
        },
        globalBar: {
          boxShadowColor: '',
          leftAligned: {
            gap: '',
          },
          rightAligned: {
            gap: '',
          },
        },
        localBar: {
          backgroundColor: '#F6F8FA',
          alignCenter: false,
          boxShadow: {
            consistentColor: true,
          },
          links: {
            color: '',
          },
        },
        sidebars: {
          backdrop: {
            color: 'transparent',
          },
          left: {
            preload: true,
          },
          right: {
            preload: true,
            floatUnderneath: false,
            width: '',
            maxHeight: '',
          },
        },
        repositoryHeader: {
          import: true,
          alignCenter: false,
          removePageTitle: true,
          backgroundColor: '#F6F8FA',
          avatar: {
            remove: false,
            customSvg: '',
          },
          link: {
            color: '',
            hover: {
              backgroundColor: 'transparent',
              color: 'var(--color-accent-fg)',
              textDecoration: 'underline',
            },
          },
        },
      },
      dark: {
        backgroundColor: '',
        hamburgerButton: {
          remove: false,
        },
        logo: {
          remove: false,
          color: '',
          customSvg: '',
        },
        pageTitle: {
          remove: false,
          color: '',
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        search: {
          remove: false,
          backgroundColor: '',
          borderColor: '',
          boxShadow: '',
          alignLeft: false,
          width: 'max',
          margin: {
            left: '',
            right: '',
          },
          magnifyingGlassIcon: {
            remove: false,
          },
          placeholder: {
            text: '',
            color: '',
          },
          rightButton: 'command palette',
          modal: {
            width: '',
          },
        },
        copilot: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Copilot',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        divider: {
          remove: true,
        },
        flipCreateInbox: false,
        create: {
          remove: false,
          border: true,
          tooltip: false,
          boxShadow: '',
          hoverBackgroundColor: '',
          plusIcon: {
            remove: false,
            color: '',
            marginRight: '0.25rem',
            hover: {
              color: '',
            },
          },
          text: {
            content: 'Create',
            color: '',
          },
          dropdownIcon: {
            remove: false,
            color: '',
            hover: {
              color: '',
            },
          },
        },
        flipIssuesPullRequests: true,
        issues: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Issues',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        pullRequests: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Pull requests',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        repos: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Repos',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        marketplace: {
          add: false,
          border: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Marketplace',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        explore: {
          add: false,
          border: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Explore',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        notifications: {
          remove: false,
          border: true,
          tooltip: false,
          boxShadow: '',
          hoverBackgroundColor: '',
          icon: {
            symbol: 'bell', // Accepts 'inbox', 'bell', or ''
            color: '',
            hover: {
              color: '',
            },
          },
          text: {
            content: 'Inbox',
            color: '',
          },
          dot: {
            remove: false,
            boxShadowColor: '',
            color: '',
            displayOverIcon: true,
          },
        },
        avatar: {
          remove: false,
          size: '',
          dropdownIcon: false,
        },
        globalBar: {
          boxShadowColor: '',
          leftAligned: {
            gap: '',
          },
          rightAligned: {
            gap: '',
          },
        },
        localBar: {
          backgroundColor: '#02040A',
          alignCenter: false,
          boxShadow: {
            consistentColor: true,
          },
          links: {
            color: '',
          },
        },
        sidebars: {
          backdrop: {
            color: 'transparent',
          },
          left: {
            preload: true,
          },
          right: {
            preload: true,
            floatUnderneath: false,
            width: '',
            maxHeight: '',
          },
        },
        repositoryHeader: {
          import: true,
          alignCenter: false,
          removePageTitle: true,
          backgroundColor: '#02040A',
          avatar: {
            remove: false,
            customSvg: '',
          },
          link: {
            color: '#6AAFF9',
            hover: {
              backgroundColor: 'transparent',
              color: 'var(--color-accent-fg)',
              textDecoration: 'underline',
            },
          },
        },
      },
    },
    oldSchool: {
      light: {
        backgroundColor: '#161C20',
        hamburgerButton: {
          remove: true,
        },
        logo: {
          remove: false,
          color: '#e6edf3',
          customSvg: '',
        },
        pageTitle: {
          remove: true,
          color: oldSchoolColor,
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        search: {
          remove: false,
          backgroundColor: '#494D54',
          borderColor: '#30363d',
          boxShadow: 'none',
          alignLeft: true,
          width: 'calc(var(--feed-sidebar) - 67px)',
          margin: {
            left: '',
            right: '',
          },
          magnifyingGlassIcon: {
            remove: true,
          },
          placeholder: {
            text: 'Search or jump to...',
            color: '#B3B3B5',
          },
          rightButton: 'slash key',
          modal: {
            width: '450px',
          },
        },
        copilot: {
          remove: true,
          border: false,
          tooltip: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Copilot',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        divider: {
          remove: true,
        },
        flipCreateInbox: true,
        create: {
          remove: false,
          border: false,
          tooltip: false,
          boxShadow: 'none',
          hoverBackgroundColor: oldSchoolHoverBackgroundColor,
          plusIcon: {
            remove: false,
            color: oldSchoolColor,
            marginRight: '0px',
            hover: {
              color: oldSchoolHoverColor,
            },
          },
          text: {
            content: '',
            color: '',
          },
          dropdownIcon: {
            remove: false,
            color: oldSchoolColor,
            hover: {
              color: oldSchoolHoverColor,
            },
          },
        },
        flipIssuesPullRequests: true,
        issues: {
          remove: false,
          border: false,
          tooltip: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Issues',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        pullRequests: {
          remove: false,
          border: false,
          tooltip: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Pull requests',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        repos: {
          remove: true,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Repos',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        marketplace: {
          add: true,
          border: false,
          tooltip: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Marketplace',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        explore: {
          add: true,
          border: false,
          tooltip: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Explore',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        notifications: {
          remove: false,
          border: false,
          tooltip: false,
          boxShadow: 'none',
          hoverBackgroundColor: oldSchoolHoverBackgroundColor,
          icon: {
            symbol: 'bell',
            color: oldSchoolColor,
            hover: {
              color: oldSchoolHoverColor,
            },
          },
          text: {
            content: '',
            color: '',
          },
          dot: {
            remove: false,
            boxShadowColor: '#161C20',
            color: '#2f81f7',
            displayOverIcon: true,
          },
        },
        avatar: {
          remove: false,
          size: '24px',
          dropdownIcon: true,
        },
        globalBar: {
          boxShadowColor: '#21262D',
          leftAligned: {
            gap: '0.75rem',
          },
          rightAligned: {
            gap: '2px',
          },
        },
        localBar: {
          backgroundColor: '#FAFBFD',
          alignCenter: true,
          boxShadow: {
            consistentColor: true,
          },
          links: {
            color: '',
          },
        },
        sidebars: {
          backdrop: {
            color: oldSchoolHoverBackgroundColor,
          },
          left: {
            preload: true,
          },
          right: {
            preload: true,
            floatUnderneath: true,
            width: '',
            maxHeight: '60vh',
          },
        },
        repositoryHeader: {
          import: true,
          alignCenter: true,
          removePageTitle: true,
          backgroundColor: '#FAFBFD',
          avatar: {
            remove: false,
            customSvg: '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo mr-1 color-fg-muted"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>',
          },
          link: {
            color: '#2F81F7',
            hover: {
              backgroundColor: 'transparent',
              color: '#0969da',
              textDecoration: 'underline',
            },
          },
        },
      },
      dark: {
        backgroundColor: '#161C20',
        hamburgerButton: {
          remove: true,
        },
        logo: {
          remove: false,
          color: '#e6edf3',
          customSvg: '',
        },
        pageTitle: {
          remove: true,
          color: oldSchoolColor,
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        search: {
          remove: false,
          backgroundColor: '#0E1217',
          borderColor: '#30363d',
          boxShadow: 'none',
          alignLeft: true,
          width: 'calc(var(--feed-sidebar) - 67px)',
          margin: {
            left: '',
            right: '',
          },
          magnifyingGlassIcon: {
            remove: true,
          },
          placeholder: {
            text: 'Search or jump to...',
            color: '#B3B3B5',
          },
          rightButton: 'slash key',
          modal: {
            width: '450px',
          },
        },
        copilot: {
          remove: true,
          border: false,
          tooltip: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Copilot',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        divider: {
          remove: true,
        },
        flipCreateInbox: true,
        create: {
          remove: false,
          border: false,
          tooltip: false,
          boxShadow: 'none',
          hoverBackgroundColor: oldSchoolHoverBackgroundColor,
          plusIcon: {
            remove: false,
            color: oldSchoolColor,
            marginRight: '0px',
            hover: {
              color: oldSchoolHoverColor,
            },
          },
          text: {
            content: '',
            color: '',
          },
          dropdownIcon: {
            remove: false,
            color: oldSchoolColor,
            hover: {
              color: oldSchoolHoverColor,
            },
          },
        },
        flipIssuesPullRequests: true,
        issues: {
          remove: false,
          border: false,
          tooltip: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Issues',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        pullRequests: {
          remove: false,
          border: false,
          tooltip: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Pull requests',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        repos: {
          remove: true,
          border: true,
          tooltip: false,
          alignLeft: false,
          boxShadow: '',
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Repos',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        marketplace: {
          add: true,
          border: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Marketplace',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        explore: {
          add: true,
          border: false,
          alignLeft: true,
          boxShadow: 'none',
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Explore',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        notifications: {
          remove: false,
          border: false,
          tooltip: false,
          boxShadow: 'none',
          hoverBackgroundColor: oldSchoolHoverBackgroundColor,
          icon: {
            symbol: 'bell',
            color: oldSchoolColor,
            hover: {
              color: oldSchoolHoverColor,
            },
          },
          text: {
            content: '',
            color: '',
          },
          dot: {
            remove: false,
            boxShadowColor: '#161C20',
            color: '#2f81f7',
            displayOverIcon: true,
          },
        },
        avatar: {
          remove: false,
          size: '24px',
          dropdownIcon: true,
        },
        globalBar: {
          boxShadowColor: '#21262D',
          leftAligned: {
            gap: '0.75rem',
          },
          rightAligned: {
            gap: '2px',
          },
        },
        localBar: {
          backgroundColor: '#0D1117',
          alignCenter: true,
          boxShadow: {
            consistentColor: true,
          },
          links: {
            color: '#e6edf3',
          },
        },
        sidebars: {
          backdrop: {
            color: oldSchoolHoverBackgroundColor,
          },
          left: {
            preload: true,
          },
          right: {
            preload: true,
            floatUnderneath: true,
            width: '',
            maxHeight: '60vh',
          },
        },
        repositoryHeader: {
          import: true,
          alignCenter: true,
          removePageTitle: true,
          backgroundColor: '#0D1116',
          avatar: {
            remove: false,
            customSvg: '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo mr-1 color-fg-muted"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>',
          },
          link: {
            color: '#58A6FF',
            hover: {
              backgroundColor: 'transparent',
              color: '#2F81F7',
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  };

  // For testing purposes
  // if (!checkConfigConsistency(configs)) return;

  let OBSERVER = new MutationObserver(observeAndModify);

  let GMC = new GM_config({
    id: 'gmc-frame',
    title: `
      Custom Global Navigation
      <small>
        v${VERSION}
      </small>
      <small>
        <a
          href="https://github.com/blakegearin/github-custom-global-navigation"
          target="_blank"
        >
          (source)
        </a>
      </small>
    `,
    events: {
      init: gmcInitialized,
      open: gmcOpened,
      save: gmcSaved,
      close: gmcClosed,
    },
    frame: gmcBuildFrame(),
    fields: {
      type: {
        section: [
          `
            Configuration Type
            <small>
              <a
                href="https://github.com/blakegearin/github-custom-global-navigation#configurations"
                target="_blank"
              >
                learn more
              </a>
            </small>
          `,
        ],
        type: 'radio',
        options: [
          'Off',
          'Happy Medium',
          'Old School',
          'Custom',
        ],
        default: 'Old School',
      },
      light_backgroundColor: {
        label: 'Background color',
        section: [
          'Custom Light',
        ],
        type: 'text',
        default: '',
      },
      light_hamburgerButton_remove: {
        label: '<h3>Hamburger button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_logo_remove: {
        label: '<h3>Logo</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_logo_color: {
        label: 'Color',
        type: 'text',
        default: '',
      },
      light_logo_customSvg: {
        label: 'Custom SVG (URL or text)',
        type: 'textarea',
        default: '',
      },
      light_pageTitle_remove: {
        label: '<h3>Page title</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_pageTitle_color: {
        label: 'Color',
        type: 'text',
        default: '',
      },
      light_pageTitle_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_pageTitle_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      light_search_remove: {
        label: '<h3>Search</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_search_backgroundColor: {
        label: 'Background color',
        type: 'text',
        default: '',
      },
      light_search_borderColor: {
        label: 'Border color',
        type: 'text',
        default: '',
      },
      light_search_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      light_search_alignLeft: {
        label: 'Left aligned',
        type: 'checkbox',
        default: false,
      },
      light_search_width: {
        label: 'Width',
        type: 'text',
        default: '',
      },
      light_search_margin_left: {
        label: 'Margin left',
        type: 'text',
        default: '',
      },
      light_search_margin_right: {
        label: 'Margin right',
        type: 'text',
        default: '',
      },
      light_search_magnifyingGlassIcon_remove: {
        label: 'Magnifying glass icon remove',
        type: 'checkbox',
        default: false,
      },
      light_search_placeholder_text: {
        label: 'Placeholder text',
        type: 'text',
        default: '',
      },
      light_search_placeholder_color: {
        label: 'Placeholder color',
        type: 'text',
        default: '',
      },
      light_search_rightButton: {
        label: 'Right button',
        type: 'select',
        options: [
          'none',
          'command palette',
          'slash key',
        ],
        default: 'command palette',
      },
      light_search_modal_width: {
        label: 'Modal width',
        type: 'text',
        default: '',
      },
      light_divider_remove: {
        label: '<h3>Divider</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_flipCreateInbox: {
        label: 'Flip the order of Create and Notifications',
        type: 'checkbox',
        default: false,
      },
      light_create_remove: {
        label: '<h3>Create button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_create_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_create_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      light_create_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      light_create_hoverBackgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_create_plusIcon_remove: {
        label: 'Plus icon remove',
        type: 'checkbox',
        default: false,
      },
      light_create_plusIcon_color: {
        label: 'Plus icon color',
        type: 'text',
        default: '',
      },
      light_create_plusIcon_marginRight: {
        label: 'Plus icon margin right',
        type: 'text',
        default: '',
      },
      light_create_plusIcon_hover_color: {
        label: 'Plus icon hover color',
        type: 'text',
        default: '',
      },
      light_create_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_create_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_create_dropdownIcon_remove: {
        label: 'Dropdown icon remove',
        type: 'checkbox',
        default: false,
      },
      light_create_dropdownIcon_color: {
        label: 'Dropdown icon color',
        type: 'text',
        default: '',
      },
      light_create_dropdownIcon_hover_color: {
        label: 'Dropdown icon hover color',
        type: 'text',
        default: '',
      },
      light_flipIssuesPullRequests: {
        label: 'Flip the order of Issues and Pull requests',
        type: 'checkbox',
        default: false,
      },
      light_issues_remove: {
        label: '<h3>Issues button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_issues_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_issues_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      light_issues_alignLeft: {
        label: 'Align left',
        type: 'checkbox',
        default: false,
      },
      light_issues_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      light_issues_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      light_issues_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      light_issues_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_issues_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_issues_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_issues_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      light_pullRequests_remove: {
        label: '<h3>Pull requests button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_pullRequests_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_pullRequests_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      light_pullRequests_alignLeft: {
        label: 'Align left',
        type: 'checkbox',
        default: false,
      },
      light_pullRequests_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      light_pullRequests_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      light_pullRequests_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      light_pullRequests_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_pullRequests_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_pullRequests_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_pullRequests_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      light_marketplace_add: {
        label: '<h3>Marketplace</h3><div class="gmc-label">Add</div>',
        type: 'checkbox',
        default: false,
      },
      light_marketplace_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_marketplace_alignLeft: {
        label: 'Align left',
        type: 'checkbox',
        default: false,
      },
      light_marketplace_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      light_marketplace_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      light_marketplace_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      light_marketplace_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_marketplace_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_marketplace_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_marketplace_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      light_explore_add: {
        label: '<h3>Explore</h3><div class="gmc-label">Add</div>',
        type: 'checkbox',
        default: false,
      },
      light_explore_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_explore_alignLeft: {
        label: 'Align left',
        type: 'checkbox',
        default: false,
      },
      light_explore_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      light_explore_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      light_explore_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      light_explore_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_explore_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_explore_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_explore_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      light_notifications_remove: {
        label: '<h3>Notifications button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_notifications_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_notifications_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      light_notifications_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      light_notifications_hoverBackgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_notifications_icon_symbol: {
        label: 'Icon symbol',
        type: 'select',
        options: [
          'none',
          'inbox',
          'bell',
        ],
        default: 'inbox',
      },
      light_notifications_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      light_notifications_icon_hover_color: {
        label: 'Icon hover color',
        type: 'text',
        default: '',
      },
      light_notifications_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_notifications_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_notifications_dot_remove: {
        label: 'Dot remove',
        type: 'checkbox',
        default: false,
      },
      light_notifications_dot_boxShadowColor: {
        label: 'Dot hover color',
        type: 'text',
        default: '',
      },
      light_notifications_dot_color: {
        label: 'Dot color',
        type: 'text',
        default: '',
      },
      light_notifications_dot_displayOverIcon: {
        label: 'Dot display over icon',
        type: 'checkbox',
        default: false,
      },
      light_avatar_remove: {
        label: '<h3>Avatar</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_avatar_size: {
        label: 'Size',
        type: 'text',
        default: '',
      },
      light_avatar_dropdownIcon: {
        label: 'Dropdown icon',
        type: 'checkbox',
        default: false,
      },
      light_globalBar_boxShadowColor: {
        label: '<h3>Global bar</h3><div class="gmc-label">Box shadow color</div>',
        type: 'text',
        default: '',
      },
      light_globalBar_leftAligned_gap: {
        label: 'Left aligned gap',
        type: 'text',
        default: '',
      },
      light_globalBar_rightAligned_gap: {
        label: 'Right aligned gap',
        type: 'text',
        default: '',
      },
      light_localBar_backgroundColor: {
        label: '<h3>Local bar</h3><div class="gmc-label">Background color</div>',
        type: 'text',
        default: '',
      },
      light_localBar_alignCenter: {
        label: 'Align center',
        type: 'checkbox',
        default: false,
      },
      light_localBar_boxShadow_consistentColor: {
        label: 'Box shadow consistent color',
        type: 'checkbox',
        default: false,
      },
      light_localBar_links_color: {
        label: 'Links color',
        type: 'text',
        default: '',
      },
      light_sidebars_backdrop_color: {
        label: '<h3>Sidebars</h3><div class="gmc-label">Backdrop color</div>',
        type: 'text',
        default: '',
      },
      light_sidebars_left_preload: {
        label: 'Left preload',
        type: 'checkbox',
        default: false,
      },
      light_sidebars_right_preload: {
        label: 'Right preload',
        type: 'checkbox',
        default: false,
      },
      light_sidebars_right_floatUnderneath: {
        label: 'Right float underneath',
        type: 'checkbox',
        default: false,
      },
      light_sidebars_right_width: {
        label: 'Right width',
        type: 'text',
        default: '',
      },
      light_sidebars_right_maxHeight: {
        label: 'Right max height',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_import: {
        label: '<h3>Repository header</h3><div class="gmc-label">Import</div>',
        type: 'checkbox',
        default: false,
      },
      light_repositoryHeader_alignCenter: {
        label: 'Align center',
        type: 'checkbox',
        default: false,
      },
      light_repositoryHeader_removePageTitle: {
        label: 'Remove page title',
        type: 'checkbox',
        default: false,
      },
      light_repositoryHeader_backgroundColor: {
        label: 'Background color',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_avatar_remove: {
        label: 'Avatar remove',
        type: 'checkbox',
        default: false,
      },
      light_repositoryHeader_avatar_customSvg: {
        label: 'Custom SVG (URL or text)',
        type: 'textarea',
        default: '',
      },
      light_repositoryHeader_link_color: {
        label: 'Link color',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_link_hover_backgroundColor: {
        label: 'Link hover background color',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_link_hover_color: {
        label: 'Link hover color',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_link_hover_textDecoration: {
        label: 'Link hover text decoration',
        type: 'text',
        default: '',
      },
      dark_backgroundColor: {
        label: 'Background color',
        section: [
          'Custom Dark',
        ],
        type: 'text',
        default: '',
      },
      dark_hamburgerButton_remove: {
        label: '<h3>Hamburger button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_logo_remove: {
        label: '<h3>Logo</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_logo_color: {
        label: 'Color',
        type: 'text',
        default: '',
      },
      dark_logo_customSvg: {
        label: 'Custom SVG (URL or text)',
        type: 'textarea',
        default: '',
      },
      dark_pageTitle_remove: {
        label: '<h3>Page title</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_pageTitle_color: {
        label: 'Color',
        type: 'text',
        default: '',
      },
      dark_pageTitle_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_pageTitle_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      dark_search_remove: {
        label: '<h3>Search</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_search_backgroundColor: {
        label: 'Background color',
        type: 'text',
        default: '',
      },
      dark_search_borderColor: {
        label: 'Border color',
        type: 'text',
        default: '',
      },
      dark_search_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      dark_search_alignLeft: {
        label: 'Left aligned',
        type: 'checkbox',
        default: false,
      },
      dark_search_width: {
        label: 'Width',
        type: 'text',
        default: '',
      },
      dark_search_margin_left: {
        label: 'Margin left',
        type: 'text',
        default: '',
      },
      dark_search_margin_right: {
        label: 'Margin right',
        type: 'text',
        default: '',
      },
      dark_search_magnifyingGlassIcon_remove: {
        label: 'Magnifying glass icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_search_placeholder_text: {
        label: 'Placeholder text',
        type: 'text',
        default: '',
      },
      dark_search_placeholder_color: {
        label: 'Placeholder color',
        type: 'text',
        default: '',
      },
      dark_search_rightButton: {
        label: 'Right button',
        type: 'select',
        options: [
          'none',
          'command palette',
          'slash key',
        ],
        default: 'command palette',
      },
      dark_search_modal_width: {
        label: 'Modal width',
        type: 'text',
        default: '',
      },
      dark_divider_remove: {
        label: '<h3>Divider</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_flipCreateInbox: {
        label: 'Flip the order of Create and Notifications',
        type: 'checkbox',
        default: false,
      },
      dark_create_remove: {
        label: '<h3>Create button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_create_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_create_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      dark_create_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      dark_create_hoverBackgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_create_plusIcon_remove: {
        label: 'Plus icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_create_plusIcon_color: {
        label: 'Plus icon color',
        type: 'text',
        default: '',
      },
      dark_create_plusIcon_marginRight: {
        label: 'Plus icon margin right',
        type: 'text',
        default: '',
      },
      dark_create_plusIcon_hover_color: {
        label: 'Plus icon hover color',
        type: 'text',
        default: '',
      },
      dark_create_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_create_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_create_dropdownIcon_remove: {
        label: 'Dropdown icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_create_dropdownIcon_color: {
        label: 'Dropdown icon color',
        type: 'text',
        default: '',
      },
      dark_create_dropdownIcon_hover_color: {
        label: 'Dropdown icon hover color',
        type: 'text',
        default: '',
      },
      dark_flipIssuesPullRequests: {
        label: 'Flip the order of Issues and Pull requests',
        type: 'checkbox',
        default: false,
      },
      dark_issues_remove: {
        label: '<h3>Issues button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_issues_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_issues_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      dark_issues_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      dark_issues_alignLeft: {
        label: 'Align left',
        type: 'checkbox',
        default: false,
      },
      dark_issues_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_issues_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      dark_issues_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_issues_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_issues_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_issues_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      dark_pullRequests_remove: {
        label: '<h3>Pull requests button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_pullRequests_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_pullRequests_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      dark_pullRequests_alignLeft: {
        label: 'Align left',
        type: 'checkbox',
        default: false,
      },
      dark_pullRequests_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      dark_pullRequests_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_pullRequests_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      dark_pullRequests_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_pullRequests_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_pullRequests_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_pullRequests_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      dark_marketplace_add: {
        label: '<h3>Marketplace</h3><div class="gmc-label">Add</div>',
        type: 'checkbox',
        default: false,
      },
      dark_marketplace_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_marketplace_alignLeft: {
        label: 'Align left',
        type: 'checkbox',
        default: false,
      },
      dark_marketplace_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      dark_marketplace_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_marketplace_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      dark_marketplace_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_marketplace_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_marketplace_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_marketplace_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      dark_explore_add: {
        label: '<h3>Explore</h3><div class="gmc-label">Add</div>',
        type: 'checkbox',
        default: false,
      },
      dark_explore_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_explore_alignLeft: {
        label: 'Align left',
        type: 'checkbox',
        default: false,
      },
      dark_explore_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      dark_explore_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_explore_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      dark_explore_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_explore_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_explore_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_explore_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      dark_notifications_remove: {
        label: '<h3>Notifications button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_notifications_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_notifications_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      dark_notifications_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      dark_notifications_hoverBackgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_notifications_icon_symbol: {
        label: 'Icon symbol',
        type: 'select',
        options: [
          'none',
          'inbox',
          'bell',
        ],
        default: 'inbox',
      },
      dark_notifications_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      dark_notifications_icon_hover_color: {
        label: 'Icon hover color',
        type: 'text',
        default: '',
      },
      dark_notifications_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_notifications_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_notifications_dot_remove: {
        label: 'Dot remove',
        type: 'checkbox',
        default: false,
      },
      dark_notifications_dot_boxShadowColor: {
        label: 'Dot hover color',
        type: 'text',
        default: '',
      },
      dark_notifications_dot_color: {
        label: 'Dot color',
        type: 'text',
        default: '',
      },
      dark_notifications_dot_displayOverIcon: {
        label: 'Dot display over icon',
        type: 'checkbox',
        default: false,
      },
      dark_avatar_remove: {
        label: '<h3>Avatar</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_avatar_size: {
        label: 'Size',
        type: 'text',
        default: '',
      },
      dark_avatar_dropdownIcon: {
        label: 'Dropdown icon',
        type: 'checkbox',
        default: false,
      },
      dark_globalBar_boxShadowColor: {
        label: '<h3>Global bar</h3><div class="gmc-label">Box shadow color</div>',
        type: 'text',
        default: '',
      },
      dark_globalBar_leftAligned_gap: {
        label: 'Left aligned gap',
        type: 'text',
        default: '',
      },
      dark_globalBar_rightAligned_gap: {
        label: 'Right aligned gap',
        type: 'text',
        default: '',
      },
      dark_localBar_backgroundColor: {
        label: '<h3>Local bar</h3><div class="gmc-label">Background color</div>',
        type: 'text',
        default: '',
      },
      dark_localBar_alignCenter: {
        label: 'Align center',
        type: 'checkbox',
        default: false,
      },
      dark_localBar_boxShadow_consistentColor: {
        label: 'Box shadow consistent color',
        type: 'checkbox',
        default: false,
      },
      dark_localBar_links_color: {
        label: 'Links color',
        type: 'text',
        default: '',
      },
      dark_sidebars_backdrop_color: {
        label: '<h3>Sidebars</h3><div class="gmc-label">Backdrop color</div>',
        type: 'text',
        default: '',
      },
      dark_sidebars_left_preload: {
        label: 'Left preload',
        type: 'checkbox',
        default: false,
      },
      dark_sidebars_right_preload: {
        label: 'Right preload',
        type: 'checkbox',
        default: false,
      },
      dark_sidebars_right_floatUnderneath: {
        label: 'Right float underneath',
        type: 'checkbox',
        default: false,
      },
      dark_sidebars_right_width: {
        label: 'Right width',
        type: 'text',
        default: '',
      },
      dark_sidebars_right_maxHeight: {
        label: 'Right max height',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_import: {
        label: '<h3>Repository header</h3><div class="gmc-label">Import</div>',
        type: 'checkbox',
        default: false,
      },
      dark_repositoryHeader_alignCenter: {
        label: 'Align enter',
        type: 'checkbox',
        default: false,
      },
      dark_repositoryHeader_removePageTitle: {
        label: 'Remove page title',
        type: 'checkbox',
        default: false,
      },
      dark_repositoryHeader_backgroundColor: {
        label: 'Background color',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_avatar_remove: {
        label: 'Avatar remove',
        type: 'checkbox',
        default: false,
      },
      dark_repositoryHeader_avatar_customSvg: {
        label: 'Custom SVG (URL or text)',
        type: 'textarea',
        default: '',
      },
      dark_repositoryHeader_link_color: {
        label: 'Link color',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_link_hover_backgroundColor: {
        label: 'Link hover background color',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_link_hover_color: {
        label: 'Link hover color',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_link_hover_textDecoration: {
        label: 'Link hover text decoration',
        type: 'text',
        default: '',
      },
      on_save: {
        label: 'On save',
        section: ['Settings'],
        type: 'select',
        options: [
          'do nothing',
          'refresh tab',
          'refresh tab and close',
          'run script',
          'run script and close',
        ],
        default: 'do nothing',
      },
      on_close: {
        label: 'On close',
        type: 'select',
        options: [
          'do nothing',
          'refresh tab',
          'run script',
        ],
        default: 'do nothing',
      },
      menu_item_title: {
        label: 'Menu item title',
        type: 'text',
        default: 'Custom global navigation',
      },
      menu_item_icon: {
        label: 'Menu item icon',
        type: 'select',
        options: [
          'logo',
          'compass',
          'cog',
        ],
        default: 'logo',
      },
      log_level: {
        label: 'Log level',
        type: 'select',
        options: [
          'silent',
          'quiet',
          'debug',
          'verbose',
          'trace',
        ],
        default: 'quiet',
      },
      clear_custom_config: {
        label: 'Clear Custom',
        section: ['Danger Zone'],
        type: 'button',
        click: gmcClearCustom,
      },
      apply_happyMedium_config: {
        label: 'Overwrite Custom with Happy Medium',
        type: 'button',
        click: gmcApplyCustomHappyMediumConfig,
      },
      apply_oldSchool_config: {
        label: 'Overwrite Custom with Old School',
        type: 'button',
        click: gmcApplyCustomOldSchoolConfig,
      },
    },
  });
})();
