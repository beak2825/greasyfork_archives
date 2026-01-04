// ==UserScript==
// @name         Old School Slack
// @namespace    https://github.com/blakegearin/old-school-slack
// @version      1.1.0
// @description  Updates Slack to look & feel like the old design
// @author       Blake Gearin <hello@blakeg.me> (https://blakegearin.com)
// @match        *://app.slack.com/*
// @icon         https://raw.githubusercontent.com/blakegearin/old-school-slack/refs/heads/main/img/logo.png
// @supportURL   https://github.com/blakegearin/old-school-slack/issues
// @license      GPL-3.0-only
// @copyright    2023–2025, Blake Gearin (https://blakegearin.com)
// @downloadURL https://update.greasyfork.org/scripts/534329/Old%20School%20Slack.user.js
// @updateURL https://update.greasyfork.org/scripts/534329/Old%20School%20Slack.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  'use strict';

  const VERSION = '1.1.0';
  const USERSCRIPT_NAME = 'Old School Slack';

  const SILENT = 0;
  const QUIET = 1;
  const INFO = 2;
  const DEBUG = 3;
  const VERBOSE = 4;
  const TRACE = 5;

  const CONFIG = {
    logLevel: QUIET,
    sidebar: {
      hide: false,
      ifOneWorkspace: {
        hideSidebar: true,
        addWorkspaceButton: {
          createNavButton: true,
        },
        homeTab: {
          createNavButtonOnSearch: true,
        },
      },
      workspaceSwitcher: {
        hide: true,
        clickToGoHome: true,
        highlight: true,
        addOtherWorkspaceButtons: true,
      },
      tabs: {
        home: {
          hide: true,
          createNavButton: false,
          createNavButtonOnSearch: true,
        },
        dms: {
          createNavButton: false,
        },
        activity: {
          hide: true,
          createNavButton: false,
        },
        later: {
          createNavButton: false,
        },
        templates: {
          createNavButton: false,
        },
        automations: {
          createNavButton: false,
        },
        canvases: {
          createNavButton: false,
        },
        files: {
          createNavButton: false,
        },
        channels: {
          createNavButton: false,
        },
        people: {
          createNavButton: false,
        },
        external: {
          createNavButton: false,
        },
        more: {
          hide: true,
          createNavButton: false,
        },
      },
    },
    controlStrip: {
      moveUp: false,
      createButton: {
        hide: true,
      },
      avatar: {
        moveToNav: true,
      },
    },
    workspace: {
      squareOff: true,
    },
  };

  const LOG_LEVELS = {
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

  let CURRENT_LOG_LEVEL = CONFIG.logLevel;

  function log (level, message, variable = undefined) {
    if (CURRENT_LOG_LEVEL < level) return;

    const levelName = LOG_LEVELS.getName(level);

    const log = `[${VERSION}] [${levelName}] ${USERSCRIPT_NAME}: ${message}`;

    console.groupCollapsed(log);

    if (variable !== undefined) console.dir(variable, { depth: null });

    console.trace();
    console.groupEnd();
  }

  log(QUIET, 'Starting');

  const SELECTORS = {
    workspaceSwitcher: '.p-account_switcher',
    tabRail: '.p-tab_rail',
    controlStripToolbar: '.p-client_workspace__layout .p-control_strip[role="toolbar"]',
    workspacesTeams: '.p_team-switcher-menu__item__team .p_team-switcher-menu__item__team',
    modalOverlay: '.ReactModal__Overlay',
    workspacesAddButton: '.p-team_switcher_menu__item--add',
    homeTabButton: '.p-tab_rail button[aria-label="Home"]',
  };

  // Source: https://stackoverflow.com/a/61511955/5988852
  function waitForElement(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  function updateWorkspaceToGoHome() {
    log(VERBOSE, 'updateWorkspaceToGoHome()');

    const workspaceSwitcher = document.querySelector(SELECTORS.workspaceSwitcher);
    workspaceSwitcher.click();
    workspaceSwitcher.addEventListener('click', async () => {
      document.querySelector(SELECTORS.homeTabButton).click();

      await closeWorkspaceSwitcherModal();
    });
  }

  async function closeWorkspaceSwitcherModal() {
    log(VERBOSE, 'openWorkspaceSwitcherDiscretely()');

    const modalOverlay = await waitForElement(SELECTORS.modalOverlay);
    modalOverlay?.click();
  }

  function openWorkspaceSwitcherDiscretely() {
    log(VERBOSE, 'openWorkspaceSwitcherDiscretely()');

    // Temporarily hide the workspace switcher modal
    const style = document.createElement('style');
    style.id = 'oss-temporary-modal-content-style';
    style.textContent += '.ReactModal__Content { display: none !important; }';
    document.body.appendChild(style);

    // Open the workspace switcher modal
    const originalWorkspaceSwitcher = document.querySelector(SELECTORS.workspaceSwitcher);
    originalWorkspaceSwitcher.click();

    return style;
  }

  async function closeWorkspaceSwitcherDiscretely(style) {
    log(VERBOSE, 'closeWorkspaceSwitcherDiscretely()');

    await closeWorkspaceSwitcherModal();
    style.remove();
  }

  async function getWorkspaceCount() {
    log(VERBOSE, 'maybeHideWorkspaceSwitcher()');

    const temporaryModalContentStyle = openWorkspaceSwitcherDiscretely();

    await waitForElement(SELECTORS.workspacesTeams);

    const workspaceCount = document.querySelectorAll(SELECTORS.workspacesTeams).length;
    log(DEBUG, 'workspaceCount', workspaceCount);

    await closeWorkspaceSwitcherDiscretely(temporaryModalContentStyle);

    return workspaceCount;
  }

  async function openAddWorkspaceDiscretely() {
    const createWorkspaceButtonStyle = openWorkspaceSwitcherDiscretely();

    const workspacesAddButton = await waitForElement(SELECTORS.workspacesAddButton);
    workspacesAddButton?.click();

    await closeWorkspaceSwitcherDiscretely(createWorkspaceButtonStyle);
  }

  async function addWorkspaceButtons() {
    log(VERBOSE, 'addWorkspaceButtons()');

    const temporaryModalContentStyle = openWorkspaceSwitcherDiscretely();

    await waitForElement(SELECTORS.workspacesTeams);

    const workspaceDivs = Array.from(document.querySelectorAll(SELECTORS.workspacesTeams));
    // Remove the first element, which is the current workspace
    workspaceDivs.shift();

    const workspaceMetadata = [];

    for (const workspaceDiv of workspaceDivs) {
      const icon = workspaceDiv.querySelector('.p-account_switcher__row_icon');
      const url = workspaceDiv.querySelector('.p-account_switcher__row_url').textContent;

      workspaceMetadata.push({ icon, url });
    }

    log(DEBUG, 'workspaceMetadata', workspaceMetadata);

    await closeWorkspaceSwitcherDiscretely(temporaryModalContentStyle);

    const addWorkspaceButtonStyle = document.createElement('style');
    addWorkspaceButtonStyle.id = 'oss-add-workspace-button-style';
    addWorkspaceButtonStyle.textContent += `
      ${SELECTORS.tabRail}:has([data-qa="ellipsis-vertical-filled"]) .c-team_icon
      {
        height: 24px !important;
        width: 24px !important;
        min-width: auto !important;
      }

      ${SELECTORS.tabRail}:has([data-qa="ellipsis-vertical-filled"]) [role="tablist"] > div:last-child .p-tab_rail__button
      {
        margin-bottom: 0px !important;
      }

      ${SELECTORS.tabRail} .p-team_switcher_menu__item--add
      {
        padding: 0px !important;
      }

      ${SELECTORS.tabRail} .p-add_team_label > div:nth-child(2)
      {
        display: none !important;
      }

      #oss-create-workspace-button
      {
        display: flex !important;
      }

      .active-managed-focus-container .p-control_strip__circle_button
      {
        background-color: transparent;
      }
      .active-managed-focus-container .p-control_strip__circle_button:active
      {
        background-color: revert !important;
      }
    `;
    document.body.appendChild(addWorkspaceButtonStyle);

    const thirdElementInTabRail = document.querySelector(`${SELECTORS.tabRail} > div:nth-child(3)`);
    log(DEBUG, 'thirdElementInTabRail', thirdElementInTabRail);

    const tabRail = thirdElementInTabRail.parentElement;

    function buildTabRailDiv() {
      const tabRailDiv = document.createElement('div');

      tabRailDiv.classList.add('active-managed-focus-container');
      tabRailDiv.role = 'none';
      tabRailDiv.style.display = 'contents';

      const peekTriggerDiv = document.createElement('div');
      peekTriggerDiv.classList.add('p-peek_trigger');
      peekTriggerDiv.role = 'none';

      const peekTriggerDivInner = document.createElement('div');

      peekTriggerDiv.appendChild(peekTriggerDivInner);
      tabRailDiv.appendChild(peekTriggerDiv);

      return [tabRailDiv, peekTriggerDivInner];
    }

    for (const workspace of workspaceMetadata) {
      const [workspaceDiv, innerDiv] = buildTabRailDiv();

      const button = document.createElement('button');
      button.classList.add('c-button-unstyled', 'p-account_switcher', 'oss-account_switcher');
      button.innerHTML = workspace.icon.outerHTML;

      button.setAttribute('aria-label', 'Switch workspaces… (Bernie Slack) ');

      button.addEventListener('click', () => {
        window.location.href = `https://${workspace.url}`;
      });

      innerDiv.appendChild(button);
      tabRail.insertBefore(workspaceDiv, thirdElementInTabRail);
    }

    const [workspaceAddDiv, innerDiv] = buildTabRailDiv();

    // Need a less specific selector to find the create button
    const controlStripCreateButtonSelector = `${SELECTORS.controlStripToolbar} .p-control_strip__create_button`;
    const controlStripCreateButton = await waitForElement(controlStripCreateButtonSelector);
    log(DEBUG, 'controlStripCreateButton', controlStripCreateButton);

    const workspacesAddButton = controlStripCreateButton.cloneNode(true);
    log(DEBUG, 'workspacesAddButton', workspacesAddButton);

    workspacesAddButton.id = 'oss-create-workspace-button';
    workspacesAddButton.classList.add('p-account_switcher');

    workspacesAddButton.addEventListener('click', async () => {
      await openAddWorkspaceDiscretely();
    });

    innerDiv.appendChild(workspacesAddButton);
    tabRail.insertBefore(workspaceAddDiv, thirdElementInTabRail);
  }

  async function moveUpControlStrip() {
    log(VERBOSE, 'moveUpControlStrip()');

    const moveUpControlStripStyleId = 'oss-move-create-button-style';
    if (!document.getElementById(moveUpControlStripStyleId)) {
      const moveUpControlStripStyle = document.createElement('style');
      moveUpControlStripStyle.id = moveUpControlStripStyleId;

      moveUpControlStripStyle.textContent += `
        .p-client_workspace__layout .p-control_strip[role="toolbar"]
        {
          display: none !important;
        }

        .p-control_strip
        {
          margin-top: 0px !important;
          position: relative;
        }

        .c-tabs__tab_content:first-child
        {
          padding-top: 0px !important;
        }

        .p-control_strip
        {
          padding: 0px !important;
        }
      `;

      document.body.appendChild(moveUpControlStripStyle);
    }

    const controlStripToolbar = document.querySelector(SELECTORS.controlStripToolbar);
    log(DEBUG, 'controlStripToolbar', controlStripToolbar);

    const controlStripToolbarId = 'oss-control-strip-toolbar-moved';
    document.getElementById(controlStripToolbarId)?.remove();
    controlStripToolbar.id = controlStripToolbarId;

    document.querySelector(SELECTORS.tabRail).appendChild(controlStripToolbar);

    // Wait for a new instance to appear, which happens on tab change
    await waitForElement(SELECTORS.controlStripToolbar);
    moveUpControlStrip();
  }

  function hideCreateButton() {
    log(VERBOSE, 'hideCreateButton()');

    const hideCreateButtonStyle = document.createElement('style');
    hideCreateButtonStyle.id = 'oss-hide-create-button-style';

    hideCreateButtonStyle.textContent += `
      [role="toolbar"] .p-control_strip__create_button
      {
        display: none !important;
      }
    `;

    document.body.appendChild(hideCreateButtonStyle);
  }

  function squareOffWorkspace() {
    log(VERBOSE, 'squareOffWorkspace()');

    const squareOffWorkspaceStyle = document.createElement('style');
    squareOffWorkspaceStyle.id = 'oss-expand-workspace-to-edge';

    squareOffWorkspaceStyle.textContent += `
      .p-client_workspace
      {
        padding: 0 !important;
      }

      .p-client_workspace__layout
      {
        border-radius: 0px !important;
        border-bottom: none !important;
        border-right: none !important;
      }

      .p-client_workspace__tabpanel
      {
        border-radius: 0px !important;
        border-left: none  !important;
        border-right: none !important;
      }

      .p-ia4_client .p-view_contents--primary,
      .p-ia4_client .p-view_contents--secondary,
      .p-ia4_client .p-view_contents--sidebar
      {
        max-height: 100% !important;
      }

      .p-client_workspace__layout
      {
        border-top-left-radius: 0 !important;
      }

      ${SELECTORS.tabRail}
      {
        border-top: 1px solid var(--dt_color-otl-ter) !important;
        padding-top: 15px;
      }

      .p-client_workspace__layout .p-control_strip[role="toolbar"]
      {
        padding-bottom: 15px !important;
      }
    `;

    document.body.appendChild(squareOffWorkspaceStyle);
  }

  function hideSidebar() {
    log(VERBOSE, 'hideSidebar()');

    const hideSidebarStyle = document.createElement('style');
    hideSidebarStyle.id = 'oss-hide-sidebar-style';

    hideSidebarStyle.textContent += `
      ${SELECTORS.tabRail}
      {
        display: none !important;
      }

      .p-client_workspace_wrapper
      {
        grid-template-columns: 0px auto !important;
      }

      .p-client_workspace__layout
      {
        border-left: none !important;
      }
    `;

    document.body.appendChild(hideSidebarStyle);
  }

  async function moveAvatar(avatarDiv = null) {
    log(VERBOSE, 'moveAvatar()');

    const moveAvatarStyleId = 'oss-move-avatar-style';
    if (!document.getElementById(moveAvatarStyleId)) {
      const moveAvatarStyle = document.createElement('style');
      moveAvatarStyle.id = moveAvatarStyleId;

      moveAvatarStyle.textContent += `
        .ReactModal__Content:has(.p-ia__main_menu__user),
        .ReactModal__Content:has(.p-control_strip__user_tooltip)
        {
          margin-top: 32px !important;
        }

        .p-ia__nav__user
        {
          display: flex;
        }

        .p-ia4_top_nav__right_container > div:nth-child(1)
        {
          margin-right: 5px;
        }

        .p-ia4_top_nav__right_container > div:nth-child(2),
        .p-ia__nav__user__avatar > span.c-base_icon__width_only_container > img,
        .p-ia__nav__user__avatar > span.c-base_icon__width_only_container
        {
          height: 28px !important;
        }

        .p-ia__nav__user__avatar > span.c-base_icon__width_only_container > img,
        .p-ia__nav__user__avatar > span.c-base_icon__width_only_container
        {
          width: 28px !important;
        }

        .p-ia__nav__user__avatar
        {
          height: 28px !important;
          width: 28px !important;
          --avatar-image-size: 28px !important;
        }

        .p-ia__nav__user__status_icon
        {
          width: 28px;
          height: 28px;
          padding: 0 0 0 6px;
          font-size: 14px;
          line-height: 16px;
          display: flex;
          position: relative;
          margin-right: -2px;
          text-align: center;
        }

        .p-control_strip__circle_button
        {
          background-color: transparent;
        }

        .p-ia__nav__user__status_icon .c-emoji--inline
        {
          position: static;
        }

        .p-ia__nav__user__status_icon
        {
          position: relative;
          background-color: transparent !important;
          margin-left: 4px !important;
        }

        .p-ia__nav__user__status_icon::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 35px;
          height: 100%;
          background-color: white;
          opacity: 0.25;
          border-radius: 8px 0px 0px 8px;
        }

        [aria-label="Control strip"][role="toolbar"] > div:nth-child(2)
        {
          display: none !important;
        }
      `;

      document.body.appendChild(moveAvatarStyle);
    }

    const avatarDivSelector = `${SELECTORS.controlStripToolbar} > div`;
    if (!avatarDiv) avatarDiv = await waitForElement(avatarDivSelector);

    const avatarId = 'oss-avatar-moved';
    document.getElementById(avatarId)?.remove();
    avatarDiv.id = avatarId;
    log(DEBUG, 'avatarDiv', avatarDiv);

    const rightNav = document.querySelector('.p-ia4_top_nav__right_container');
    rightNav.appendChild(avatarDiv);

    // Wait for a new instance to appear, which happens on tab change
    const newAvatarDiv = await waitForElement(avatarDivSelector);
    moveAvatar(newAvatarDiv);
  }

  function highlightWorkspaceSwitcher() {
    log(VERBOSE, 'highlightWorkspaceSwitcher()');

    const highlightWorkspaceSwitcherStyle = document.createElement('style');
    highlightWorkspaceSwitcherStyle.id = 'oss-highlight-workspace-switcher-style';

    highlightWorkspaceSwitcherStyle.textContent += `
      ${SELECTORS.tabRail}:has([data-qa="ellipsis-horizontal-filled"]) > div:first-child ${SELECTORS.workspaceSwitcher}
      {
        position: relative;
        height: 40px;
        width: 40px;
        border-radius: clamp(var(--dt_static_radius-base), min(22.222%, var(--dt_static_radius-xlarge)), var(--dt_static_radius-xlarge));
        box-shadow: 0px 0px 0px 2pt white;
      }

      ${SELECTORS.tabRail} > div:first-child ${SELECTORS.workspaceSwitcher}
      {
        position: relative;
        height: 28px;
        width: 28px;
        border-radius: clamp(var(--dt_static_radius-base), min(22.222%, var(--dt_static_radius-xlarge)), var(--dt_static_radius-xlarge));
        box-shadow: 0px 0px 0px 1.5pt white;
      }

      ${SELECTORS.tabRail} > div:first-child ${SELECTORS.workspaceSwitcher} i
      {
        margin: 2px;
      }
    `;

    document.body.appendChild(highlightWorkspaceSwitcherStyle);
  }

  function buildTabButton({ id, ariaLabel, svg, onClick }) {
    const outerDiv = document.createElement('div');
    outerDiv.id = id;
    outerDiv.classList.add('p-ia4_history_menu_button', 'oss-tab-button');

    const button = document.createElement('button');

    button.classList.add('c-button-unstyled', 'p-ia4_history_menu_button__button');
    button.setAttribute('data-qa', 'top-nav-history-menu');
    button.setAttribute('aria-label', ariaLabel);
    button.setAttribute('aria-disabled', 'false');
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('data-sk', 'tooltip_parent');
    button.type = 'button';
    button.tabIndex = 0;
    button.innerHTML = svg.outerHTML;
    button.addEventListener('click', onClick);

    outerDiv.appendChild(button);

    return outerDiv;
  }

  function addCreateWorkspaceButtonToNav(historyNavigationDiv) {
    log(VERBOSE, 'addCreateWorkspaceButtonToNav()');

    const historyNavigationFirstChild = historyNavigationDiv.firstChild;

    const id = 'oss-create-workspace-nav-tab';
    const name = 'Create workspace';
    const svg = document.querySelector('.p-control_strip__create_button__icon svg');
    const onClick = async () => {
      await openAddWorkspaceDiscretely();
    };

    const tabButtonParams = { id, name, svg, onClick };
    log(DEBUG, 'tabButtonParams', tabButtonParams);

    const tabButton = buildTabButton(tabButtonParams);
    historyNavigationDiv.insertBefore(tabButton, historyNavigationFirstChild);
  }

  function setModalOffsets() {
    log(VERBOSE, 'setModalOffsets()');

    const modalStyle = document.createElement('style');

    modalStyle.id = 'oss-modal-offsets-style';
    modalStyle.textContent += `
      .ReactModal__Content:has([aria-label="More"][role="menu"])
      {
        margin-top: 32px !important;
      }

      .ReactModal__Content:has(.p-team_switcher_menu)
      {
        margin-top: -50px !important;
        margin-left: 60px !important;
      }

      .ReactModal__Content:has([aria-label="More"][role="menu"]) .p-more_menu__container
      {
        max-height: 85vh;
      }
    `;

    document.body.appendChild(modalStyle);
  }

  function processTabUpdates({ tabListDiv, historyNavigationDiv, workspaceCount }) {
    log(VERBOSE, 'processTabUpdates()');

    const tabButtonsStyle = document.createElement('style');
    tabButtonsStyle.id = 'oss-tab-buttons-style';

    const tabButtonHiddenClass = 'oss-tab-button-hidden';
    tabButtonsStyle.textContent = `
      .${tabButtonHiddenClass}
      {
        display: none !important;
      }

      .oss-tab-button
      {
        margin-left: 4px !important;
        margin-right: 0px !important;
      }

      .oss-tab-button:first-child
      {
        margin-left: 7px !important;
      }
    `;

    document.head.appendChild(tabButtonsStyle);

    // Find the first child before inserts occur
    const historyNavigationFirstChild = historyNavigationDiv.firstChild;
    let tabsHiddenCount = 0;

    let hiddenHomeButton = null;

    for (let tab of tabListDiv.children) {
      log(DEBUG, 'tab', tab);

      const label = tab.querySelector('.p-tab_rail__button__label');
      const name = label?.innerText;

      if (!name) {
        log(INFO, 'Could not retrieve name of tab', tab);
        continue;
      }

      const tabConfig = CONFIG.sidebar.tabs[name?.toLowerCase()];
      log(DEBUG, 'tabConfig', tabConfig);

      if (!tabConfig) {
        log(INFO, 'Not creating nav button for tab', name);
        continue;
      } else {
        let hideButton = false;

        if (
          name === 'Home' &&
          (
            CONFIG.sidebar.tabs.home.createNavButtonOnSearch ||
            (
              workspaceCount <= 1 &&
              CONFIG.sidebar.ifOneWorkspace.homeTab.createNavButtonOnSearch
            )
          )
        ) {
          hideButton = true;
        }

        if (tabConfig.hide) {
          tab.classList.add(tabButtonHiddenClass);
          tabsHiddenCount++;
        }

        if (!tabConfig.createNavButton && !hideButton) continue;

        const id = `oss-${name}-nav-tab`;
        const svg = tab.querySelector('svg');

        // Watch for svg changes to reflect the selected tab
        const observer = new MutationObserver(() => {
          document.querySelector(`#${id} svg`).innerHTML = svg.outerHTML;
        });
        observer.observe(svg, { childList: true, subtree: true });

        const ariaLabel = tab.tagName === 'BUTTON' ? tab.ariaLabel : tab.querySelector('button').ariaLabel;
        const buttonSelector = `${SELECTORS.tabRail} button[aria-label="${ariaLabel}"]`;
        const onClick = () => {
          log(VERBOSE, 'buttonSelector', buttonSelector);
          document.querySelector(buttonSelector).click();
        };

        const tabButtonParams = { id, name, svg, onClick };
        log(DEBUG, 'tabButtonParams', tabButtonParams);

        const tabButton = buildTabButton(tabButtonParams);
        if (hideButton) {
          const setDisplay = () => {
            log(VERBOSE, 'setDisplay()');

            const searching = window.location.href.includes('/search');
            const visibility = searching ? 'visible' : 'hidden';
            tabButton.style.visibility = visibility;
          };

          setDisplay();

          const observer = new MutationObserver((mutations) => {
            mutations.forEach(function(mutation) {
              if (mutation.type === 'childList' || mutation.type === 'characterData') setDisplay();
            });
          });

          observer.observe(document.body, { childList: true, subtree: true, characterData: true });

          hiddenHomeButton = tabButton;
        } else {
          historyNavigationDiv.insertBefore(tabButton, historyNavigationFirstChild);
        }
      }

      // Add the hidden home button to the end since it's displayed but not visible
      if (hiddenHomeButton) historyNavigationDiv.insertBefore(hiddenHomeButton, historyNavigationFirstChild);
    }

    let allTabsHidden = tabsHiddenCount === tabListDiv.children.length;
    log(DEBUG, 'tabsHiddenCount', tabsHiddenCount);
    log(DEBUG, 'tabListDiv.children.length', tabListDiv.children.length);
    log(DEBUG, 'allTabsHidden', allTabsHidden);

    if (allTabsHidden) tabButtonsStyle.textContent += `${SELECTORS.tabRail} > div:nth-child(2) { display: none !important; }`;
  }

  async function applyCustomizations() {
    log(VERBOSE, 'applyCustomizations()');

    if (CONFIG.workspace.squareOff) squareOffWorkspace();
    if (CONFIG.sidebar.hide) hideSidebar();
    if (CONFIG.sidebar.workspaceSwitcher.highlight) highlightWorkspaceSwitcher();

    const tabListDiv = await waitForElement('div.p-tab_rail__tab_menu[role="tablist"]');
    const historyNavigationDiv = await waitForElement('div[aria-label="History Navigation"]');

    const workspaceCount = await getWorkspaceCount();
    processTabUpdates({ tabListDiv, historyNavigationDiv, workspaceCount });

    if (!CONFIG.sidebar.hide) {
      let sidebarHidden = false;

      log(DEBUG, 'workspaceCount', workspaceCount);

      if (workspaceCount <= 1) {
        if (CONFIG.sidebar.ifOneWorkspace.hideSidebar) {
          hideSidebar();
          sidebarHidden = true;
        }

        if (CONFIG.sidebar.ifOneWorkspace.addWorkspaceButton.createNavButton) {
          addCreateWorkspaceButtonToNav(historyNavigationDiv);
        }
      }

      if (!sidebarHidden) {
        if (CONFIG.sidebar.workspaceSwitcher.clickToGoHome) updateWorkspaceToGoHome();
        if (CONFIG.sidebar.workspaceSwitcher.addOtherWorkspaceButtons) addWorkspaceButtons();
      }

      if (CONFIG.controlStrip.createButton.hide) hideCreateButton();
      if (CONFIG.controlStrip.moveUp) moveUpControlStrip();
    }

    if (CONFIG.controlStrip.avatar.moveToNav) moveAvatar();

    setModalOffsets();

    log(QUIET, 'Finished');
  }

  void applyCustomizations();
})();
