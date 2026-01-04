// ==UserScript==
// @name        LinkedIn Tool
// @namespace   dalgoda@gmail.com
// @match       https://www.linkedin.com/*
// @noframes
// @version     5.97
// @author      Mike Castle
// @description Minor enhancements to LinkedIn. Mostly just hotkeys.
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// @supportURL  https://github.com/nexushoratio/userscripts/blob/main/linkedin-tool.md
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://update.greasyfork.org/scripts/478188/1299734/NH_xunit.js
// @require     https://update.greasyfork.org/scripts/477290/1333365/NH_base.js
// @require     https://update.greasyfork.org/scripts/478349/1284417/NH_userscript.js
// @require     https://update.greasyfork.org/scripts/478440/1304193/NH_web.js
// @require     https://update.greasyfork.org/scripts/478676/1310174/NH_widget.js
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/472097/LinkedIn%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/472097/LinkedIn%20Tool.meta.js
// ==/UserScript==

/* global VM */

// eslint-disable-next-line max-lines-per-function
(async () => {
  'use strict';

  const NH = window.NexusHoratio.base.ensure([
    {name: 'xunit', minVersion: 51},
    {name: 'base', minVersion: 52},
    {name: 'userscript', minVersion: 5},
    {name: 'web', minVersion: 6},
    {name: 'widget', minVersion: 27},
  ]);

  /**
   * Load options from storage.
   *
   * TODO: Over engineer this into having a schema that could be used for
   * building an edit widget.
   *
   * Saved options will be augmented by any new defaults and resaved.
   * @returns {object} - Options key/value pairs.
   */
  async function loadOptions() {
    const defaultOptions = {
      enableDevMode: false,
      enableScrollerChangesFocus: false,
      enableIssue241ClickMethod: false,
      enableIssue244Changes: false,
      fakeErrorRate: 0.8,
    };
    const savedOptions = await NH.userscript.getValue('Options', {});
    const options = {
      ...defaultOptions,
      ...savedOptions,
    };
    NH.userscript.setValue('Options', options);
    return options;
  }

  const litOptions = await loadOptions();
  NH.xunit.testing.enabled = litOptions.enableDevMode;

  /* eslint-disable require-atomic-updates */
  NH.base.Logger.configs = await NH.userscript.getValue('Logger');
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'hidden') {
      await NH.userscript.setValue('Logger', NH.base.Logger.configs);
    }
    if (document.visibilityState === 'visible') {
      NH.base.Logger.configs = await NH.userscript.getValue('Logger');
    }
  });
  /* eslint-enable */

  // TODO(#145): The if test is just here while developing.
  if (!litOptions.enableDevMode) {
    NH.base.Logger.config('Default').enabled = true;
  }

  const log = new NH.base.Logger('Default');

  const globalKnownIssues = [
    ['Bob', 'Bob has no issues'],
    ['', 'Minor internal improvement'],
    ['#106', 'info view: more tabs: News, License'],
    ['#130', 'Factor hotkey handling out of SPA'],
    ['#156', 'Support <b>Profile</b> view'],
    [
      '#157', '<b>InvitationManager</b>: Invite not scrolling into ' +
        'view upon refresh',
    ],
    ['#160', 'Support direct <b>JobView</b>'],
    ['#167', 'Refactor into libraries'],
    [
      '#169', '<b>JobCollections</b>: reading the details pane is ' +
     'cumbersome',
    ],
    [
      '#208', '<code>Scroller</code>: If end-item is never viewable ' +
     '(e.g., empty), cannot wrap',
    ],
    ['#209', 'Support <b>SearchResultsPeople</b> view'],
    [
      '#218', 'So some <code>Page</code> instances need to be reset on ' +
        'revisit anyway?',
    ],
    [
      '#229', '<b>Jobs<b>: <em>Recent job searches</em> is ' +
        'not scrolling properly',
    ],
    [
      '#230', '<b>JobCollections</b>: first/last never gets a ' +
        'chance to work on job cards',
    ],
    ['#231', '<b>JobCollections</b>: Support delete/next type navigation'],
    ['#232', '<code>Scroller</code>: Change the focus UX'],
    ['#233', 'Support <b>Invitation Manager Sent Invites</b>'],
    ['#236', 'Support <b>Events</b> page'],
    ['#240', '<code>Scroller</code>: navbar height can change'],
    ['#242', 'Need to reconnect the LIT menu on certain pages'],
    ['#245', 'Revisit pages that use the terms "section{,s}" or "card{,s}"'],
    ['#253', 'Support <b>My Network Events</b> page'],
    ['#255', 'Support <b>Search appearances</b> page'],
    ['#256', 'Support <b>Verify</b> page'],
    ['#257', 'Support <b>Analytics & tools</b> page'],
  ];

  const globalNewsContent = [
    {
      date: '2024-02-26',
      issues: ['#240'],
      subject: 'Move <code>Scroller</code> assignment from ctor to setter',
    },
    {
      date: '2024-02-25',
      issues: ['#240'],
      subject: 'Use a setter to assign the managed <code>Scroller</code>',
    },
    {
      date: '2024-02-25',
      issues: ['#240'],
      subject: 'Use optional chaining with <code>this.#scroller</code>',
    },
    {
      date: '2024-02-22',
      issues: ['#255', '#256', '#257'],
      subject: 'Acknowledge a number a newly discovered pages',
    },
    {
      date: '2024-02-15',
      issues: ['#253'],
      subject: 'Acknowledge <em>My Network Events</em> page',
    },
    {
      date: '2024-02-15',
      issues: ['#236'],
      subject: 'Implement <kbd><kbd>S</kbd></kbd>hare current event',
    },
    {
      date: '2024-02-15',
      issues: ['#236'],
      subject: 'Support the <em>Your events</em> collection',
    },
    {
      date: '2024-02-14',
      issues: ['#167'],
      subject: 'Migrate to using <code>Service()</code> from lib/base',
    },
    {
      date: '2024-02-13',
      issues: ['#240'],
      subject: 'Allow changing top/bottom margins in <code>Scroller</code>',
    },
    {
      date: '2024-02-12',
      issues: ['#236'],
      subject: 'Implement <kbd><kbd>n</kbd></kbd>/<kbd><kbd>p</kbd></kbd> ' +
        'secondary navigation within collections',
    },
    {
      date: '2024-02-12',
      issues: ['#167'],
      subject: 'Bump version of lib/base.js being used',
    },
    {
      date: '2024-02-11',
      issues: ['#245'],
      subject: 'Rework <em>My Network</em> to use the terms ' +
        '<em>collection</em> and <em>individual</em>',
    },
    {
      date: '2024-02-10',
      issues: ['#167'],
      subject: 'Migrate <code>Service</code> to lib/base',
    },
    {
      date: '2024-02-09',
      issues: ['#236'],
      subject: 'Support primary navigation',
    },
    {
      date: '2024-02-07',
      issues: ['#242'],
      subject: 'Wait for the <em>For Business</em> menu item to show up',
    },
    {
      date: '2024-02-07',
      issues: ['#240'],
      subject: 'Attach a <code>ResizeObserver</code> to the global nav bar',
    },
    {
      date: '2024-02-05',
      issues: ['#236'],
      subject: 'Initial <code>Events</code> support',
    },
  ];

  /**
   * Implement HTML for a tabbed user interface.
   *
   * This version uses radio button/label pairs to select the active panel.
   *
   * @example
   * const tabby = new TabbedUI('Tabby Cat');
   * document.body.append(tabby.container);
   * tabby.addTab(helpTabDefinition);
   * tabby.addTab(docTabDefinition);
   * tabby.addTab(contactTabDefinition);
   * tabby.goto(helpTabDefinition.name);  // Set initial tab
   * tabby.next();
   * const entry = tabby.tabs.get(contactTabDefinition.name);
   * entry.classList.add('random-css');
   * entry.innerHTML += '<p>More contact info.</p>';
   */
  class TabbedUI {

    /**
     * @param {string} name - Used to distinguish HTML elements and CSS
     * classes.
     */
    constructor(name) {
      this.#log = new NH.base.Logger(`TabbedUI ${name}`);
      this.#name = name;
      this.#idName = NH.base.safeId(name);
      this.#id = NH.base.uuId(this.#idName);
      this.#container = document.createElement('section');
      this.#container.id = `${this.#id}-container`;
      this.#installControls();
      this.#container.append(this.#nav);
      this.#installStyle();
      this.#log.log(`${this.#name} constructed`);
    }

    /** @type {Element} */
    get container() {
      return this.#container;
    }

    /**
     * @typedef {object} TabEntry
     * @property {string} name - Tab name.
     * @property {Element} label - Tab label, so CSS can be applied.
     * @property {Element} panel - Tab panel, so content can be updated.
     */

    /** @type {Map<string,TabEntry>} */
    get tabs() {
      const entries = new Map();
      for (const label of this.#nav.querySelectorAll(
        ':scope > label[data-tabbed-name]'
      )) {
        entries.set(label.dataset.tabbedName, {label: label});
      }
      for (const panel of this.container.querySelectorAll(
        `:scope > .${this.#idName}-panel`
      )) {
        entries.get(panel.dataset.tabbedName).panel = panel;
      }
      return entries;
    }

    /**
     * A string of HTML or a prebuilt Element.
     * @typedef {(string|Element)} TabContent
     */

    /**
     * @typedef {object} TabDefinition
     * @property {string} name - Tab name.
     * @property {TabContent} content - Initial content.
     */

    /** @param {TabDefinition} tab - The new tab. */
    addTab(tab) {
      const me = 'addTab';
      this.#log.entered(me, tab);

      const {
        name,
        content,
      } = tab;
      const idName = NH.base.safeId(name);
      const input = this.#createInput(name, idName);
      const label = this.#createLabel(name, input, idName);
      const panel = this.#createPanel(name, idName, content);
      input.addEventListener('change', this.#onChange.bind(this, panel));
      this.#nav.before(input);
      this.#navSpacer.before(label);
      this.container.append(panel);

      const inputChecked =
            `#${this.container.id} > ` +
            `input[data-tabbed-name="${name}"]:checked`;
      this.#style.textContent +=
        `${inputChecked} ~ nav > [data-tabbed-name="${name}"] {` +
        ' border-bottom: 3px solid black;' +
        '}\n';
      this.#style.textContent +=
        `${inputChecked} ~ div[data-tabbed-name="${name}"] {` +
        ' display: flex;' +
        '}\n';

      this.#log.leaving(me);
    }

    /** Activate the next tab. */
    next() {
      const me = 'next';
      this.#log.entered(me);

      this.#switchTab(1);

      this.#log.leaving(me);
    }

    /** Activate the previous tab. */
    prev() {
      const me = 'prev';
      this.#log.entered(me);

      this.#switchTab(-1);

      this.#log.leaving(me);
    }

    /** @param {string} name - Name of the tab to activate. */
    goto(name) {
      const me = 'goto';
      this.#log.entered(me, name);

      const controls = this.#getTabControls();
      const control = controls.find(item => item.dataset.tabbedName === name);
      control.click();

      this.#log.leaving(me);
    }

    #container
    #id
    #idName
    #log
    #name
    #nav
    #navSpacer
    #nextButton
    #prevButton
    #style

    /** Installs basic CSS styles for the UI. */
    #installStyle = () => {
      this.#style = document.createElement('style');
      this.#style.id = `${this.#id}-style`;
      const styles = [
        `#${this.container.id} {` +
          ' flex-grow: 1; overflow-y: hidden; display: flex;' +
          ' flex-direction: column;' +
          '}',
        `#${this.container.id} > input { display: none; }`,
        `#${this.container.id} > nav { display: flex; flex-direction: row; }`,
        `#${this.container.id} > nav button { border-radius: 50%; }`,
        `#${this.container.id} > nav > label {` +
          ' cursor: pointer;' +
          ' margin-top: 1ex; margin-left: 1px; margin-right: 1px;' +
          ' padding: unset; color: unset !important;' +
          '}',
        `#${this.container.id} > nav > .spacer {` +
          ' margin-left: auto; margin-right: auto;' +
          ' border-right: 1px solid black;' +
          '}',
        `#${this.container.id} label::before { all: unset; }`,
        `#${this.container.id} label::after { all: unset; }`,
        // Panels are both flex items AND flex containers.
        `#${this.container.id} .${this.#idName}-panel {` +
          ' display: none; overflow-y: auto; flex-grow: 1;' +
          ' flex-direction: column;' +
          '}',
        '',
      ];
      this.#style.textContent = styles.join('\n');
      document.head.prepend(this.#style);
    }

    /**
     * Get the tab controls currently in the container.
     * @returns {Element[]} - Control elements for the tabs.
     */
    #getTabControls = () => {
      const controls = Array.from(this.container.querySelectorAll(
        ':scope > input'
      ));
      return controls;
    }

    /**
     * Switch to an adjacent tab.
     * @param {number} direction - Either 1 or -1.
     * @fires Event#change
     */
    #switchTab = (direction) => {
      const me = 'switchTab';
      this.#log.entered(me, direction);

      const controls = this.#getTabControls();
      this.#log.log('controls:', controls);
      let idx = controls.findIndex(item => item.checked);
      if (idx === NH.base.NOT_FOUND) {
        idx = 0;
      } else {
        idx = (idx + direction + controls.length) % controls.length;
      }
      controls[idx].click();

      this.#log.leaving(me);
    }

    /**
     * @param {string} name - Human readable name for tab.
     * @param {string} idName - Normalized to be CSS class friendly.
     * @returns {Element} - Input portion of the tab.
     */
    #createInput = (name, idName) => {
      const me = 'createInput';
      this.#log.entered(me);

      const input = document.createElement('input');
      input.id = `${this.#idName}-input-${idName}`;
      input.name = `${this.#idName}`;
      input.dataset.tabbedId = `${this.#idName}-input-${idName}`;
      input.dataset.tabbedName = name;
      input.type = 'radio';

      this.#log.leaving(me, input);
      return input;
    }

    /**
     * @param {string} name - Human readable name for tab.
     * @param {Element} input - Input element associated with this label.
     * @param {string} idName - Normalized to be CSS class friendly.
     * @returns {Element} - Label portion of the tab.
     */
    #createLabel = (name, input, idName) => {
      const me = 'createLabel';
      this.#log.entered(me);

      const label = document.createElement('label');
      label.dataset.tabbedId = `${this.#idName}-label-${idName}`;
      label.dataset.tabbedName = name;
      label.htmlFor = input.id;
      label.innerText = `[${name}]`;

      this.#log.leaving(me, label);
      return label;
    }

    /**
     * @param {string} name - Human readable name for tab.
     * @param {string} idName - Normalized to be CSS class friendly.
     * @param {TabContent} content - Initial content.
     * @returns {Element} - Panel portion of the tab.
     */
    #createPanel = (name, idName, content) => {
      const me = 'createPanel';
      this.#log.entered(me);

      const panel = document.createElement('div');
      panel.dataset.tabbedId = `${this.#idName}-panel-${idName}`;
      panel.dataset.tabbedName = name;
      panel.classList.add(`${this.#idName}-panel`);
      if (content instanceof Element) {
        panel.append(content);
      } else {
        panel.innerHTML = content;
      }

      this.#log.leaving(me, panel);
      return panel;
    }

    /**
     * Event handler for change events.  When the active tab changes, this
     * will resend an 'expose' event to the associated panel.
     * @param {Element} panel - The panel associated with this tab.
     * @param {Event} evt - The original change event.
     * @fires Event#expose
     */
    #onChange = (panel, evt) => {
      const me = 'onChange';
      this.#log.entered(me, evt, panel);

      panel.dispatchEvent(new Event('expose'));

      this.#log.leaving(me);
    }

    /** Installs navigational control elements. */
    #installControls = () => {
      this.#nav = document.createElement('nav');
      this.#nav.id = `${this.#id}-controls`;
      this.#navSpacer = document.createElement('span');
      this.#navSpacer.classList.add('spacer');
      this.#prevButton = document.createElement('button');
      this.#nextButton = document.createElement('button');
      this.#prevButton.innerText = '←';
      this.#nextButton.innerText = '→';
      this.#prevButton.dataset.name = 'prev';
      this.#nextButton.dataset.name = 'next';
      this.#prevButton.addEventListener('click', () => this.prev());
      this.#nextButton.addEventListener('click', () => this.next());
      // XXX: Cannot get 'button' elements to style nicely, so cheating by
      // wrapping them in a label.
      const prevLabel = document.createElement('label');
      const nextLabel = document.createElement('label');
      prevLabel.append(this.#prevButton);
      nextLabel.append(this.#nextButton);
      this.#nav.append(this.#navSpacer, prevLabel, nextLabel);
    }

  }

  /**
   * An ordered collection of HTMLElements for a user to continuously scroll
   * through.
   *
   * The dispatcher can be used the handle the following events:
   * - 'out-of-range' - Scrolling went past one end of the collection.  This
   *   is NOT an error condition, but rather a design feature.
   * - 'change' - The value of item has changed.
   * - 'activate' - The Scroller was activated.
   * - 'deactivate' - The Scroller was deactivated.
   */
  class Scroller {

    /**
     * Function that generates a, preferably, reproducible unique identifier
     * for an Element.
     * @callback uidCallback
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */

    /**
     * Contains CSS selectors to first find a base element, then items that it
     * contains.
     * @typedef {object} ContainerItemsSelector
     * @property {string} container - CSS selector to find the container
     * element.
     * @property {string} items - CSS selector to find the items inside the
     * container.
     */

    /**
     * Function that finds an DOM element based upon another one.
     *
     * Useful for cases where CSS selectors are not sufficient.
     * @callback ElementFinder
     * @param {HTMLElement} element - Starting point.
     * @returns {HTMLElement} - Found element.
     */

    /**
     * Common config for finding a clickable element inside the current item.
     *
     * This essentially configures a call to {@link NH.web.clickElement}.
     * @typedef {object} ClickConfig
     * @property {string[]} selectorArray - CSS selectors to use to find an
     * element.
     * @property {boolean} [matchSelf=false] - If a CSS selector would match
     * base, then use it.
     */

    /**
     * There are two ways to describe what elements go into a Scroller:
     * 1. An explicit container (base) element and selectors stemming from it.
     * 2. An array of ContainerItemsSelector that can allow for multiple
     *   containers with items.  This approach will also allow the Scroller to
     *   automatically wait for all container elements to exist during
     *   activation.
     * @typedef {object} What
     * @property {string} name - Name for this scroller, used for logging.
     * @property {Element} base - The container to use as a base for selecting
     * elements.
     * @property {string[]} selectors - Array of CSS selectors to find
     * elements to collect, calling base.querySelectorAll().
     * @property {ContainerItemsSelector[]} containerItems - Array of
     * ContainerItemsSelectors.
     */

    /**
     * @typedef {object} How
     * @property {uidCallback} uidCallback - Callback to generate a uid.
     * @property {string[]} [classes=[]] - Array of CSS classes to add/remove
     * from an element as it becomes current.
     * @property {boolean} [handleClicks=true] - Whether the scroller should
     * watch for clicks and if one is inside an item, select it.
     * @property {boolean} [autoActivate=false] - Whether to call the activate
     * method at the end of construction.
     * @property {boolean} [snapToTop=false] - Whether items should snap to
     * the top of the window when coming into view.
     * @property {number} [topMarginPixels=0] - Used to determine if scrolling
     * should happen when {snapToTop} is false.
     * @property {number} [bottomMarginPixels=0] - Used to determine if
     * scrolling should happen when {snapToTop} is false.
     * @property {string} [topMarginCSS='0'] - CSS applied to
     * `scrollMarginTop`.
     * @property {string} [bottomMarginCSS='0'] - CSS applied to
     * `scrollMarginBottom`.
     * @property {number} [waitForItemTimeout=3000] - Time to wait, in
     * milliseconds, for existing item to reappear upon reactivation.
     * @property {number} [containerTimeout=0] - Time to wait, in
     * milliseconds, for a {ContainerItemsSelector.container} to show up.
     * Some pages may not always provide all identified containers.  The
     * default of 0 disables timing out.  NB: Any containers that timeout will
     * not handle further activate() processing, such as handleClicks.
     * @property {ElementFinder|ClickConfig} [clickConfig=null] - Configures
     * how the click() method operates.
     */

    /**
     * @param {What} what - What we want to scroll.
     * @param {How} how - How we want to scroll.
     * @throws {Scroller.Exception} - On many construction problems.
     */
    constructor(what, how) {
      const WAIT_FOR_ITEM = 3000;

      ({
        name: this.#name = 'Unnamed scroller',
        base: this.#base,
        selectors: this.#selectors,
        containerItems: this.#containerItems = [],
      } = what);
      ({
        uidCallback: this.#uidCallback,
        classes: this.#classes = [],
        handleClicks: this.#handleClicks = true,
        autoActivate: this.#autoActivate = false,
        snapToTop: this.#snapToTop = false,
        topMarginPixels: this.#topMarginPixels = 0,
        bottomMarginPixels: this.#bottomMarginPixels = 0,
        topMarginCSS: this.#topMarginCSS = '0',
        bottomMarginCSS: this.#bottomMarginCSS = '0',
        waitForItemTimeout: this.#waitForItemTimeout = WAIT_FOR_ITEM,
        containerTimeout: this.#containerTimeout = 0,
        clickConfig: this.#clickConfig = null,
      } = how);

      this.#validateInstance();

      this.#mutationObserver = new MutationObserver(this.#mutationHandler);

      this.#logger = new NH.base.Logger(`{${this.#name}}`);
      this.logger.log('Scroller constructed', this);

      if (this.#autoActivate) {
        this.activate();
      }
    }

    static Exception = class extends NH.base.Exception {}

    /** @type {NH.base.Dispatcher} */
    get dispatcher() {
      return this.#dispatcher;
    }

    /** @type {Element} - Represents the current item. */
    get item() {
      const me = 'get item';
      this.logger.entered(me);

      if (this.#destroyed) {
        const msg = `Tried to work with destroyed ${Scroller.name} ` +
              `on ${this.#base}`;
        this.logger.log(msg);
        throw new Error(msg);
      }
      const items = this.#getItems();
      let item = items.find(this.#matchItem);
      if (!item) {
        // We couldn't find the old id, so maybe it was rebuilt.  Make a guess
        // by trying the old index.
        const idx = this.#historicalIdToIndex.get(this.#currentItemId);
        if (typeof idx === 'number' && (0 <= idx && idx < items.length)) {
          item = items[idx];
          this.#bottomHalf(item);
        }
      }

      this.logger.leaving(me, item);
      return item;
    }

    /** @param {Element} val - Set the current item. */
    set item(val) {
      const me = 'set item';
      this.logger.entered(me, val);

      this.dull();
      this.#bottomHalf(val);

      this.logger.leaving(me);
    }

    /** @type {string} - Current item's uid. */
    get itemUid() {
      return this.#currentItemId;
    }

    /** @type {NH.base.Logger} */
    get logger() {
      return this.#logger;
    }

    /** @type {string} */
    get name() {
      return this.#name;
    }

    /**
     * @param {number} [pixels=0] - Used to determine if scrolling should
     * happen when {snapToTop} is false.
     * @returns {Scroller} - This instance, for chaining.
     */
    topMarginPixels(pixels = 0) {
      this.#topMarginPixels = pixels;
      return this;
    }

    /**
     * @param {number} [pixels=0] - Used to determine if scrolling should
     * happen when {snapToTop} is false.
     * @returns {Scroller} - This instance, for chaining.
     */
    bottomMarginPixels(pixels = 0) {
      this.#bottomMarginPixels = pixels;
      return this;
    }

    /**
     * @param {string} [css='0'] - CSS applied to `scrollMarginTop`.
     * @returns {Scroller} - This instance, for chaining.
     */
    topMarginCSS(css = '0') {
      this.#topMarginCSS = css;
      return this;
    }

    /**
     * @param {string} [css='0'] - CSS applied to `scrollMarginBottom`.
     * @returns {Scroller} - This instance, for chaining.
     */
    bottomMarginCSS(css = '0') {
      this.#bottomMarginCSS = css;
      return this;
    }

    /** Click either the current item OR document.activeElement. */
    click() {
      const me = 'click';
      const item = this.item;
      this.logger.entered(me, item);

      if (item) {
        if (this.#clickConfig instanceof Function) {
          const result = this.#clickConfig(item);
          if (result) {
            result.click();
          } else {
            NH.web.postInfoAboutElement(item,
              `the clickConfig function for ${this.name}`);
          }
        } else if (this.#clickConfig) {
          if (!NH.web.clickElement(
            item,
            this.#clickConfig.selectorArray,
            this.#clickConfig.matchSelf
          )) {
            NH.web.postInfoAboutElement(item,
              `the clickConfig selectorArray for ${this.name}`);
          }
        } else {
          NH.base.issues.post(`Scroller.click() for "${this.name}" was ` +
                            'called without a configuration');
        }
      } else {
        document.activeElement.click();
      }

      this.logger.leaving(me);
    }

    /** Move to the next item in the collection. */
    next() {
      this.#scrollBy(1);
    }

    /** Move to the previous item in the collection. */
    prev() {
      this.#scrollBy(-1);
    }

    /** Jump to the first item in the collection. */
    first() {
      this.#jumpToEndItem(true);
    }

    /** Jump to last item in the collection. */
    last() {
      this.#jumpToEndItem(false);
    }

    /**
     * Move to a specific item if possible.
     * @param {Element} item - Item to go to.
     */
    goto(item) {
      this.item = item;
    }

    /**
     * Move to a specific item if possible, by uid.
     * @param {string} uid - The uid of a specific item.
     * @returns {boolean} - Was able to goto the item.
     */
    gotoUid(uid) {
      const me = 'gotoUid';
      this.logger.entered(me, uid);

      const items = this.#getItems();
      const item = items.find(el => uid === this.#uid(el));
      let success = false;
      if (item) {
        this.item = item;
        success = true;
      }

      this.logger.leaving(me, success, item);
      return success;
    }

    /** Adds the registered CSS classes to the current element. */
    shine() {
      this.item?.classList.add(...this.#classes);
    }

    /** Removes the registered CSS classes from the current element. */
    dull() {
      this.item?.classList.remove(...this.#classes);
    }

    /** Bring current item back into view. */
    show() {
      this.#scrollToCurrentItem();
    }

    /** Focus on current item. */
    focus() {
      const me = 'focus';
      this.logger.entered(me, litOptions.enableScrollerChangesFocus);

      this.shine();
      this.show();

      if (litOptions.enableScrollerChangesFocus) {
        this.logger.log('focusing', this.item);
        NH.web.focusOnElement(this.item);
      }

      this.logger.leaving(me, 'current focus:', document.activeElement);
    }

    /**
     * Activate the scroller.
     * @fires 'out-of-range'
     */
    async activate() {
      const me = 'activate';
      this.logger.entered(me);

      const containers = new Set(
        Array.from(await this.#waitForContainers())
          .filter(x => x)
      );
      if (this.#base) {
        containers.add(this.#base);
      }

      const watcher = this.#currentItemWatcher();

      for (const container of containers) {
        if (this.#handleClicks) {
          this.#onClickElements.add(container);
          container.addEventListener('click',
            this.#onClick,
            this.#clickOptions);
        }
        this.#mutationObserver.observe(container,
          {childList: true, subtree: true});
      }

      this.logger.log('watcher:', await watcher);
      this.#mutationDispatcher.on('records', this.#monitorConnectedness);

      this.dispatcher.fire('activate', null);

      this.logger.leaving(me);
    }

    /**
     * Deactivate the scroller (but do not destroy it).
     * @fires 'out-of-range'
     */
    deactivate() {
      this.#mutationDispatcher.off('records', this.#monitorConnectedness);
      this.#mutationObserver.disconnect();
      for (const container of this.#onClickElements) {
        container.removeEventListener('click',
          this.#onClick,
          this.#clickOptions);
      }
      this.#onClickElements.clear();
      this.dispatcher.fire('deactivate', null);
    }

    /** Mark instance as inactive and do any internal cleanup. */
    destroy() {
      const me = 'destroy';
      this.logger.entered(me);

      this.deactivate();
      this.item = null;
      this.#destroyed = true;

      this.logger.leaving(me);
    }

    /**
     * Determines if the item can be viewed.  Usually this means the content
     * is being loaded lazily and is not ready yet.
     * @param {Element} item - The item to inspect.
     * @returns {boolean} - Whether the item has viewable content.
     */
    static #isItemViewable(item) {
      return Boolean(item.clientHeight && item.innerText.length);
    }

    #autoActivate
    #base
    #bottomMarginCSS
    #bottomMarginPixels
    #classes
    #clickConfig
    #clickOptions = {capture: true};
    #containerItems
    #containerTimeout
    #currentItem = null;
    #currentItemId = null;
    #destroyed = false;

    #dispatcher = new NH.base.Dispatcher(
      'change', 'out-of-range', 'activate', 'deactivate'
    );

    #handleClicks
    #historicalIdToIndex = new Map();
    #logger
    #mutationDispatcher = new NH.base.Dispatcher('records');
    #mutationObserver
    #name
    #onClickElements = new Set();
    #selectors
    #snapToTop
    #stackTrace
    #topMarginCSS
    #topMarginPixels
    #uidCallback
    #waitForItemTimeout

    /**
     * If an item is clicked, switch to it.
     * @param {Event} evt - Standard 'click' event.
     */
    #onClick = (evt) => {
      const me = 'onClick';
      this.logger.entered(me, evt);

      for (const item of this.#getItems()) {
        if (item.contains(evt.target)) {
          this.logger.log('found:', item);
          if (item !== this.item) {
            this.item = item;
          }
        }
      }

      this.logger.leaving(me);
    }

    /** @param {MutationRecord[]} records - Standard mutation records. */
    #mutationHandler = (records) => {
      const me = 'mutationHandler';
      this.logger.entered(
        me, `records: ${records.length} type: ${records[0].type}`
      );

      this.#mutationDispatcher.fire('records', null);

      this.logger.leaving(me);
    }

    /**
     * Since the getter will try to validate the current item (since it could
     * have changed out from under us), it too can update information.
     * @param {Element} val - Element to make current.
     */
    #bottomHalf = (val) => {
      const me = 'bottomHalf';
      this.logger.entered(me, val);

      this.#currentItem = val;
      this.#currentItemId = this.#uid(val);
      const idx = this.#getItems()
        .indexOf(val);
      this.#historicalIdToIndex.set(this.#currentItemId, idx);
      this.focus();
      this.dispatcher.fire('change', {});

      this.logger.leaving(me);
    }

    /**
     * Builds the list of elements using the registered CSS selectors.
     * @returns {Elements[]} - Items to scroll through.
     */
    #getItems = () => {
      const me = 'getItems';
      this.logger.entered(me);

      const items = [];
      if (this.#base) {
        for (const selector of this.#selectors) {
          this.logger.log(`considering ${selector}`);
          items.push(...this.#base.querySelectorAll(selector));
        }
      } else {
        for (const {container, items: selector} of this.#containerItems) {
          this.logger.log(`considering ${container} with ${selector}`);
          const base = document.querySelector(container);
          if (base) {
            items.push(...base.querySelectorAll(selector));
          }
        }
      }
      this.#postProcessItems(items);

      this.logger.leaving(me);
      return items;
    }

    /**
     * Log items and do any fixups on them.
     * @param {[Element]} items - Elements in the Scroller.
     */
    #postProcessItems = (items) => {
      const me = 'postProcessItems';
      this.logger.starting(me, `count: ${items.length}`);

      const uids = new NH.base.DefaultMap(Array);
      for (const item of items) {
        this.logger.log('item:', item, Scroller.#isItemViewable(item));
        const uid = this.#uid(item);
        uids.get(uid)
          .push(item);
      }
      for (const [uid, list] of uids.entries()) {
        if (list.length > 1) {
          this.logger.log(`${list.length} duplicates with "${uid}"`);
          for (const item of list) {
            // Try again, maybe they can be de-duped this time.  The overall
            // experience seems to work better if the uid is recalculated
            // right away, but yeah, a bit of a hack.
            delete item.dataset.scrollerId;
            this.#uid(item);
          }
        }
      }

      this.logger.finished(me, `uid count: ${uids.size}`);
    }

    /**
     * Returns the uid for the current element.  Will use the registered
     * uidCallback function for this.
     * @param {Element} element - Element to identify.
     * @returns {string} - Computed uid for element.
     */
    #uid = (element) => {
      const me = 'uid';
      this.logger.entered(me, element);

      let uid = null;
      if (element) {
        if (!element.dataset.scrollerId) {
          element.dataset.scrollerId = this.#uidCallback(element);
        }
        uid = element.dataset.scrollerId;
      }

      this.logger.leaving(me, uid);
      return uid;
    }

    /**
     * Checks if the element is the current one.  Useful as a callback to
     * Array.find.
     * @param {Element} element - Element to check.
     * @returns {boolean} - Whether or not element is the current one.
     */
    #matchItem = (element) => {
      const me = 'matchItem';
      this.logger.entered(me);

      const res = this.#currentItemId === this.#uid(element);

      this.logger.leaving(me, res);
      return res;
    }

    /**
     * If necessary, scroll the bottom into view, then same for top.
     * @param {HTMLElement} item - The item to scroll into view.
     */
    #gentlyScrollIntoView = (item) => {
      const me = 'gentlyScrollIntoView';
      this.logger.entered(me, item);

      item.style.scrollMarginBottom = this.#bottomMarginCSS;
      let rect = item.getBoundingClientRect();

      const allowedBottom = document.documentElement.clientHeight -
                this.#bottomMarginPixels;
      if (rect.bottom > allowedBottom) {
        this.logger.log('scrolling up onto page');
        item.scrollIntoView(false);
      }
      rect = item.getBoundingClientRect();
      if (rect.top < this.#topMarginPixels) {
        this.logger.log('scrolling down onto page');
        item.scrollIntoView(true);
      }
      // XXX: The following was added to support horizontal scrolling in
      // carousels.  Nothing seemed to break.  TODO(#132): Did find a side
      // effect though: it can cause an item being *left* to shift up if the
      // scrollMarginBottom has been set.  This also makes the current `Jobs`
      // *Recent job searches* secondary scroller a little wonky.  There are
      // invisible items that take up space at the bottom of the list, and
      // this causes the last visible one to scroll into the middle, leaving
      // blank space at the bottom of the view.
      item.scrollIntoView({block: 'nearest', inline: 'nearest'});

      this.logger.leaving(me);
    };

    /**
     * Scroll the current item into the view port.  Depending on the instance
     * configuration, this could snap to the top, snap to the bottom, or be a
     * no-op.
     */
    #scrollToCurrentItem = () => {
      const me = 'scrollToCurrentItem';
      this.logger.entered(me, `snaptoTop: ${this.#snapToTop}`);

      const item = this.item;

      if (item) {
        item.style.scrollMarginTop = this.#topMarginCSS;
        if (this.#snapToTop) {
          this.logger.log('snapping to top');
          item.scrollIntoView(true);
        } else {
          this.#gentlyScrollIntoView(item);
        }
      }

      this.logger.leaving(me);
    }

    /**
     * Jump an item on an end of the collection.
     * @param {boolean} first - If true, the first item in the collection,
     * else, the last.
     */
    #jumpToEndItem = (first) => {
      const me = 'jumpToEndItem';
      this.logger.entered(me, `first=${first}`);

      const items = this.#getItems();
      if (items.length) {
        // eslint-disable-next-line no-extra-parens
        let idx = first ? 0 : (items.length - 1);
        let item = items[idx];

        // Content of items is sometimes loaded lazily and can be detected by
        // having no innerText yet.  So start at the end and work our way up
        // to the last one loaded.
        if (!first) {
          while (!Scroller.#isItemViewable(item)) {
            this.logger.log('skipping item', item);
            idx -= 1;
            item = items[idx];
          }
        }
        this.item = item;
      }

      this.logger.leaving(me);
    }

    /**
     * Move forward or backwards in the collection by at least n.
     * @param {number} n - How many items to move and the intended direction.
     * @fires 'out-of-range'
     */
    #scrollBy = (n) => {  // eslint-disable-line max-statements
      const me = 'scrollBy';
      this.logger.entered(me, n);

      /**
       * Keep viewable items and the current one.
       *
       * The current item may not yet be viewable after a reload, but give it
       * a chance.
       * @param {HTMLElement} item - Item to check.
       * @returns {boolean} - Whether to keep or not.
       */
      const filterItem = (item) => {
        if (Scroller.#isItemViewable(item)) {
          return true;
        }
        if (this.#uid(item) === this.#currentItemId) {
          return true;
        }
        return false;
      };

      const items = this.#getItems()
        .filter(item => filterItem(item));
      if (items.length) {
        let idx = items.findIndex(this.#matchItem);
        this.logger.log('initial idx', idx);
        idx += n;
        if (idx < NH.base.NOT_FOUND) {
          idx = items.length - 1;
        }
        if (idx === NH.base.NOT_FOUND || idx >= items.length) {
          this.item = null;
          this.dispatcher.fire('out-of-range', null);
        } else {
          this.item = items[idx];
        }
      }

      this.logger.leaving(me);
    }

    /** @throws {Scroller.Exception} - On many validation issues. */
    #validateInstance = () => {
      this.#validateWhat();
      this.#validateHow();
    }

    /** @throws {Scroller.Exception} - On many validation issues. */
    #validateWhat = () => {
      if (this.#base && this.#containerItems.length) {
        throw new Scroller.Exception(
          `Cannot have both base AND containerItems: ${this.#name} has both`
        );
      }

      if (!this.#base && !this.#containerItems.length) {
        throw new Scroller.Exception(
          `Needs either base OR containerItems: ${this.#name} has neither`
        );
      }

      if (this.#base && !(this.#base instanceof Element)) {
        throw new Scroller.Exception(
          `Not an element: base ${this.#base} given for ${this.#name}`
        );
      }

      if (this.#base && !this.#selectors) {
        throw new Scroller.Exception(
          `No selectors: ${this.#name} is missing selectors`
        );
      }

      if (this.#selectors && !this.#base) {
        throw new Scroller.Exception(
          `No base: ${this.#name} is using selectors and so needs a base`
        );
      }
    }

    /** @throws {Scroller.Exception} - On many validation issues. */
    #validateHow = () => {
      if (!this.#uidCallback) {
        throw new Scroller.Exception(
          `Missing uidCallback: ${this.#name} has no uidCallback defined`
        );
      }

      if (!(this.#uidCallback instanceof Function)) {
        throw new Scroller.Exception(
          `Invalid uidCallback: ${this.#name} uidCallback is not a function`
        );
      }

      if (this.#clickConfig) {
        if (this.#clickConfig instanceof Function) {
          if (this.#clickConfig.length !== 1) {
            throw new Scroller.Exception(
              `Invalid clickConfig: ${this.#name} element finder should ` +
                'take exactly one argument, currently takes ' +
                `${this.#clickConfig.length}`
            );
          }
        } else if (!(this.#clickConfig.selectorArray instanceof Array)) {
          throw new Scroller.Exception(
            `Invalid clickConfig: ${this.#name} selectorArray is not an Array`
          );
        }
      }
    }

    /**
     * The page may still be loading, so wait for many things to settle.
     * @returns {Promise<Element[]>} - All the new base elements.
     */
    #waitForContainers = () => {
      const me = 'waitForContainers';
      this.logger.entered(me);

      const results = [];

      /**
       * Simply eats any exception throw by the Promise.
       * @param {Promise} prom - Whatever Promise we are wrapping.
       * @param {string} note - Put into log on error.
       * @returns {Promise} - Resolved promise.
       */
      const wrapper = async (prom, note) => {
        this.logger.log('wrapping', prom);
        try {
          return await prom;
        } catch (e) {
          this.logger.log(`wrapper ate error (${note}):`, e);
          return Promise.resolve();
        }
      };

      for (const {container} of this.#containerItems) {
        results.push(wrapper(NH.web.waitForSelector(container,
          this.#containerTimeout), container));
      }

      this.logger.leaving(me, results);
      return Promise.all(results);
    }

    /**
     * Watches for the current item, if there was one, to return.
     *
     * Used during activation to deal with items still being loaded.
     *
     * TODO(#150): This is a good start but needs more work.  Hooking into the
     * MutationObserver seemed like a good idea, but in practice, we only get
     * invoked once, then time out.  Likely the observe options need some
     * tweaking.  Will need to balance between what we do on activation as
     * well as long term monitoring (which is not being done yet anyway).
     * Also note the call to Scroller.#isItemViewable, a direct nod to what
     * Feed needs to do.
     *
     * @returns {Promise<string>} - Wait on this to finish with something
     * useful to log.
     */
    #currentItemWatcher = () => {
      const me = 'currentItemWatcher';
      this.logger.entered(me);

      const uid = this.itemUid;
      let prom = Promise.resolve('nothing to watch for');

      if (uid) {
        this.logger.log('reactivation with', uid);
        let timeoutID = null;

        prom = new Promise((resolve) => {

          /** Dispatcher monitor. */
          const moCallback = () => {
            this.logger.log('moCallback');
            if (this.gotoUid(uid)) {
              this.logger.log('item is present', this.item);
              if (Scroller.#isItemViewable(this.item)) {
                this.logger.log('and viewable');
                this.#mutationDispatcher.off('records', moCallback);
                clearTimeout(timeoutID);
                resolve('looks good');
              } else {
                this.logger.log('but not yet viewable');
              }
            } else {
              this.logger.log('not ready yet');
            }
          };

          /** Standard setTimeout callback. */
          const toCallback = () => {
            this.#mutationDispatcher.off('records', moCallback);
            this.logger.log('one last try...');
            moCallback();
            resolve('we tried...');
          };

          this.#mutationDispatcher.on('records', moCallback);
          timeoutID = setTimeout(toCallback, this.#waitForItemTimeout);
          moCallback();
        });
      }

      this.logger.leaving(me, prom);
      return prom;
    }

    #monitorConnectedness = () => {
      if (this.#currentItem && !this.#currentItem.isConnected) {
        this.logger.log('current item disconnected');
        this.#currentItem = null;
        if (litOptions.enableDevMode) {
          NH.base.issues.post(
            `Current Scroller, ${this.name}, item disconnected.`,
            'Did an item lose shine?'
          );
        }
      }
    }

  }

  /* eslint-disable max-lines-per-function */
  /* eslint-disable no-empty-function */
  /* eslint-disable no-new */
  /* eslint-disable no-unused-vars */
  /* eslint-disable require-jsdoc */
  class ScrollerTestCase extends NH.xunit.TestCase {

    testNeedsBaseOrContainerItems() {
      const what = {
        name: this.id,
      };
      const how = {
      };

      this.assertRaisesRegExp(
        Scroller.Exception,
        /Needs either base OR containerItems:/u,
        () => {
          new Scroller(what, how);
        }
      );
    }

    testNotBaseAndContainerItems() {
      const what = {
        name: this.id,
        base: document.body,
        containerItems: [{}],
      };
      const how = {
      };

      this.assertRaisesRegExp(
        Scroller.Exception,
        /Cannot have both base AND containerItems:/u,
        () => {
          new Scroller(what, how);
        }
      );
    }

    testBaseIsElement() {
      const what = {
        name: this.id,
        base: document,
      };
      const how = {
      };

      this.assertRaisesRegExp(
        Scroller.Exception,
        /Not an element:/u,
        () => {
          new Scroller(what, how);
        }
      );
    }

    testBaseNeedsSelector() {
      const what = {
        name: this.id,
        base: document.body,
      };
      const how = {
      };

      this.assertRaisesRegExp(
        Scroller.Exception,
        /No selectors:/u,
        () => {
          new Scroller(what, how);
        }
      );
    }

    testSelectorNeedsBase() {
      const what = {
        name: this.id,
        selectors: [],
        containerItems: [{}],
      };
      const how = {
      };

      this.assertRaisesRegExp(
        Scroller.Exception,
        /No base:/u,
        () => {
          new Scroller(what, how);
        }
      );
    }

    testBaseWithSelectorIsFine() {
      const what = {
        name: this.id,
        base: document.body,
        selectors: [],
      };
      const how = {
        uidCallback: () => {},
      };

      this.assertNoRaises(() => {
        new Scroller(what, how);
      }, 'everything is in place');
    }

    testValidUidCallback() {
      const what = {
        name: this.id,
        base: document.body,
        selectors: [],
      };
      const how = {
      };

      this.assertRaisesRegExp(
        Scroller.Exception,
        /Missing uidCallback:/u,
        () => {
          new Scroller(what, how);
        },
        'missing',
      );

      how.uidCallback = {};

      this.assertRaisesRegExp(
        Scroller.Exception,
        /Invalid uidCallback:/u,
        () => {
          new Scroller(what, how);
        },
        'invalid',
      );

      how.uidCallback = () => {};

      this.assertNoRaises(() => {
        new Scroller(what, how);
      }, 'finally, good');
    }

    testValidClickConfig() {
      const what = {
        name: this.id,
        containerItems: [{}],
      };
      const how = {
        uidCallback: () => {},
      };

      this.assertNoRaises(() => {
        new Scroller(what, how);
      }, 'no clickConfig is fine');

      how.clickConfig = (element) => {};

      this.assertNoRaises(() => {
        new Scroller(what, how);
      }, 'single argument element finder is fine');

      how.clickConfig = () => {};

      this.assertRaisesRegExp(
        Scroller.Exception,
        /Invalid clickConfig: .* 0$/u,
        () => {
          new Scroller(what, how);
        },
        'zero argument element finder is not fine'
      );

      how.clickConfig = (a, b, c) => {};

      this.assertRaisesRegExp(
        Scroller.Exception,
        /Invalid clickConfig: .* 3$/u,
        () => {
          new Scroller(what, how);
        },
        'many arguments element finder is not fine'
      );

      how.clickConfig = {};

      this.assertRaisesRegExp(
        Scroller.Exception,
        /Invalid clickConfig: .* selectorArray is not an Array$/u,
        () => {
          new Scroller(what, how);
        },
        'missing selectorArray'
      );

      how.clickConfig = {selectorArray: 'string'};

      this.assertRaisesRegExp(
        Scroller.Exception,
        /Invalid clickConfig: .* selectorArray is not an Array$/u,
        () => {
          new Scroller(what, how);
        },
        'non-array'
      );

      how.clickConfig = {selectorArray: []};

      this.assertNoRaises(() => {
        new Scroller(what, how);
      },
      'array is fine');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(ScrollerTestCase);

  /**
   * This class exists solely to avoid some `no-use-before-define` linter
   * issues.
   */
  class LinkedInGlobals {

    /** @type {string} - LinkedIn's common aside used in many layouts. */
    static get asideSelector() {
      return this.#asideSelector;
    }

    /** @type {string} - LinkedIn's common sidebar used in many layouts. */
    static get sidebarSelector() {
      return this.#sidebarSelector;
    }

    /** @type {string} - The height of the navbar as CSS string. */
    get navbarHeightCSS() {
      return `${this.#navbarHeightPixels}px`;
    }

    /** @type {number} - The height of the navbar in pixels. */
    get navbarHeightPixels() {
      return this.#navbarHeightPixels;
    }

    /** @param {number} val - Set height of the navbar in pixels. */
    set navbarHeightPixels(val) {
      this.#navbarHeightPixels = val;
    }

    /** Scroll common sidebar into view and move focus to it. */
    focusOnSidebar = () => {
      const sidebar = document.querySelector(LinkedInGlobals.sidebarSelector);
      if (sidebar) {
        sidebar.style.scrollMarginTop = this.navbarHeightCSS;
        sidebar.scrollIntoView();
        NH.web.focusOnElement(sidebar);
      }
    }

    /**
     * Scroll common aside (right-hand sidebar) into view and move focus to
     * it.
     */
    focusOnAside = () => {
      const aside = document.querySelector(LinkedInGlobals.asideSelector);
      if (aside) {
        aside.style.scrollMarginTop = this.navbarHeightCSS;
        aside.scrollIntoView();
        NH.web.focusOnElement(aside);
      }
    }

    /**
     * Create a Greasy Fork project URL.
     * @param {string} path - Portion of the URL.
     * @returns {string} - Full URL.
     */
    gfUrl = (path) => {
      const base = 'https://greasyfork.org/en/scripts/472097-linkedin-tool';
      const url = `${base}/${path}`;
      return url;
    }

    /**
     * Create a GitHub project URL.
     * @param {string} path - Portion of the URL.
     * @returns {string} - Full URL.
     */
    ghUrl = (path) => {
      const base = 'https://github.com/nexushoratio/userscripts';
      const url = `${base}/${path}`;
      return url;
    }

    static #asideSelector = 'aside.scaffold-layout__aside';
    static #sidebarSelector = 'div.scaffold-layout__sidebar';

    #navbarHeightPixels = 0;

  }

  /** A table with collapsible sections. */
  class AccordionTableWidget extends NH.widget.Widget {

    /** @param {string} name - Name for this instance. */
    constructor(name) {
      super(name, 'table');
      this.logger.log(`${this.name} constructed`);
    }

    /**
     * This becomes the current section.
     * @param {string} name - Name of the new section.
     * @returns {Element} - The new section.
     */
    addSection(name) {
      this.#currentSection = document.createElement('tbody');
      this.#currentSection.id = NH.base.safeId(`${this.id}-${name}`);
      this.container.append(this.#currentSection);
      return this.#currentSection;
    }

    /**
     * Add a row of header cells to the current section.
     * @param {...string} items - To make up the row cells.
     */
    addHeader(...items) {
      this.#addRow('th', ...items);
    }

    /**
     * Add a row of data cells to the current section.
     * @param {...string} items - To make up the row cells.
     */
    addData(...items) {
      this.#addRow('td', ...items);
    }

    #currentSection

    /**
     * Add a row to the current section.
     * @param {string} type - Cell type, typically 'td' or 'th'.
     * @param {...string} items - To make up the row cells.
     */
    #addRow = (type, ...items) => {
      const tr = document.createElement('tr');
      for (const item of items) {
        const cell = document.createElement(type);
        cell.innerHTML = item;
        tr.append(cell);
      }
      this.container.append(tr);
    }

  }

  /**
   * Self-decorating class useful for integrating with a hotkey service.
   *
   * @example
   * // Wrap an arrow function:
   * foo = new Shortcut(
   *   'c-c',
   *   'Clear the console.',
   *   () => {
   *     console.clear();
   *     console.log('I did it!', this);
   *   }
   * );
   *
   * // Search for instances:
   * const keys = [];
   * for (const prop of Object.values(this)) {
   *   if (prop instanceof Shortcut) {
   *     keys.push({seq: prop.seq, desc: prop.seq, func: prop});
   *   }
   * }
   * ... Send keys off to service ...
   */
  class Shortcut extends Function {

    /**
     * Wrap a function.
     * @param {string} seq - Key sequence to activate this function.
     * @param {string} desc - Human readable documenation about this function.
     * @param {NH.web.SimpleFunction} func - Function to wrap, usually in the
     * form of an arrow function.  Keep JS `this` magic in mind!
     */
    constructor(seq, desc, func) {
      super('return this.func();');
      const myself = this.bind(this);
      myself.seq = seq;
      myself.desc = desc;
      this.func = func;
      return myself;
    }

  }

  /**
   * Manage a {Scroller} via {NH.base.Service} with LIT idiosyncrasies.
   *
   * It will turn the {Scroller} on/off.
   * Apply any fixups for margin features.
   * Monitor margin for changes.
   */
  class LinkedInScrollerService extends NH.base.Service {

    /**
     * @param {string} name - Custom portion of this instance.
     * @param {Scroller} scroller - Scroller instance to manage.
     */
    constructor(name, scroller) {
      super(name);
      this.on('activate', this.#onActivate)
        .on('deactivate', this.#onDeactivate)
        .setScroller(scroller);
    }

    /**
     * @param {NH.base.Dispatcher} details - The {@link LinkedIn} instance.
     * @returns {LinkedInScrollerService} - This instance, for chaining.
     */
    setDetails(details) {
      this.#details = details;
      return this;
    }

    /**
     * Sets the {@link Scroller} to manage with this service.
     *
     * If not value is passed, any existing instance will be removed.
     *
     * @param {Scroller} [scroller] - The instance to manage.
     * @returns {LinkedInScrollerService} - This instance, for chaining.
     */
    setScroller(scroller = null) {
      this.#scroller = scroller;
      return this;
    }

    #details
    #scroller

    #onActivate = () => {
      this.#scroller?.activate();
    }

    #onDeactivate = () => {
      this.#scroller?.deactivate();
    }

  }

  /**
   * @external VMShortcuts
   * @see {@link https://violentmonkey.github.io/guide/keyboard-shortcuts/}
   */

  /**
   * Integrates {@link external:VMShortcuts} with {@link Shortcut}s.
   *
   * NB {Shortcut} was designed to work natively with {external:VMShortcuts},
   * but there should be no known technical reason preventing other
   * implementations from being used, would have have to write a different
   * service.
   *
   * Instances of classes that have {@link Shortcut} properties on them can be
   * added and removed to each instance of this service.  The shortcuts will
   * be enabled and disabled as the service is activated/deactived.  This can
   * allow each service to have different groups of shortcuts present.
   *
   * All Shortcuts can react to VM.shortcut style conditions.  These
   * conditions are added once during each call to addService(), and default
   * to '!inputFocus'.
   *
   * The built in handler for 'inputFocus' can be enabled by executing:
   *
   * @example
   * VMKeyboardService.start();
   */
  class VMKeyboardService extends NH.base.Service {

    /** @inheritdoc */
    constructor(name) {
      super(name);
      VMKeyboardService.#services.add(this);
      this.on('activate', this.#onActivate)
        .on('deactivate', this.#onDeactivate);
    }

    static keyMap = new Map([
      ['LEFT', '←'],
      ['UP', '↑'],
      ['RIGHT', '→'],
      ['DOWN', '↓'],
    ]);

    /** @param {string} val - New condition. */
    static set condition(val) {
      this.#navOption.condition = val;
    }

    /** @type {Set<VMKeyboardService>} - Instantiated services. */
    static get services() {
      return new Set(this.#services.values());
    }

    /** Add listener. */
    static start() {
      document.addEventListener('focus', this.#onFocus, this.#focusOption);
    }

    /** Remove listener. */
    static stop() {
      document.removeEventListener('focus', this.#onFocus, this.#focusOption);
    }

    /**
     * Set the keyboard context to a specific value.
     * @param {string} context - The name of the context.
     * @param {object} state - What the value should be.
     */
    static setKeyboardContext(context, state) {
      for (const service of this.#services) {
        for (const keyboard of service.#keyboards.values()) {
          keyboard.setContext(context, state);
        }
      }
    }

    /**
     * Parse a {@link Shortcut.seq} and wrap it in HTML.
     * @example
     * 'a c-b' ->
     *   '<kbd><kbd>a</kbd> then <kbd>Ctrl</kbd> + <kbd>b</kbd></kbd>'
     * @param {Shortcut.seq} seq - Keystroke sequence.
     * @returns {string} - Appropriately wrapped HTML.
     */
    static parseSeq(seq) {

      /**
       * Convert a VM.shortcut style into an HTML snippet.
       * @param {IShortcutKey} key - A particular key press.
       * @returns {string} - HTML snippet.
       */
      function reprKey(key) {
        if (key.base.length === 1) {
          if ((/\p{Uppercase_Letter}/u).test(key.base)) {
            key.base = key.base.toLowerCase();
            key.modifierState.s = true;
          }
        } else {
          key.base = key.base.toUpperCase();
          const mapped = VMKeyboardService.keyMap.get(key.base);
          if (mapped) {
            key.base = mapped;
          }
        }
        const sequence = [];
        if (key.modifierState.c) {
          sequence.push('Ctrl');
        }
        if (key.modifierState.a) {
          sequence.push('Alt');
        }
        if (key.modifierState.s) {
          sequence.push('Shift');
        }
        sequence.push(key.base);
        return sequence.map(c => `<kbd>${c}</kbd>`)
          .join('+');
      }
      const res = VM.shortcut.normalizeSequence(seq, true)
        .map(key => reprKey(key))
        .join(' then ');
      return `<kbd>${res}</kbd>`;
    }

    /** @type {boolean} */
    get active() {
      return this.#active;
    }

    /** @type {Shortcut[]} - Well, seq and desc properties only. */
    get shortcuts() {
      return this.#shortcuts;
    }

    /** @param {*} instance - Object with {Shortcut} properties. */
    addInstance(instance) {
      const me = 'addInstance';
      this.logger.entered(me, instance);

      if (this.#keyboards.has(instance)) {
        this.logger.log('Already registered');
      } else {
        const keyboard = new VM.shortcut.KeyboardService();
        for (const [name, prop] of Object.entries(instance)) {
          if (prop instanceof Shortcut) {
            // While we are here, give the function a name.
            Object.defineProperty(prop, 'name', {value: name});
            keyboard.register(prop.seq, prop, VMKeyboardService.#navOption);
          }
        }
        this.#keyboards.set(instance, keyboard);
        this.#rebuildShortcuts();
      }

      this.logger.leaving(me);
    }

    /** @param {*} instance - Object with {Shortcut} properties. */
    removeInstance(instance) {
      const me = 'removeInstance';
      this.logger.entered(me, instance);

      if (this.#keyboards.has(instance)) {
        const keyboard = this.#keyboards.get(instance);
        keyboard.disable();
        this.#keyboards.delete(instance);
        this.#rebuildShortcuts();
      } else {
        this.logger.log('Was not registered');
      }

      this.logger.leaving(me);
    }

    static #focusOption = {
      capture: true,
    };

    static #lastFocusedElement = null

    /**
     * @type {VM.shortcut.IShortcutOptions} - Disables keys when focus is on
     * an element or info view.
     */
    static #navOption = {
      condition: '!inputFocus',
      caseSensitive: true,
    };

    static #services = new Set();

    /**
     * Handle focus event to determine if shortcuts should be disabled.
     * @param {Event} evt - Standard 'focus' event.
     */
    static #onFocus = (evt) => {
      if (this.#lastFocusedElement &&
          evt.target !== this.#lastFocusedElement) {
        this.#lastFocusedElement = null;
        this.setKeyboardContext('inputFocus', false);
      }
      if (NH.web.isInput(evt.target)) {
        this.setKeyboardContext('inputFocus', true);
        this.#lastFocusedElement = evt.target;
      }
    }

    #active = false;
    #keyboards = new Map();
    #shortcuts = [];

    #onActivate = () => {
      for (const keyboard of this.#keyboards.values()) {
        this.logger.log('would enable keyboard', keyboard);
        // TODO: keyboard.enable();
      }
      this.#active = true;
    }

    #onDeactivate = () => {
      for (const keyboard of this.#keyboards.values()) {
        this.logger.log('would disable keyboard', keyboard);
        // TODO: keyboard.disable();
      }
      this.#active = false;
    }

    #rebuildShortcuts = () => {
      this.#shortcuts = [];
      for (const instance of this.#keyboards.keys()) {
        for (const prop of Object.values(instance)) {
          if (prop instanceof Shortcut) {
            this.#shortcuts.push({seq: prop.seq, desc: prop.desc});
          }
        }
      }
    }

  }

  /* eslint-disable require-jsdoc */
  class ParseSeqTestCase extends NH.xunit.TestCase {

    testNormalInputs() {
      const tests = [
        {text: 'q', expected: '<kbd><kbd>q</kbd></kbd>'},
        {text: 's-q', expected: '<kbd><kbd>Shift</kbd>+<kbd>q</kbd></kbd>'},
        {text: 'Q', expected: '<kbd><kbd>Shift</kbd>+<kbd>q</kbd></kbd>'},
        {text: 'a b', expected: '<kbd><kbd>a</kbd> then <kbd>b</kbd></kbd>'},
        {text: '<', expected: '<kbd><kbd><</kbd></kbd>'},
        {text: 'C-q', expected: '<kbd><kbd>Ctrl</kbd>+<kbd>q</kbd></kbd>'},
        {text: 'c-q', expected: '<kbd><kbd>Ctrl</kbd>+<kbd>q</kbd></kbd>'},
        {text: 'c-a-t',
          expected: '<kbd><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+' +
       '<kbd>t</kbd></kbd>'},
        {text: 'a-c-T',
          expected: '<kbd><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+' +
       '<kbd>Shift</kbd>+<kbd>t</kbd></kbd>'},
        {text: 'c-down esc',
          expected: '<kbd><kbd>Ctrl</kbd>+<kbd>↓</kbd> ' +
       'then <kbd>ESC</kbd></kbd>'},
        {text: 'alt-up tab',
          expected: '<kbd><kbd>Alt</kbd>+<kbd>↑</kbd> ' +
       'then <kbd>TAB</kbd></kbd>'},
        {text: 'shift-X control-alt-del',
          expected: '<kbd><kbd>Shift</kbd>+<kbd>x</kbd> ' +
       'then <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>DEL</kbd></kbd>'},
        {text: 'c-x c-v',
          expected: '<kbd><kbd>Ctrl</kbd>+<kbd>x</kbd> ' +
       'then <kbd>Ctrl</kbd>+<kbd>v</kbd></kbd>'},
        {text: 'a-x enter',
          expected: '<kbd><kbd>Alt</kbd>+<kbd>x</kbd> ' +
       'then <kbd>ENTER</kbd></kbd>'},
      ];
      for (const {text, expected} of tests) {
        this.assertEqual(VMKeyboardService.parseSeq(text), expected, text);
      }
    }

    testKonamiCode() {
      this.assertEqual(VMKeyboardService.parseSeq(
        'up up down down left right left right b shift-a enter'
      ),
      '<kbd><kbd>↑</kbd> then <kbd>↑</kbd> then <kbd>↓</kbd> ' +
      'then <kbd>↓</kbd> then <kbd>←</kbd> then <kbd>→</kbd> ' +
      'then <kbd>←</kbd> then <kbd>→</kbd> then <kbd>b</kbd> ' +
      'then <kbd>Shift</kbd>+<kbd>a</kbd> then <kbd>ENTER</kbd></kbd>');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(ParseSeqTestCase);

  /**
   * Helper for pages that have an extra drop-down toolbar.
   *
   * Some LinkedIn pages have an extra toolbar that will drop down and obscure
   * content.  This makes it difficult for `LinkedIn.navbarScrollerFixup()` to
   * properly adjust.
   *
   * For those pages, use this Service which will activate once to to do the
   * initial fixups, then the additional ones necessary for that page.
   */
  class LinkedInToolbarService extends NH.base.Service {

    /**
     * @param {string} name - Custom portion of this instance.
     * @param {Page} page - Page this service is tied to.
     */
    constructor(name, page) {
      super(name);
      this.#page = page;
      this.#postHook = () => {};  // eslint-disable-line no-empty-function
      this.on('activate', this.#onActivate);
    }

    /**
     * @param {...Scroller~How} hows - How types to update.
     * @returns {LinkedInToolbarService} - This instance, for chaining.
     */
    addHows(...hows) {
      for (const how of hows) {
        this.#scrollerHows.add(how);
      }
      return this;
    }

    /**
     * Often a {Page} would like to do a bit more initialization after this
     * fixups.  That is what this hook is for.
     *
     * @param {NH.web.SimpleFunction} hook - Function to call post activation.
     * @returns {LinkedInToolbarService} - This instance, for chaining.
     */
    postActivateHook(hook) {
      this.#postHook = hook;
      return this;
    }

    #activatedOnce = false;
    #page
    #postHook
    #scrollerHows = new Set();

    #onActivate = () => {
      const me = 'onActivate';
      this.logger.entered(me, this.#page);

      if (!this.#activatedOnce) {
        const toolbarElement = document.querySelector(
          '.scaffold-layout-toolbar'
        );
        this.logger.log('toolbar:', toolbarElement);

        for (const how of this.#scrollerHows) {
          this.logger.log('how:', how);
          this.#page.spa.details.navbarScrollerFixup(how);

          const newHeight = how.topMarginPixels + toolbarElement.clientHeight;
          const newCSS = `${newHeight}px`;

          how.topMarginPixels = newHeight;
          how.topMarginCSS = newCSS;
        }

        this.#postHook();
      }

      this.#activatedOnce = true;

      this.logger.leaving(me);
    }

  }

  /**
   * Base class for handling various views of a single-page application.
   *
   * Generally, new classes should subclass this, override a few properties
   * and methods, and then register themselves with an instance of the {@link
   * SPA} class.
   */
  class Page {

    /**
     * @typedef {object} PageDetails
     * @property {SPA} spa - SPA instance that manages this Page.
     * @property {string|RegExp} [pathname=RegExp(.*)] - Pathname portion of
     * the URL this page should handle.
     * @property {string} [pageReadySelector='body'] - CSS selector that is
     * used to detect that the page is loaded enough to activate.
     */

    /** @param {PageDetails} details - Details about the instance. */
    constructor(details = {}) {
      if (new.target === Page) {
        throw new TypeError('Abstract class; do not instantiate directly.');
      }
      this.#spa = details.spa;
      this.#logger = new NH.base.Logger(this.constructor.name);
      this.#pathnameRE = this.#computePathname(details.pathname);
      ({
        pageReadySelector: this.#pageReadySelector = 'body',
      } = details);
      this.#logger.log('Base page constructed', this);
    }

    /** @type {Shortcut[]} - List of {@link Shortcut}s to register. */
    get allShortcuts() {
      const shortcuts = [];
      for (const [name, prop] of Object.entries(this)) {
        if (prop instanceof Shortcut) {
          shortcuts.push(prop);
          // While we are here, give the function a name.
          Object.defineProperty(prop, 'name', {value: name});
        }
      }
      return shortcuts;
    }

    /** @type {string} - Describes what the header should be. */
    get infoHeader() {
      return this.constructor.name;
    }

    /** @type {KeyboardService} */
    get keyboard() {
      return this.#keyboard;
    }

    /** @type {NH.base.Logger} */
    get logger() {
      return this.#logger;
    }

    /** @type {RegExp} */
    get pathname() {
      return this.#pathnameRE;
    }

    /** @type {SPA} */
    get spa() {
      return this.#spa;
    }

    /**
     * Register a new {@link NH.base.Service}.
     * @param {function(): NH.base.Service} Klass - A service class to
     * instantiate.
     * @param {...*} rest - Arbitrary objects to pass to constructor.
     * @returns {NH.base.Service} - Instance of Klass.
     */
    addService(Klass, ...rest) {
      const me = 'addService';
      this.logger.entered(me, Klass, ...rest);

      let instance = null;
      if (Klass.prototype instanceof NH.base.Service) {
        instance = new Klass(this.constructor.name, ...rest);
        this.#services.add(instance);
      } else {
        this.logger.log('Bad class was passed.');
        throw new Error(`${Klass.name} is not a Service`);
      }

      this.logger.leaving(me, instance);
      return instance;
    }

    /**
     * Called when registered via {@link SPA}.
     */
    start() {
      for (const shortcut of this.allShortcuts) {
        this.#addKey(shortcut);
      }
    }

    /**
     * Turns on this Page's features.  Called by {@link SPA} when this becomes
     * the current view.
     */
    async activate() {
      const me = 'activate';
      this.logger.entered(me);

      this.#keyboard.enable();
      await this.#waitUntilReady();
      for (const service of this.#services) {
        this.logger.log(`activating service: "${service.name}"`);
        service.activate();
      }

      this.logger.leaving(me);
    }

    /**
     * Turns off this Page's features.  Called by {@link SPA} when this is no
     * longer the current view.
     */
    deactivate() {
      this.#keyboard.disable();
      for (const service of this.#services) {
        service.deactivate();
      }
    }

    /**
     * @type {IShortcutOptions} - Disables keys when focus is on an element or
     * info view.
     */
    static #navOption = {
      caseSensitive: true,
      condition: '!inputFocus && !inDialog',
    };

    /** @type {KeyboardService} */
    #keyboard = new VM.shortcut.KeyboardService();

    /** @type {NH.base.Logger} - NH.base.Logger instance. */
    #logger

    #pageReadySelector

    /** @type {RegExp} - Computed RegExp version of details.pathname. */
    #pathnameRE

    #services = new Set();

    /** @type {SPA} - SPA instance managing this instance. */
    #spa

    /**
     * Turn a pathname into a RegExp.
     * @param {string|RegExp} pathname - A pathname to convert.
     * @returns {RegExp} - A converted pathname.
     */
    #computePathname = (pathname) => {
      const me = 'computePath';
      this.logger.entered(me, pathname);

      let pathnameRE = /.*/u;
      if (pathname instanceof RegExp) {
        pathnameRE = pathname;
      } else if (pathname) {
        pathnameRE = RegExp(`^${pathname}$`, 'u');
      }

      this.logger.leaving(me, pathnameRE);
      return pathnameRE;
    }

    /**
     * Wait until the page has loaded enough to continue.
     * @returns {Element} - The element matched by #pageReadySelector.
     */
    #waitUntilReady = async () => {
      const me = 'waitUntilReady';
      this.logger.entered(me);

      this.logger.log('pageReadySelector:', this.#pageReadySelector);
      const element = await NH.web.waitForSelector(
        this.#pageReadySelector, 0
      );

      this.logger.leaving(me, element);
      return element;
    }

    /**
     * Registers a specific key sequence with a function with VM.shortcut.
     * @param {Shortcut} shortcut - Shortcut to register.
     */
    #addKey = (shortcut) => {
      this.#keyboard.register(shortcut.seq, shortcut, Page.#navOption);
    }

  }

  /** Class for holding keystrokes that simplify debugging. */
  class DebugKeys {

    clearConsole = new Shortcut(
      'c-c c-c',
      'Clear the debug console',
      () => {
        NH.base.Logger.clear();
      }
    );

  }

  const linkedInGlobals = new LinkedInGlobals();

  /**
   * Class for handling aspects common across LinkedIn.
   *
   * This includes things like the global nav bar, information view, etc.
   */
  class Global extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);
      if (litOptions.enableDevMode) {
        this.#keyboardService.addInstance(new DebugKeys());
      }

      if (litOptions.enableIssue244Changes) {
        this.addService(Global.#Activator, this);
      }

      // Only care about the links that update the current page.
      const anchors = Array.prototype.filter.call(
        document.querySelectorAll('#global-nav a'),
        x => x.target !== '_blank'
      );
      for (const anchor of anchors) {
        anchor.addEventListener('click', this.#navLinkClickHandler);
      }
    }

    info = new Shortcut(
      '?',
      'Show this information view',
      () => {
        this.#gotoNavButton('Tool');
      }
    );

    gotoSearch = new Shortcut(
      '/',
      'Go to Search box',
      () => {
        NH.web.clickElement(document, ['#global-nav-search button']);
      }
    );

    goHome = new Shortcut(
      'g h',
      'Go Home (aka, Feed)',
      () => {
        this.#gotoNavLink('feed');
      }
    );

    gotoMyNetwork = new Shortcut(
      'g m',
      'Go to My Network',
      () => {
        this.#gotoNavLink('mynetwork');
      }
    );

    gotoJobs = new Shortcut(
      'g j',
      'Go to Jobs',
      () => {
        this.#gotoNavLink('jobs');
      }
    );

    gotoMessaging = new Shortcut(
      'g g',
      'Go to Messaging',
      () => {
        this.#gotoNavLink('messaging');
      }
    );

    gotoNotifications = new Shortcut(
      'g n',
      'Go to Notifications',
      () => {
        this.#gotoNavLink('notifications');
      }
    );

    gotoProfile = new Shortcut(
      'g p',
      'Go to Profile (aka, Me)',
      () => {
        this.#gotoNavButton('Me');
      }
    );

    gotoBusiness = new Shortcut(
      'g b',
      'Go to Business',
      () => {
        this.#gotoNavButton('Business');
      }
    );

    gotoLearning = new Shortcut(
      'g l',
      'Go to Learning',
      () => {
        this.#gotoNavLink('learning');
      }
    );

    focusOnSidebar = new Shortcut(
      ',',
      'Focus on the left/top sidebar (not always present)',
      () => {
        linkedInGlobals.focusOnSidebar();
      }
    );

    focusOnAside = new Shortcut(
      '.',
      'Focus on the right/bottom sidebar (not always present)',
      () => {
        linkedInGlobals.focusOnAside();
      }
    );

    static #Activator = class extends NH.base.Service {

      /**
       * @param {string} name - Custom portion of this instance.
       * @param {Page} page - Page this service is tied to.
       */
      constructor(name, page) {
        super(name);
        this.#page = page;
        this.on('activate', this.#onActivate);
      }

      #page

      /** Called each time service is activated. */
      #onActivate = () => {
        const me = 'onActivate';
        this.logger.entered(me);

        if (this.#page.spa.activePages.size === 1) {
          const pathname = window.location.pathname;
          /* eslint-disable prefer-regex-literals */
          const knownUrlsTodo = [
            // TODO(#237): Support *SpecificEvent* pages
            RegExp('^/events/.*/(?:about|comments)/.*', 'u'),
            // TODO(#253): Support *My Network Events* page
            '/mynetwork/network-manager/events/',
            // TODO(#255): Support *Search appearances* page
            '/analytics/search-appearances/',
            // TODO(#256): Support *Verify* page
            RegExp('/verify/?.*', 'u'),
            // TODO(#257): Support *Analytics & tools* page
            '/dashboard/',
          ];
          /* eslint-enable */

          if (!knownUrlsTodo.some(x => pathname.match(x))) {
            NH.base.issues.post('Unsupported page:', window.location);
          }
        }

        this.logger.leaving(me);
      }

    }

    #keyboardService

    /**
     * Click on the requested link in the global nav bar.
     * @param {string} item - Portion of the link to match.
     */
    #gotoNavLink = (item) => {
      NH.web.clickElement(document, [`#global-nav a[href*="/${item}"`]);
    }

    /**
     * Click on the requested button in the global nav bar.
     * @param {string} item - Text on the button to look for.
     */
    #gotoNavButton = (item) => {
      const me = 'gotoNavButton';
      this.logger.entered(me, item);

      const buttons = Array.from(
        document.querySelectorAll('#global-nav button')
      );
      const button = buttons.find(el => el.textContent.includes(item));
      button?.click();

      this.logger.leaving(me);
    }

    #navLinkClickHandler = async () => {
      const me = 'navLinkClickHandler';
      this.logger.entered(me);

      const oldPathname = window.location.pathname;

      /**
       * @implements {NH.web.Monitor}
       * @returns {NH.web.Continuation} - Indicate whether done monitoring.
       */
      const monitor = () => {
        const mon = 'monitor';
        this.logger.entered(mon, window.location.pathname);

        const result = {
          done: oldPathname !== window.location.pathname,
          results: window.location.pathname,
        };

        this.logger.leaving(mon, result);
        return result;
      };

      const what = {
        name: me,
        base: document.body,
      };
      const how = {
        observeOptions: {childList: true, subtree: true},
        monitor: monitor,
        timeout: 1000,
      };

      try {
        const newPathname = await NH.web.otmot(what, how);
        this.logger.log(`page moved on to ${newPathname}`);
      } catch (e) {
        this.logger.log(`page stayed at ${oldPathname}`);
        this.spa.activate(oldPathname);
      }

      this.logger.leaving(me);
    }

  }

  /** Class for handling the Posts feed. */
  class Feed extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...Feed.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      spa.details.navbarScrollerFixup(Feed.#postsHow);
      spa.details.navbarScrollerFixup(Feed.#commentsHow);

      this.#postScroller = new Scroller(Feed.#postsWhat, Feed.#postsHow);
      this.addService(LinkedInScrollerService)
        .setScroller(this.#postScroller);
      this.#postScroller.dispatcher.on(
        'out-of-range', linkedInGlobals.focusOnSidebar
      );
      this.#postScroller.dispatcher.on('activate', this.#onPostActivate);
      this.#postScroller.dispatcher.on('change', this.#onPostChange);

      this.#lastScroller = this.#postScroller;
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueIdentifier(element) {
      if (element) {
        return element.dataset.id;
      }
      return null;
    }

    /** @type {Scroller} */
    get comments() {
      const me = 'get comments';
      this.logger.entered(me, this.#commentScroller, this.posts.item);

      if (!this.#commentScroller && this.posts.item) {
        this.#commentScroller = new Scroller(
          {base: this.posts.item, ...Feed.#commentsWhat}, Feed.#commentsHow
        );
        this.#commentScroller.dispatcher.on(
          'out-of-range', this.#returnToPost
        );
        this.#commentScroller.dispatcher.on('change', this.#onCommentChange);
      }

      this.logger.leaving(me, this.#commentScroller);
      return this.#commentScroller;
    }

    /** @type {Scroller} */
    get posts() {
      return this.#postScroller;
    }

    nextPost = new Shortcut(
      'j',
      'Next post',
      () => {
        this.posts.next();
      }
    );

    prevPost = new Shortcut(
      'k',
      'Previous post',
      () => {
        this.posts.prev();
      }
    );

    nextComment = new Shortcut(
      'n',
      'Next comment',
      () => {
        this.comments.next();
      }
    );

    prevComment = new Shortcut(
      'p',
      'Previous comment',
      () => {
        this.comments.prev();
      }
    );

    firstItem = new Shortcut(
      '<',
      'Go to first post or comment',
      () => {
        this.#lastScroller.first();
      }
    );

    lastItem = new Shortcut(
      '>', 'Go to last post or comment currently loaded', () => {
        this.#lastScroller.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Change browser focus to current item',
      () => {
        const el = this.#lastScroller.item;
        this.posts.show();
        this.comments?.show();
        NH.web.focusOnElement(el);
      }
    );

    showComments = new Shortcut(
      'c',
      'Show comments',
      () => {
        if (!NH.web.clickElement(this.comments.item,
          ['button.show-prev-replies'])) {
          NH.web.clickElement(this.posts.item,
            ['button[aria-label*="comment"]']);
        }
      }
    );

    seeMore = new Shortcut(
      'm',
      'Show more of current post or comment',
      () => {
        const el = this.#lastScroller.item;
        NH.web.clickElement(el, ['button[aria-label^="see more"]']);
      }
    );

    loadMorePosts = new Shortcut(
      'l',
      'Load more posts (if the <button>New Posts</button> button ' +
        'is available, load those)', () => {
        const savedScrollTop = document.documentElement.scrollTop;
        let first = false;
        const posts = this.posts;

        /** Trigger function for {@link NH.web.otrot2}. */
        function trigger() {
          // The topButton only shows up when the app detects new posts.  In
          // that case, going back to the first post is appropriate.
          const topButton = 'main div.feed-new-update-pill button';
          // If there is not top button, there should always be a button at
          // the bottom the click.
          const botButton = 'main button.scaffold-finite-scroll__load-button';
          if (NH.web.clickElement(document, [topButton])) {
            first = true;
          } else {
            NH.web.clickElement(document, [botButton]);
          }
        }

        /** Action function for {@link NH.web.otrot2}. */
        function action() {
          if (first) {
            if (posts.item) {
              posts.first();
            }
          } else {
            document.documentElement.scrollTop = savedScrollTop;
          }
        }

        const what = {
          name: 'loadMorePosts',
          base: document.querySelector('div.scaffold-finite-scroll__content'),
        };
        const how = {
          trigger: trigger,
          action: action,
          duration: 2000,
        };
        NH.web.otrot2(what, how);
      }
    );

    viewPost = new Shortcut(
      'v p',
      'View current post directly',
      () => {
        const post = this.posts.item;
        if (post) {
          const urn = post.dataset.id;
          const id = `lt-${urn.replaceAll(':',
            '-')}`;
          let a = post.querySelector(`#${id}`);
          if (!a) {
            a = document.createElement('a');
            a.href = `/feed/update/${urn}/`;
            a.id = id;
            post.append(a);
          }
          a.click();
        }
      }
    );

    viewReactions = new Shortcut(
      'v r',
      'View reactions on current post or comment',
      () => {
        const el = this.#lastScroller.item;
        const selector = [
          // Button on a comment
          'button.comments-comment-social-bar__reactions-count',
          // Original button on a post
          'button.feed-shared-social-action-bar-counts',
          // Possibly new button on a post
          'button.social-details-social-counts__count-value',
        ].join(',');
        NH.web.clickElement(el, [selector]);
      }
    );

    viewReposts = new Shortcut(
      'v R',
      'View reposts of current post',
      () => {
        NH.web.clickElement(this.posts.item,
          ['button[aria-label*="repost"]']);
      }
    );

    openMeatballMenu = new Shortcut(
      '=',
      'Open closest <button class="spa-meatball">⋯</button> menu',
      () => {
        const me = 'openMeatballMenu';
        this.logger.entered(me, this.#lastScroller.item);

        // XXX: Under going a redesign.  Sometimes the selector grabs the
        // button proper, sometimes the internal svg.
        const selector = [
          // Comment variant
          '[aria-label^="Open options"]',
          // Original post variant
          '[aria-label^="Open control menu"]',
          // Maybe new post variant
          '[a11y-text^="Open control menu"]',
        ].join(',');
        const element = this.#lastScroller.item?.querySelector(selector);
        const button = element?.closest('button');
        button?.click();

        this.logger.leaving(me);
      }
    );

    likeItem = new Shortcut(
      'L',
      'Like current post or comment',
      () => {
        NH.web.clickElement(this.#lastScroller.item,
          ['button[aria-label^="Open reactions menu"]']);
      }
    );

    commentOnItem = new Shortcut(
      'C',
      'Comment on current post or comment',
      () => {
        // Order of the queries matters here.  If a post has visible comments,
        // the wrong button could be selected.
        NH.web.clickElement(this.#lastScroller.item, [
          'button[aria-label^="Comment"]',
          'button[aria-label^="Reply"]',
        ]);
      }
    );

    repost = new Shortcut(
      'R',
      'Repost current post',
      () => {
        const el = this.posts.item;
        NH.web.clickElement(el, ['button.social-reshare-button']);
      }
    );

    sendPost = new Shortcut(
      'S',
      'Send current post privately',
      () => {
        const el = this.posts.item;
        NH.web.clickElement(el, ['button.send-privately-button']);
      }
    );

    gotoShare = new Shortcut(
      'P',
      `Go to the share box to start a post or ${Feed.#tabSnippet} ` +
        'to the other creator options',
      () => {
        const share = document.querySelector(
          'div.share-box-feed-entry__top-bar'
        ).parentElement;
        share.style.scrollMarginTop = linkedInGlobals.navbarHeightCSS;
        share.scrollIntoView();
        share.querySelector('button')
          .focus();
      }
    );

    togglePost = new Shortcut(
      'X',
      'Toggle hiding current post',
      () => {
        NH.web.clickElement(
          this.posts.item,
          [
            'button[aria-label^="Dismiss post"]',
            'button[aria-label^="Undo and show"]',
          ]
        );
      }
    );

    nextPostPlus = new Shortcut(
      'J',
      'Toggle hiding then next post',
      async () => {

        /** Trigger function for {@link NH.web.otrot}. */
        const trigger = () => {
          this.togglePost();
        };
        if (this.posts.item) {
          const what = {
            name: 'nextPostPlus',
            base: this.posts.item,
          };
          const how = {
            trigger: trigger,
            timeout: 3000,
          };
          await NH.web.otrot(what, how);
        }
        this.nextPost();
      }
    );

    prevPostPlus = new Shortcut(
      'K',
      'Toggle hiding then previous post',
      () => {
        this.togglePost();
        this.prevPost();
      }
    );

    /** @type {Scroller~How} */
    static #commentsHow = {
      uidCallback: Feed.uniqueIdentifier,
      classes: ['dick'],
      autoActivate: true,
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #commentsWhat = {
      name: 'Feed comments',
      selectors: ['article.comments-comment-item'],
    };

    /** @type {Page~PageDetails} */
    static #details = {
      pathname: '/feed/',
      pageReadySelector: 'main',
    };

    /** @type {Scroller~How} */
    static #postsHow = {
      uidCallback: Feed.uniqueIdentifier,
      classes: ['tom'],
      snapToTop: true,
    };

    /** @type {Scroller~What} */
    static #postsWhat = {
      name: 'Feed posts',
      containerItems: [
        {
          container: 'main div.scaffold-finite-scroll__content',
          items: 'div[data-id]',
        },
      ],
    };

    static #tabSnippet = VMKeyboardService.parseSeq('tab');

    #commentScroller
    #keyboardService
    #lastScroller
    #postScroller

    #onPostActivate = () => {
      const me = 'onPostActivate';
      this.logger.entered(me);

      /**
       * Wait for the post to be reloaded.
       * @implements {NH.web.Monitor}
       * @returns {NH.web.Continuation} - Indicate whether done monitoring.
       */
      const monitor = () => {
        this.logger.log('monitor item classes:', this.posts.item.classList);
        return {
          done: !this.posts.item.classList.contains('has-occluded-height'),
        };
      };
      if (this.posts.item) {
        const what = {
          name: 'Feed onPostActivate',
          base: this.posts.item,
        };
        const how = {
          observeOptions: {
            attributeFilter: ['class'],
            attributes: true,
          },
          monitor: monitor,
          timeout: 5000,
        };
        NH.web.otmot(what, how)
          .finally(() => {
            this.posts.shine();
            this.posts.show();
          });
      }

      this.logger.leaving(me);
    }

    /** Reset the comment scroller. */
    #resetComments = () => {
      if (this.#commentScroller) {
        this.#commentScroller.destroy();
        this.#commentScroller = null;
      }
      this.comments;
    }

    #onCommentChange = () => {
      this.#lastScroller = this.comments;
    }

    /**
     * Reselects current post, triggering same actions as initial selection.
     */
    #returnToPost = () => {
      this.posts.item = this.posts.item;
    }

    /** Resets the comments {@link Scroller}. */
    #onPostChange = () => {
      const me = 'onPostChange';
      this.logger.entered(me, this.posts.item);

      this.#resetComments();
      this.#lastScroller = this.posts;

      this.logger.leaving(me);
    }

  }

  /**
   * Class for handling the base MyNetwork page.
   *
   * This page takes 3-4 seconds to load every time.  Revisits are
   * likely to take a while.
   */
  class MyNetwork extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...MyNetwork.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      spa.details.navbarScrollerFixup(MyNetwork.#collectionsHow);
      spa.details.navbarScrollerFixup(MyNetwork.#individualsHow);

      this.#collectionScroller = new Scroller(MyNetwork.#collectionsWhat,
        MyNetwork.#collectionsHow);
      this.addService(LinkedInScrollerService)
        .setScroller(this.#collectionScroller);
      this.#collectionScroller.dispatcher.on('out-of-range',
        linkedInGlobals.focusOnSidebar);
      this.#collectionScroller.dispatcher.on(
        'change', this.#onCollectionChange
      );

      this.#lastScroller = this.#collectionScroller;
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueCollectionIdentifier(element) {
      const h2 = element.querySelector('h2');
      const h3 = element.querySelector('h3');
      let content = element.innerText;
      if (h3?.innerText) {
        content = h3.innerText;
      }
      if (h2?.innerText) {
        content = h2.innerText;
      }
      return NH.base.strHash(content);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueIndividualsIdentifier(element) {
      let content = element.innerText;

      const hrefs = Array.from(element.querySelectorAll('a'))
        .filter(x => x.innerText)
        .map(x => x.href);

      if (hrefs.length) {
        content = Array.from(new Set(hrefs))
          .join(',');
      }

      return NH.base.strHash(content);
    }

    /** @type {Scroller} */
    get collections() {
      return this.#collectionScroller;
    }

    /** @type {Scroller} */
    get individuals() {
      if (!this.#individualScroller && this.collections.item) {
        this.#individualScroller = new Scroller(
          {base: this.collections.item, ...MyNetwork.#individualsWhat},
          MyNetwork.#individualsHow
        );
        this.#individualScroller.dispatcher.on(
          'change', this.#onIndividualChange
        );
        this.#individualScroller.dispatcher.on(
          'out-of-range', this.#returnToCollection
        );
      }
      return this.#individualScroller;
    }

    nextCollection = new Shortcut(
      'j',
      'Next collection',
      () => {
        this.collections.next();
      }
    );

    prevCollection = new Shortcut(
      'k',
      'Previous collection',
      () => {
        this.collections.prev();
      }
    );

    nextIndividual = new Shortcut(
      'n',
      'Next individual in collection',
      () => {
        this.individuals.next();
      }
    );

    prevIndividual = new Shortcut(
      'p',
      'Previous individual in collection',
      () => {
        this.individuals.prev();
      }
    );

    firstItem = new Shortcut(
      '<',
      'Go to the first collection or individual',
      () => {
        this.#lastScroller.first();
      }
    );

    lastItem = new Shortcut(
      '>',
      'Go to the last collection or individual',
      () => {
        this.#lastScroller.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Change browser focus to current item',
      () => {
        NH.web.focusOnElement(this.#lastScroller.item);
      }
    );

    viewItem = new Shortcut(
      'Enter',
      'View the current item',
      () => {
        if (litOptions.enableIssue241ClickMethod) {
          this.individuals.click();
        } else {
          const individual = this.individuals?.item;
          if (individual) {
            if (!NH.web.clickElement(individual, ['a', 'button'], true)) {
              NH.web.postInfoAboutElement(individual, 'network individual');
            }
          } else {
            document.activeElement.click();
          }
        }
      }
    );

    engageIndividual = new Shortcut(
      'E',
      'Engage the individual (Connect, Follow, Join, etc)',
      () => {
        const selector = [
          // Connect w/ Person, Join Group, View event
          'footer > button',
          // Follow person, Follow page
          'div.discover-entity-type-individual__container-bottom > button',
          // Subscribe to newsletter
          'div.p3 > button',
        ].join(',');

        NH.web.clickElement(this.individuals?.item, [selector]);
      }
    );

    dismissIndividual = new Shortcut(
      'X',
      'Dismiss current individual',
      () => {
        NH.web.clickElement(this.individuals?.item,
          ['button.artdeco-individual__dismiss']);
      }
    );

    /** @type {Scroller~How} */
    static #collectionsHow = {
      uidCallback: MyNetwork.uniqueCollectionIdentifier,
      classes: ['tom'],
      snapToTop: true,
    };

    /** @type {Scroller~What} */
    static #collectionsWhat = {
      name: 'MyNetwork collections',
      containerItems: [
        {
          container: 'main',
          items: [
            // Invitations
            ':scope > section.mn-invitations-preview',
            // Ads
            ':scope > div.mn-sales-navigator-upsell',
            // Most collections, including "More suggestions for you"
            ':scope div.scaffold-finite-scroll__content > div',
          ].join(','),
        },
      ],
    };

    /** @type {Page~PageDetails} */
    static #details = {
      pathname: '/mynetwork/',
      pageReadySelector: 'main > ul',
    };

    /** @type {Scroller~How} */
    static #individualsHow = {
      uidCallback: MyNetwork.uniqueIndividualsIdentifier,
      classes: ['dick'],
      autoActivate: true,
      snapToTop: false,
      clickConfig: {
        selectorArray: ['a', 'button'],
        matchSelf: true,
      },
    };

    /** @type {Scroller~What} */
    static #individualsWhat = {
      name: 'MyNetwork individuals',
      selectors: [
        [
          // Invitations -> See all
          ':scope > header > a',
          // Invitations -> individuals
          ':scope > ul > li',
          // Other collections -> See all
          ':scope > div > button',
          // Most individuals
          ':scope > div > ul > li',
        ].join(','),
      ],
    };

    #collectionScroller
    #individualScroller
    #keyboardService
    #lastScroller

    #resetIndividuals = () => {
      if (this.#individualScroller) {
        this.#individualScroller.destroy();
        this.#individualScroller = null;
      }
      this.individuals;
    }

    #onIndividualChange = () => {
      this.#lastScroller = this.individuals;
    }

    #onCollectionChange = () => {
      this.#resetIndividuals();
      this.#lastScroller = this.collections;
    }

    #returnToCollection = () => {
      this.collections.item = this.collections.item;
    }

  }

  /** Base class for handling the different Invitation manager pages. */
  class InvitationManagerBase extends Page {

    /**
     * @param {SPA} spa - SPA instance that manages this Page.
     * @param {string|RegExp} pathname - Portion of the URL this page should
     * handle.
     */
    constructor(spa, pathname) {
      const pageDetails = {
        spa: spa,
        pathname: pathname,
        pageReadySelector: InvitationManagerBase.#pageReadySelector,
      };
      super(pageDetails);

      spa.details.navbarScrollerFixup(
        InvitationManagerBase.#invitesHow
      );

      this.#inviteScroller = new Scroller(
        InvitationManagerBase.#invitesWhat,
        InvitationManagerBase.#invitesHow
      );
      this.addService(LinkedInScrollerService)
        .setScroller(this.#inviteScroller);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueIdentifier(element) {
      let content = element.innerText;
      const anchor = element.querySelector('a');
      if (anchor?.href) {
        content = anchor.href;
      }
      return NH.base.strHash(content);
    }

    /** @type {Scroller} */
    get invites() {
      return this.#inviteScroller;
    }

    nextInvite = new Shortcut(
      'j',
      'Next invitation',
      () => {
        this.invites.next();
      }
    );

    prevInvite = new Shortcut(
      'k',
      'Previous invitation',
      () => {
        this.invites.prev();
      }
    );

    firstInvite = new Shortcut(
      '<',
      'Go to the first invitation',
      () => {
        this.invites.first();
      }
    );

    lastInvite = new Shortcut(
      '>',
      'Go to the last invitation',
      () => {
        this.invites.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Change browser focus to current item',
      () => {
        const item = this.invites.item;
        NH.web.focusOnElement(item);
      }
    );

    seeMore = new Shortcut(
      'm',
      'Toggle seeing more of current invite',
      () => {
        NH.web.clickElement(
          this.invites?.item,
          ['a.lt-line-clamp__more, a.lt-line-clamp__less']
        );
      }
    );

    static #invitesHow = {
      uidCallback: InvitationManagerBase.uniqueIdentifier,
      classes: ['tom'],
    };

    /** @type {Scroller~What} */
    static #invitesWhat = {
      name: 'Invitation cards',
      containerItems: [
        {
          container: 'main > section ul.mn-invitation-list',
          items: ':scope > li',
        },
      ],
    };

    static #pageReadySelector = '#compactfooter-about';

    #inviteScroller

  }

  /** Class for handling the Invitation manager for received invites page. */
  class InvitationManagerReceivedInvites extends InvitationManagerBase {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super(spa, InvitationManagerReceivedInvites.#pathname);

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);
    }

    viewInviter = new Shortcut(
      'i',
      'View inviter',
      () => {
        NH.web.clickElement(this.invites?.item,
          ['a.app-aware-link:not(.invitation-card__picture)']);
      }
    );

    viewTarget = new Shortcut(
      't',
      'View invitation target ' +
        '(may not be the same as inviter, e.g., Newsletter)',
      () => {
        NH.web.clickElement(this.invites?.item,
          ['a.invitation-card__picture']);
      }
    );

    tabList = new Shortcut(
      'l',
      'Go to invitations tab list',
      () => {
        const me = 'tabList';
        this.logger.entered(me);

        NH.web.focusOnElement(document.querySelector(
          InvitationManagerReceivedInvites.#invitationTabSelectorCurrent
        ));

        this.logger.leaving(me);
      }
    );

    acceptInvite = new Shortcut(
      'A',
      'Accept invite',
      () => {
        NH.web.clickElement(this.invites?.item,
          ['button[aria-label^="Accept"]']);
      }
    );

    ignoreInvite = new Shortcut(
      'I',
      'Ignore invite',
      () => {
        NH.web.clickElement(this.invites?.item,
          ['button[aria-label^="Ignore"]']);
      }
    );

    messageInviter = new Shortcut(
      'M',
      'Message inviter',
      () => {
        NH.web.clickElement(this.invites?.item,
          ['button[aria-label*=" message"]']);
      }
    );

    static #invitationTabSelector = 'main div.artdeco-tablist';
    static #invitationTabSelectorCurrent =
      `${InvitationManagerReceivedInvites.#invitationTabSelector} ` +
      '[aria-selected="true"]';

    static #pathname = '/mynetwork/invitation-manager/';

    #keyboardService

  }

  /** Class for handling the Invitation manager for sent invites page. */
  class InvitationManagerSentInvites extends InvitationManagerBase {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super(spa, InvitationManagerSentInvites.#pathname);

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);
    }

    viewTarget = new Shortcut(
      't',
      'View invitation target ' +
        '(may not be the same as inviter, e.g., Newsletter)',
      () => {
        NH.web.clickElement(this.invites?.item,
          ['a.invitation-card__picture']);
      }
    );

    tabList = new Shortcut(
      'l',
      'Go to invitations tab list',
      () => {
        const me = 'tabList';
        this.logger.entered(me);

        NH.web.focusOnElement(document.querySelector(
          InvitationManagerSentInvites.#invitationTabSelectorCurrent
        ));

        this.logger.leaving(me);
      }
    );

    withDraw = new Shortcut(
      'W',
      'Withdraw invitation',
      () => {
        NH.web.clickElement(this.invites?.item,
          ['button[aria-label^="Withdraw invitation"]']);
      }
    );

    static #invitationTabSelector = 'main div.artdeco-tablist';
    static #invitationTabSelectorCurrent =
      `${InvitationManagerSentInvites.#invitationTabSelector} ` +
      '[aria-selected="true"]';

    static #pathname = '/mynetwork/invitation-manager/sent/';

    #keyboardService

  }

  /**
   * Class for handling the base Jobs page.
   *
   * This particular page requires a lot of careful monitoring.  Unlike other
   * pages, this one will destroy and recreate HTML elements, often with the
   * exact same content, every time something interesting happens.  Like
   * loading more sections or jobs, or toggling state of a job.
   */
  class Jobs extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...Jobs.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      spa.details.navbarScrollerFixup(Jobs.#sectionsHow);
      spa.details.navbarScrollerFixup(Jobs.#jobsHow);

      this.#sectionScroller = new Scroller(Jobs.#sectionsWhat,
        Jobs.#sectionsHow);
      this.addService(LinkedInScrollerService)
        .setScroller(this.#sectionScroller);
      this.#sectionScroller.dispatcher.on('out-of-range',
        linkedInGlobals.focusOnSidebar);
      this.#sectionScroller.dispatcher.on('change', this.#onSectionChange);

      this.#lastScroller = this.#sectionScroller;
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueSectionIdentifier(element) {
      const h2 = element.querySelector('h2');
      let content = element.innerText;
      if (h2?.innerText) {
        content = h2.innerText;
      }
      return NH.base.strHash(content);
    }

    /**
     * Complicated because there are so many variations.
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueJobIdentifier(element) {
      let content = element.innerText;
      let options = element.querySelectorAll('a[data-control-id]');
      if (options.length === NH.base.ONE_ITEM) {
        content = options[0].dataset.controlId;
      } else {
        options = element.querySelectorAll('a[id]');
        if (options.length === NH.base.ONE_ITEM) {
          content = options[0].id;
        } else {
          let s = '';
          for (const img of element.querySelectorAll('img[alt]')) {
            s += img.alt;
          }
          if (s) {
            content = s;
          } else {
            options = element
              .querySelectorAll('.jobs-home-upsell-card__container');
            if (options.length === NH.base.ONE_ITEM) {
              content = options[0].className;
            }
          }
        }
      }
      return NH.base.strHash(content);
    }

    /** @type {Scroller} */
    get jobs() {
      const me = 'get jobs';
      this.logger.entered(me, this.#jobScroller);

      if (!this.#jobScroller && this.sections.item) {
        this.#jobScroller = new Scroller(
          {base: this.sections.item, ...Jobs.#jobsWhat},
          Jobs.#jobsHow
        );
        this.#jobScroller.dispatcher.on('change', this.#onJobChange);
        this.#jobScroller.dispatcher.on('out-of-range',
          this.#returnToSection);
      }

      this.logger.leaving(me, this.#jobScroller);
      return this.#jobScroller;
    }

    /** @type {Scroller} */
    get sections() {
      return this.#sectionScroller;
    }

    nextSection = new Shortcut(
      'j',
      'Next section',
      () => {
        this.sections.next();
      }
    );

    prevSection = new Shortcut(
      'k',
      'Previous section',
      () => {
        this.sections.prev();
      }
    );

    nextJob = new Shortcut(
      'n',
      'Next job',
      () => {
        this.jobs.next();
      }
    );

    prevJob = new Shortcut(
      'p',
      'Previous job',
      () => {
        this.jobs.prev();
      }
    );

    firstSectionOrJob = new Shortcut(
      '<',
      'Go to to first section or job',
      () => {
        this.#lastScroller.first();
      }
    );

    lastSectionOrJob = new Shortcut(
      '>',
      'Go to last section or job currently loaded',
      () => {
        this.#lastScroller.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Change browser focus to current section or job',
      () => {
        this.sections.show();
        this.jobs?.show();
        NH.web.focusOnElement(this.#lastScroller.item);
      }
    );

    activateJob = new Shortcut(
      'Enter',
      'Activate the current job (click on it)',
      () => {
        if (litOptions.enableIssue241ClickMethod) {
          this.jobs.click();
        } else {
          const job = this.jobs?.item;
          if (job) {
            if (!NH.web.clickElement(job,
              [
                'div[data-view-name]',
                'a',
                'button',
              ])) {
              NH.web.postInfoAboutElement(job, 'job');
            }
          } else {
          // Again, because we use Enter as the hotkey for this action.
            document.activeElement.click();
          }
        }
      }
    );

    loadMoreSections = new Shortcut(
      'l',
      'Load more sections (or <i>More jobs for you</i> items)',
      async () => {
        const savedScrollTop = document.documentElement.scrollTop;

        /** Trigger function for {@link NH.web.otrot}. */
        function trigger() {
          NH.web.clickElement(document,
            ['main button.scaffold-finite-scroll__load-button']);
        }
        const what = {
          name: 'loadMoreSections',
          base: document.querySelector('div.scaffold-finite-scroll__content'),
        };
        const how = {
          trigger: trigger,
          timeout: 3000,
        };
        await NH.web.otrot(what, how);
        this.#resetScroll(savedScrollTop);
      }
    );

    toggleSaveJob = new Shortcut(
      'S',
      'Toggle saving job',
      () => {
        const selector = [
          'button[aria-label^="Save job"]',
          'button[aria-label^="Unsave job"]',
        ].join(',');
        NH.web.clickElement(this.jobs?.item, [selector]);
      }
    );

    toggleDismissJob = new Shortcut(
      'X',
      'Toggle dismissing job',
      async () => {
        const savedJob = this.jobs.item;

        /** Trigger function for {@link NH.web.otrot}. */
        function trigger() {
          const selector = [
            'button[aria-label^="Dismiss job"]:not([disabled])',
            'button[aria-label$=" Undo"]',
          ].join(',');
          NH.web.clickElement(savedJob, [selector]);
        }
        if (savedJob) {
          const what = {
            name: 'toggleDismissJob',
            base: savedJob,
          };
          const how = {
            trigger: trigger,
            timeout: 3000,
          };
          await NH.web.otrot(what, how);
          this.jobs.item = savedJob;
        }
      }
    );

    /** @type {Page~PageDetails} */
    static #details = {
      pathname: '/jobs/',
      pageReadySelector: LinkedInGlobals.asideSelector,
    };

    /** @type {Scroller~How} */
    static #jobsHow = {
      uidCallback: Jobs.uniqueJobIdentifier,
      classes: ['dick'],
      autoActivate: true,
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #jobsWhat = {
      name: 'Job entries',
      selectors: [
        [
          // Recent job searches
          ':scope > ul > li.jobs-home-recent-searches__list-item',
          // Recent job searches show more button
          ':scope > div.jobs-home-recent-searches__list-toggle',
          // Most job entries
          ':scope > ul > li.discovery-templates-entity-item',
          // Show all button
          'div.discovery-templates-vertical-list__footer',
        ].join(','),
      ],
    };

    /** @type {Scroller~How} */
    static #sectionsHow = {
      uidCallback: Jobs.uniqueSectionIdentifier,
      classes: ['tom'],
      snapToTop: true,
    };

    /** @type {Scroller~What} */
    static #sectionsWhat = {
      name: 'Jobs sections',
      containerItems: [{container: 'main', items: 'section'}],
    };

    #jobScroller
    #keyboardService
    #lastScroller
    #sectionScroller

    /** Reset the jobs scroller. */
    #resetJobs = () => {
      const me = 'resetJobs';
      this.logger.entered(me, this.#jobScroller);

      if (this.#jobScroller) {
        this.#jobScroller.destroy();
        this.#jobScroller = null;
      }
      this.jobs;

      this.logger.leaving(me);
    }

    /**
     * Reselects current section, triggering same actions as initial
     * selection.
     */
    #returnToSection = () => {
      this.sections.item = this.sections.item;
    }

    #onJobChange = () => {
      this.#lastScroller = this.jobs;
    }

    /**
     * Updates {@link Jobs} specific watcher data and removes the jobs
     * {@link Scroller}.
     */
    #onSectionChange = () => {
      const me = 'onSectionChange';
      this.logger.entered(me);

      this.#resetJobs();
      this.#lastScroller = this.sections;

      this.logger.leaving(me);
    }

    /**
     * Recover scroll position after elements were recreated.
     * @param {number} topScroll - Where to scroll to.
     */
    #resetScroll = (topScroll) => {
      const me = 'resetScroll';
      this.logger.entered(me, topScroll);

      // Explicitly setting jobs.item below will cause it to scroll to that
      // item.  We do not want to do that if the user is manually scrolling.
      const savedJob = this.jobs?.item;
      this.sections.shine();
      // Section was probably rebuilt, assume jobs scroller is invalid.
      this.#resetJobs();
      if (savedJob) {
        this.jobs.item = savedJob;
      }
      document.documentElement.scrollTop = topScroll;

      this.logger.leaving(me);
    }

  }

  /** Class for handling Job collections. */
  class JobCollections extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...JobCollections.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      this.#jobCardScroller = new Scroller(JobCollections.#jobCardsWhat,
        JobCollections.#jobCardsHow);
      this.addService(LinkedInScrollerService)
        .setScroller(this.#jobCardScroller)
        .allowReactivation(false);
      this.#jobCardScroller.dispatcher.on('activate',
        this.#onJobCardActivate);
      this.#jobCardScroller.dispatcher.on('change', this.#onJobCardChange);

      this.#paginationScroller = new Scroller(
        JobCollections.#paginationWhat, JobCollections.#paginationHow
      );
      this.addService(LinkedInScrollerService)
        .setScroller(this.#paginationScroller)
        .allowReactivation(false);
      this.#paginationScroller.dispatcher.on('activate',
        this.#onPaginationActivate);
      this.#paginationScroller.dispatcher.on('change',
        this.#onPaginationChange);

      spa.details.navbarScrollerFixup(JobCollections.#detailsHow);
      this.#detailsScroller = new Scroller(
        JobCollections.#detailsWhat, JobCollections.#detailsHow
      );
      this.addService(LinkedInScrollerService)
        .setScroller(this.#detailsScroller)
        .allowReactivation(false);
      this.#detailsScroller.dispatcher.on('change', this.#onDetailsChange);

      this.#lastScroller = this.#jobCardScroller;
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueDetailsIdentifier(element) {
      let content = element.innerText;
      if (element.id) {
        content = element.id;
      } else {
        const hasId = element.querySelector('[id]:not([id^="ember"])');
        if (hasId) {
          content = hasId.id;
        } else {
          const h2 = Array.from(element.querySelectorAll('h2'))
            .filter(x => x.innerText.trim());
          if (h2.length) {
            content = h2[0].innerText.trim();
          } else {
            const tags = new Set();
            element.querySelectorAll('*')
              .forEach((x) => {
                tags.add(x.tagName);
              });
            this.logger.log(
              'uniqueDetailsIdentifier tags we might use for a better uid:',
              tags
            );
          }
        }
      }
      const hash = NH.base.strHash(content);
      return hash;
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueJobIdentifier(element) {
      let content = '';
      if (element) {
        content = element.dataset.occludableJobId;
      }
      return NH.base.strHash(content);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniquePaginationIdentifier(element) {
      let content = '';
      if (element) {
        content = element.innerText;
        const label = element.getAttribute('aria-label');
        if (label) {
          content = label;
        }
      }
      return NH.base.strHash(content);
    }

    /** @type {Scroller} */
    get details() {
      return this.#detailsScroller;
    }

    /** @type {Scroller} */
    get jobCards() {
      return this.#jobCardScroller;
    }

    /** @type {Scroller} */
    get paginator() {
      return this.#paginationScroller;
    }

    nextJob = new Shortcut(
      'j',
      'Next job card',
      () => {
        this.jobCards.next();
      }
    );

    prevJob = new Shortcut(
      'k',
      'Previous job card',
      () => {
        this.jobCards.prev();
      }
    );

    nextDetail = new Shortcut(
      'n',
      'Next job detail',
      () => {
        this.details.next();
      }
    );

    prevDetail = new Shortcut(
      'p',
      'Previous job detail',
      () => {
        this.details.prev();
      }
    );

    nextResultsPage = new Shortcut(
      'N',
      'Next results page',
      () => {
        this.paginator.next();
      }
    );

    prevResultsPage = new Shortcut(
      'P',
      'Previous results page',
      () => {
        this.paginator.prev();
      }
    );

    firstItem = new Shortcut(
      '<',
      'Go to first job or results page',
      () => {
        this.#lastScroller.first();
      }
    );

    lastItem = new Shortcut(
      '>',
      'Go to last job currently loaded or results page',
      () => {
        this.#lastScroller.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Move browser focus to most recently selected item',
      () => {
        NH.web.focusOnElement(this.#lastScroller.item);
      }
    );

    detailsPane = new Shortcut(
      'd',
      'Jump to details pane',
      () => {
        NH.web.focusOnElement(document.querySelector(
          'div.jobs-details__main-content'
        ));
      }
    );

    selectCurrentResultsPage = new Shortcut(
      'c',
      'Select current results page',
      () => {
        NH.web.clickElement(this.paginator.item, ['button']);
      }
    );

    openShareMenu = new Shortcut(
      's',
      'Open share menu',
      () => {
        NH.web.clickElement(document, ['button[aria-label="Share"]']);
      }
    );

    openMeatballMenu = new Shortcut(
      '=',
      'Open the <button class="spa-meatball">⋯</button> menu',
      () => {
        // XXX: There are TWO buttons.  The *first* one is hidden until the
        // user scrolls down.  This always triggers the first one.
        NH.web.clickElement(document, ['.jobs-options button']);
      }
    );

    applyToJob = new Shortcut(
      'A',
      'Apply to job (or previous application)',
      () => {
        // XXX: There are TWO apply buttons.  The *second* one is hidden until
        // the user scrolls down.  This always triggers the first one.
        const selectors = [
          // Apply and Easy Apply buttons
          'button[aria-label*="Apply to"]',
          // See application link
          'a[href^="/jobs/tracker"]',
        ];
        NH.web.clickElement(document, selectors);
      }
    );

    toggleSaveJob = new Shortcut(
      'S',
      'Toggle saving job',
      () => {
        // XXX: There are TWO buttons.  The *first* one is hidden until the
        // user scrolls down.  This always triggers the first one.
        NH.web.clickElement(document, ['button.jobs-save-button']);
      }
    );

    toggleDismissJob = new Shortcut(
      'X', 'Toggle dismissing job, if available', () => {
        // Currently these two are the same, but one never knows.
        this.toggleThumbsDown();
      }
    );

    nextJobPlus = new Shortcut(
      'J',
      'Toggle dismissing then next job card',
      async () => {

        /** Trigger function for {@link NH.web.otrot}. */
        const trigger = () => {
          this.toggleThumbsDown();
        };

        if (this.jobCards.item) {
          const what = {
            name: 'nextJobPlus',
            base: this.jobCards.item,
          };
          const how = {
            trigger: trigger,
            timeout: 3000,
          };
          await NH.web.otrot(what, how);
        }

        this.nextJob();
      }
    );

    prevJobPlus = new Shortcut(
      'K',
      'Toggle dismissing then previous job card',
      () => {
        this.toggleThumbsDown();
        this.prevJob();
      }
    );

    toggleFollowCompany = new Shortcut(
      'F', 'Toggle following company', () => {
        // The button toggles between Follow and Following
        NH.web.clickElement(document, ['button[aria-label^="Follow"]']);
      }
    );

    toggleAlert = new Shortcut(
      'L', 'Toggle the job search aLert, if available', () => {
        NH.web.clickElement(document,
          ['main .jobs-search-create-alert__artdeco-toggle']);
      }
    );

    toggleThumbsUp = new Shortcut(
      '+', 'Toggle thumbs up, if available', () => {
        const selector = [
          'button[aria-label="Like job"]',
          'button[aria-label="Job is liked, undo"]',
        ].join(',');
        NH.web.clickElement(this.jobCards.item, [selector]);
      }
    );

    toggleThumbsDown = new Shortcut(
      '-', 'Toggle thumbs down, if available', () => {
        const selector = [
          'button[aria-label^="Dismiss job"]:not([disabled])',
          'button[aria-label="Job is dismissed, undo"]',
          'button[aria-label$=" Undo"]',
        ].join(',');
        NH.web.clickElement(this.jobCards.item, [selector]);
      }
    );

    /** @type {Page~PageDetails} */
    static #details = {
      // eslint-disable-next-line prefer-regex-literals
      pathname: RegExp('^/jobs/(?:collections|search)/.*', 'u'),
      pageReadySelector: 'footer.global-footer-compact',
    };

    /** @type {Scroller~How} */
    static #detailsHow = {
      uidCallback: JobCollections.uniqueDetailsIdentifier,
      classes: ['dick'],
      snapToTop: true,
    };

    /** @type {Scroller~What} */
    static #detailsWhat = {
      name: 'JobCollections details',
      containerItems: [
        {
          container: 'div.jobs-details__main-content',
          items: ':scope > div, :scope > section',
        },
      ],
    };

    /** @type {Scroller~How} */
    static #jobCardsHow = {
      uidCallback: this.uniqueJobIdentifier,
      classes: ['tom'],
      snapToTop: false,
      bottomMarginCSS: '3em',
    };

    /** @type {Scroller~What} */
    static #jobCardsWhat = {
      name: 'JobCollections cards',
      containerItems: [
        {
          container: 'div.jobs-search-results-list > ul',
          // This selector is also used in #onJobCardActivate.
          items: ':scope > li',
        },
      ],
    };

    /** @type {Scroller~How} */
    static #paginationHow = {
      uidCallback: this.uniquePaginationIdentifier,
      classes: ['dick'],
      snapToTop: false,
      bottomMarginCSS: '3em',
      containerTimeout: 1000,
    };

    /** @type {Scroller~What} */
    static #paginationWhat = {
      name: 'JobCollections pagination',
      containerItems: [
        {
          container: 'div.jobs-search-results-list__pagination > ul',
          // This selector is also used in #onJobCardActivate.
          items: ':scope > li',
        },
      ],
    };

    #detailsScroller
    #jobCardScroller
    #keyboardService
    #lastScroller
    #paginationScroller

    #onJobCardActivate = async () => {
      const me = 'onJobCardActivate';
      this.logger.entered(me);

      const params = new URL(document.location).searchParams;
      const jobId = params.get('currentJobId');
      this.logger.log('Looking for job card for', jobId);

      // Wait some amount of time for a job card to show up, if it ever does.
      // Annoyingly enough, the selection of jobs that shows up on a reload
      // may not include one for the current URL.  Even if the user arrived at
      // the URL moments ago.

      try {
        const timeout = 2000;
        const item = await NH.web.waitForSelector(
          `li[data-occludable-job-id="${jobId}"]`,
          timeout
        );
        this.logger.log('Found', item);
        this.jobCards.gotoUid(JobCollections.uniqueJobIdentifier(item));
        this.logger.log('and went to it');
      } catch (e) {
        this.logger.log('Job card matching URL not found, staying put');
      }

      this.logger.leaving(me);
    }

    #onJobCardChange = () => {
      const me = 'onJobCardChange';
      this.logger.entered(me, this.jobCards.item);

      this.logger.log('click');
      NH.web.clickElement(this.jobCards.item, ['div[data-job-id]']);
      this.logger.log('first');
      this.details.first();
      this.logger.log('last');
      this.#lastScroller = this.jobCards;

      this.logger.leaving(me);
    }

    #onPaginationActivate = async () => {
      const me = 'onPaginationActivate';
      this.logger.entered(me);

      try {
        const timeout = 2000;
        const item = await NH.web.waitForSelector(
          'div.jobs-search-results-list__pagination > ul > li.selected',
          timeout
        );
        this.paginator.goto(item);
      } catch (e) {
        this.logger.log('Results paginator not found, staying put');
      }

      this.logger.leaving(me);
    }

    #onPaginationChange = () => {
      this.#lastScroller = this.paginator;
    }

    #onDetailsChange = () => {
      this.#lastScroller = this.details;
    }

  }

  /** Class for handling the direct Job view. */
  class JobView extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...JobView.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      this.addService(LinkedInToolbarService, this)
        .addHows(JobView.#cardsHow, JobView.#entriesHow)
        .postActivateHook(this.#toolbarHook);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueCardIdentifier(element) {
      const div = element.querySelector('div');
      let content = element.innerText;
      if (div?.id) {
        content = div.id;
      }
      return NH.base.strHash(content);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueEntryIdentifier(element) {
      const content = element.innerText;
      return NH.base.strHash(content);
    }

    /** @type {Scroller} */
    get cards() {
      if (!this.#cardScroller) {
        this.#cardScroller = new Scroller(JobView.#cardsWhat,
          JobView.#cardsHow);
        this.addService(LinkedInScrollerService)
          .setScroller(this.#cardScroller);
        this.#cardScroller.dispatcher.on('change', this.#onCardChange);

        this.#lastScroller = this.#cardScroller;
      }
      return this.#cardScroller;
    }

    /** @type {Scroller} */
    get entries() {
      if (!this.#entryScroller && this.cards.item) {
        this.#entryScroller = new Scroller(
          {base: this.cards.item, ...JobView.#entriesWhat},
          JobView.#entriesHow
        );
        this.#entryScroller.dispatcher.on('change', this.#onEntryChange);
        this.#entryScroller.dispatcher.on(
          'out-of-range', this.#returnToCard
        );
      }
      return this.#entryScroller;
    }

    nextCard = new Shortcut(
      'j',
      'Next card',
      () => {
        this.cards.next();
      }
    );

    prevCard = new Shortcut(
      'k',
      'Previous card',
      () => {
        this.cards.prev();
      }
    );

    nextEntry = new Shortcut(
      'n',
      'Next entry in a section',
      () => {
        this.entries.next();
      }
    );

    prevEntry = new Shortcut(
      'p',
      'Previous entry in a section',
      () => {
        this.entries.prev();
      }
    );

    firstItem = new Shortcut(
      '<',
      'Go to the first card',
      () => {
        this.#lastScroller.first();
      }
    );

    lastItem = new Shortcut(
      '>',
      'Go to the last card',
      () => {
        this.#lastScroller.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Change browser focus to current item',
      () => {
        NH.web.focusOnElement(this.#lastScroller.item);
      }
    );

    showMore = new Shortcut(
      'm',
      'Show more/less of current item (some may go to new page)',
      () => {
        const el = this.#lastScroller.item;
        if (el) {
          // TODO(#160): "About the job" will lose shine
          NH.web.clickElement(el, [
            // About the job
            'button[aria-label^="Click to see more"]',
            'button[aria-label^="Click to see less"]',
            // About the company, overflow
            'button.inline-show-more-text__button',
            // About the company, visit company page
            'a[aria-label="Show more about the company"]',
          ]);
        }
      }
    );

    applyToJob = new Shortcut(
      'A',
      'Apply to job',
      () => {
        NH.web.clickElement(document, ['button.jobs-apply-button']);
      }
    );

    toggleFollowCompany = new Shortcut(
      'F', 'Toggle following company', () => {
        NH.web.clickElement(document, ['button.follow']);
      }
    );

    toggleSaveJob = new Shortcut(
      'S',
      'Toggle saving job',
      () => {
        NH.web.clickElement(document, ['button.jobs-save-button']);
      }
    );

    /** @type {Scroller~How} */
    static #cardsHow = {
      uidCallback: JobView.uniqueCardIdentifier,
      classes: ['tom'],
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #cardsWhat = {
      name: 'JobView cards',
      containerItems: [
        {
          container: '[role="main"]',
          items: [
            // Many items
            ':scope > .artdeco-card, :scope > * > .artdeco-card',
            // More jobs - Yes, suspicious looking class
            ':scope > .ml0',
          ].join(','),
        },
      ],
    };

    /** @type {Page~PageDetails} */
    static #details = {
      // eslint-disable-next-line prefer-regex-literals
      pathname: RegExp('^/jobs/view/\\d+.*', 'u'),
      pageReadySelector: 'div.jobs-company__content,div.jobs-similar-jobs',
    };

    /** @type {Scroller~How} */
    static #entriesHow = {
      uidCallback: JobView.uniqueEntryIdentifier,
      classes: ['dick'],
      autoActivate: true,
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #entriesWhat = {
      name: 'JobView entries',
      selectors: [
        // More jobs
        ':scope > ul > section',
      ],
    };

    #cardScroller
    #entryScroller
    #keyboardService
    #lastScroller

    #toolbarHook = () => {
      const me = 'toolbarHook';
      this.logger.entered(me);

      this.logger.log('Initializing scroller:', this.cards.item);

      this.logger.leaving(me);
    }

    #onCardChange = () => {
      this.#resetEntries();
      this.#lastScroller = this.cards;
    }

    #resetEntries = () => {
      if (this.#entryScroller) {
        this.#entryScroller.destroy();
        this.#entryScroller = null;
      }
      this.entries;
    }

    #onEntryChange = () => {
      this.#lastScroller = this.entries;
    }

    #returnToCard = () => {
      this.cards.item = this.cards.item;
    }

  }

  /** Class for handling the Messaging page. */
  class Messaging extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...Messaging.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      // Focused/Other tab
      this.#messagingTablistObserver =
        new MutationObserver(this.#messagingTablistHandler);

      this.#convoCardScroller = new Scroller(Messaging.#convoCardsWhat,
        Messaging.#convoCardsHow);
      this.addService(LinkedInScrollerService)
        .setScroller(this.#convoCardScroller);
      this.#convoCardScroller.dispatcher.on('activate',
        this.#onConvoCardActivate);
      this.#convoCardScroller.dispatcher.on('deactivate',
        this.#onConvoCardDeactivate);
      this.#convoCardScroller.dispatcher.on('change',
        this.#onConvoCardChange);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueConvoCardsIdentifier(element) {
      let content = element.innerText;
      const anchor = element.querySelector('a');
      if (anchor?.href) {
        content = anchor.href;
      }
      return NH.base.strHash(content);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueMessageIdentifier(element) {
      return NH.base.strHash(element.dataset.eventUrn);
    }

    /** @type {Scroller} */
    get convoCards() {
      return this.#convoCardScroller;
    }

    /** @type {Scroller} */
    get messages() {
      const me = 'get messages';
      this.logger.entered(me, this.convoCards.item);

      if (!this.#messageScroller && this.convoCards.item) {
        this.#messageScroller = new Scroller(
          Messaging.#messagesWhat, Messaging.#messagesHow
        );
        this.#messageScroller.dispatcher.on('change', this.#onMessageChange);
      }

      this.logger.leaving(me, this.#messageScroller);
      return this.#messageScroller;
    }

    nextConvo = new Shortcut(
      'j',
      'Next conversation card',
      () => {
        this.convoCards.next();
      }
    );

    prevConvo = new Shortcut(
      'k',
      'Previous conversation card',
      () => {
        this.convoCards.prev();
      }
    );

    nextMessage = new Shortcut(
      'n',
      'Next message in conversation',
      () => {
        this.messages.next();
      }
    );

    prevMessage = new Shortcut(
      'p',
      'Previous message in conversation',
      () => {
        this.messages.prev();
      }
    );

    firstItem = new Shortcut(
      '<',
      'First conversation card or message',
      () => {
        this.#lastScroller.first();
      }
    );

    lastItem = new Shortcut(
      '>',
      'Last conversation card or message',
      () => {
        this.#lastScroller.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Move browser focus to most recently selected item',
      () => {
        NH.web.focusOnElement(this.#lastScroller.item);
      }
    );

    loadMoreConversations = new Shortcut(
      'l',
      'Load more conversations',
      () => {
        const me = 'loadMoreConversations';
        this.logger.entered(me);

        // This button has no distinguishing features, so look for the text
        // the nested span, then click the button.
        const span = Array.from(document.querySelectorAll('button > span'))
          .find(el => el.innerText === 'Load more conversations');
        span?.parentElement?.click();

        this.logger.leaving(me);
      }
    );

    messageTab = new Shortcut(
      'm',
      'Go to messaging tablist',
      () => {
        const me = 'messageTab';
        this.logger.entered(me);

        NH.web.focusOnElement(
          document.querySelector(Messaging.#messagingTabSelectorCurrent)
        );

        this.logger.leaving(me);
      }
    );

    searchMessages = new Shortcut(
      's',
      'Go to Search messages',
      () => {
        const me = 'searchMessages';
        this.logger.entered(me);

        NH.web.focusOnElement(
          document.querySelector('#search-conversations')
        );

        this.logger.leaving(me);
      }
    );

    openMeatballMenu = new Shortcut(
      '=',
      'Open closest <button class="spa-meatball">⋯</button> menu (tricky, ' +
        'as there are currently four buttons to choose from)',
      () => {
        if (this.convoCards.item.contains(document.activeElement) ||
            this.messages.item?.contains(document.activeElement)) {
          let buttons = null;
          if (this.#lastScroller === this.convoCards) {
            buttons = this.convoCards.item.querySelectorAll('button');
            if (buttons.length === NH.base.ONE_ITEM) {
              buttons[0].click();
            } else {
              NH.base.issues.post(
                'Current conversation card does not have only one button',
                this.convoCards.item.outerHTML
              );
            }
          } else {
            this.logger.log('Using messages', this.messages.item);
            buttons = document.querySelectorAll(
              'div.msg-title-bar button.msg-thread-actions__control'
            );
            if (buttons.length === NH.base.ONE_ITEM) {
              buttons[0].click();
            } else {
              const msgs = Array.from(buttons)
                .map(x => x.outerHTML);
              NH.base.issues.post(
                'The message title bar did not have exactly one button ' +
                  'matching the search criteria',
                ...msgs
              );
            }
          }
        } else {
          this.#clickClosestMenuButton();
        }
      }
    );

    messageBox = new Shortcut(
      'M',
      'Go to the <i>Write a message</i> box',
      () => {
        NH.web.clickElement(document, [Messaging.#messageBoxSelector]);
      }
    );

    newMessage = new Shortcut(
      'N',
      'Compose a new message',
      () => {
        const me = 'newMessage';
        this.logger.entered(me);

        NH.web.clickElement(document,
          ['a[aria-label="Compose a new message"]']);

        this.logger.leaving(me);
      }
    );

    toggleStar = new Shortcut(
      'S',
      'Toggle star on the current conversation',
      () => {
        const selector = [
          'button[aria-label^="Star conversation"]',
          'button[aria-label^="Remove star"]',
        ].join(',');
        NH.web.clickElement(document, [selector]);
      }
    );

    /** @type {Scroller~How} */
    static #convoCardsHow = {
      uidCallback: Messaging.uniqueConvoCardsIdentifier,
      classes: ['tom'],
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #convoCardsWhat = {
      name: 'Messaging conversations',
      containerItems: [
        {
          container:
          'main ul.msg-conversations-container__conversations-list',
          items: ':scope > li.msg-conversations-container__pillar',
        },
      ],
    };

    /** @type {Page~PageDetails} */
    static #details = {
      // eslint-disable-next-line prefer-regex-literals
      pathname: RegExp('^/messaging/.*', 'u'),
      pageReadySelector: LinkedInGlobals.asideSelector,
    };

    static #messageBoxSelector = 'main div.msg-form__contenteditable';

    /** @type {Scroller~How} */
    static #messagesHow = {
      uidCallback: Messaging.uniqueMessageIdentifier,
      classes: ['dick'],
      autoActivate: true,
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #messagesWhat = {
      name: 'Messaging messages',
      containerItems: [
        {
          container: 'ul.msg-s-message-list-content',
          items:
          ':scope > li.msg-s-message-list__event > div[data-event-urn]',
        },
      ],
    };

    static #messagingOptionsSelector =
      'button[aria-label="See more messaging options"]';

    static #messagingTabSelector = 'main div.msg-focused-inbox-tabs';
    static #messagingTabSelectorCurrent =
      `${Messaging.#messagingTabSelector} [aria-selected="true"]`;

    static #sendToggleSelector = 'button.msg-form__send-toggle';

    #activator
    #convoCardScroller
    #keyboardService
    #lastConvoCard
    #lastScroller
    #messageScroller
    #messagingTablistObserver

    /**
     * @typedef {object} Point
     * @property {number} x - Horizontal location in pixels.
     * @property {number} y - Vertical location in pixels.
     * @property {HTMLElement} element - Associated element.
     */

    /**
     * @param {HTMLElement} element - Element to examine.
     * @returns {Point} - Center of the element.
     */
    #centerOfElement = (element) => {
      const TWO = 2;

      const center = {
        x: 0,
        y: 0,
        element: element,
      };
      if (element) {
        const bbox = element.getBoundingClientRect();
        this.logger.log('bbox:', bbox);
        center.x = (bbox.left + bbox.right) / TWO;
        center.y = (bbox.top + bbox.bottom) / TWO;
      }
      return center;
    }

    #clickClosestMenuButton = () => {
      // Two more buttons to choose from.  There are two ways of calculating
      // the distance from the activeElement to the buttons: Path in the DOM
      // tree or geometry.  Considering the buttons are fixed, I suspect
      // geometry is probably easier than trying to find the common ancestors.
      const messagingOptions = document.querySelector(
        Messaging.#messagingOptionsSelector
      );
      if (!messagingOptions) {
        NH.base.issues.post(
          'Unable to find the messaging options button.',
          'Selector used:',
          Messaging.#messagingOptionsSelector
        );
      }

      const sendToggle = document.querySelector(
        Messaging.#sendToggleSelector
      );
      if (!sendToggle) {
        NH.base.issues.post(
          'Unable to find the messaging send toggle button',
          'Selector used:',
          Messaging.#sendToggleSelector
        );
      }
      const activeCenter = this.#centerOfElement(document.activeElement);
      const optionsCenter = this.#centerOfElement(messagingOptions);
      const toggleCenter = this.#centerOfElement(sendToggle);
      optionsCenter.distance = this.#distanceBetweenPoints(
        activeCenter, optionsCenter
      );
      toggleCenter.distance = this.#distanceBetweenPoints(
        activeCenter, toggleCenter
      );
      const centers = [optionsCenter, toggleCenter];
      centers.sort((a, b) => a.distance - b.distance);
      centers[0].element.click();
    }

    /**
     * @param {Point} one - First point.
     * @param {Point} two - Second point.
     * @returns {number} - Distance between the points in pixels.
     */
    #distanceBetweenPoints = (one, two) => {
      const me = 'distanceBetweenPoints';
      this.logger.entered(me, one, two);

      const xd = one.x - two.x;
      const yd = one.y - two.y;
      const distance = Math.sqrt((xd * xd) + (yd * yd));

      this.logger.leaving(me, distance);
      return distance;
    }

    #onConvoCardActivate = async () => {
      const me = 'onConvoCardActivate';
      this.logger.entered(me);

      this.#lastConvoCard = null;
      await this.#findActiveConvo();

      const tab = document.querySelector(Messaging.#messagingTabSelector);
      this.#messagingTablistObserver.observe(tab,
        {attributes: true, subtree: true});

      this.logger.leaving(me);
    }

    #onConvoCardDeactivate = () => {
      const me = 'onConvoCardDeactivate';
      this.logger.entered(me);

      this.#messagingTablistObserver.disconnect();

      this.logger.leaving(me);
    }

    #onConvoCardChange = async () => {  // eslint-disable-line max-lines-per-function
      const me = 'onConvoCardChange';
      this.logger.entered(me);

      const msgBox = document.querySelector(Messaging.#messageBoxSelector);
      let gotFocus = false;
      const currentCard = this.convoCards.item;

      /** Basic event handler. */
      const onFocus = () => {
        gotFocus = true;
      };

      /** Trigger function for {@link NH.web.otrot}. */
      const trigger = () => {
        msgBox.addEventListener('focus', onFocus);
        NH.web.clickElement(currentCard, ['a']);
      };

      /**
       * Wait for focus in the message box.
       * @implements {NH.web.Monitor}
       * @returns {NH.web.Continuation} - Indicate whether done monitoring.
       */
      const monitor = () => {
        this.logger.log('monitor:', gotFocus, msgBox);
        return {
          done: gotFocus,
        };
      };

      const what = {
        name: `${this.constructor.name} ${me}`,
        base: msgBox,
      };
      const how = {
        observeOptions: {
          attributes: true,
        },
        monitor: monitor,
        trigger: trigger,
        timeout: 500,
      };

      // Some methods in `Scroller` will reset the current item to itself,
      // resulting in a 'change' event (necessary for containers that redraw
      // themselves).  In this case, we want to ignore that particular reset.
      if (currentCard && currentCard !== this.#lastConvoCard) {
        try {
          await NH.web.otmot(what, how);
        } catch (e) {
          this.logger.log(
            'Focus moving to message box not detected, staying put'
          );
        } finally {
          msgBox.removeEventListener('focus', onFocus);
          NH.web.focusOnElement(currentCard);
        }
        this.#lastConvoCard = currentCard;
      }

      this.#resetMessages();
      this.#lastScroller = this.convoCards;

      this.logger.leaving(me);
    }

    #resetMessages = () => {
      if (this.#messageScroller) {
        this.#messageScroller.destroy();
        this.#messageScroller = null;
      }
      this.messages;
    }

    #onMessageChange = () => {
      this.#lastScroller = this.messages;
    }

    #findActiveConvo = async () => {
      const me = 'findActiveConvo';
      this.logger.entered(me);

      // Look for 'a.active'
      try {
        const timeout = 2000;
        const item = await NH.web.waitForSelector('li a.active', timeout);
        this.convoCards.goto(item.closest('li'));
      } catch (e) {
        this.logger.log('Active conversation card not found, staying put');
      }

      this.logger.leaving(me);
    }

    #messagingTablistHandler = async () => {
      const me = 'messagingTablistHandler';
      this.logger.entered(me);

      await this.#findActiveConvo();

      this.logger.leaving(me);
    }

  }

  /** Class for handling the Notifications page. */
  class Notifications extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...Notifications.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      spa.details.navbarScrollerFixup(Notifications.#notificationsHow);

      this.#notificationScroller = new Scroller(
        Notifications.#notificationsWhat, Notifications.#notificationsHow
      );
      this.addService(LinkedInScrollerService)
        .setScroller(this.#notificationScroller);
      this.#notificationScroller.dispatcher.on('out-of-range',
        linkedInGlobals.focusOnSidebar);
    }

    /**
     * Complicated because there are so many variations in notification cards.
     * We do not want to use reaction counts because they can change too
     * quickly.
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueIdentifier(element) {
      // All known <articles> have three children: icon/presence indicator,
      // content, and menu/timestamp.
      const MAGIC_COUNT = 3;
      const CONTENT_INDEX = 1;
      let content = element.innerText;
      if (element.childElementCount === MAGIC_COUNT) {
        content = element.children[CONTENT_INDEX].innerText;
        if (content.includes('Reactions')) {
          for (const el of element.children[CONTENT_INDEX]
            .querySelectorAll('*')) {
            if (el.innerText) {
              content = el.innerText;
              break;
            }
          }
        }
        content += element.children[CONTENT_INDEX].querySelector('a')?.href;
      }
      if (content.startsWith('Notification deleted.')) {
        // Mix in something unique from the parent.
        content += element.parentElement.dataset.finiteScrollHotkeyItem;
      }
      return NH.base.strHash(content);
    }

    /**
     * Given a notification card, find the correct item inside of it to click.
     *
     * @implements {Scroller~ElementFinder}
     * @param {HTMLElement} element - Element to examine.
     * @returns {HTMLElement} - Found element.
     */
    static cardItemToClick(element) {
      let found = null;

      const elements = element.querySelectorAll(
        '.nt-card__headline'
      );
      if (elements.length === NH.base.ONE_ITEM) {
        found = elements[0];
      } else {
        const ba = element.querySelectorAll('button,a');
        if (ba.length === NH.base.ONE_ITEM) {
          found = ba[0];
        }
      }

      return found;
    }

    /** @type {Scroller} */
    get notifications() {
      return this.#notificationScroller;
    }

    nextNotification = new Shortcut(
      'j',
      'Next notification',
      () => {
        this.notifications.next();
      }
    );

    prevNotification = new Shortcut(
      'k',
      'Previous notification',
      () => {
        this.notifications.prev();
      }
    );

    firstNotification = new Shortcut(
      '<',
      'Go to first notification',
      () => {
        this.notifications.first();
      }
    );

    lastNotification = new Shortcut(
      '>', 'Go to last notification', () => {
        this.notifications.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Change browser focus to current notification',
      () => {
        this.notifications.show();
        NH.web.focusOnElement(this.notifications.item);
      }
    );

    activateNotification = new Shortcut(
      'Enter',
      'Activate the current notification (click on it)',
      () => {
        if (litOptions.enableIssue241ClickMethod) {
          this.notifications.click();
        } else {
          const notification = this.notifications.item;
          if (notification) {
          // Because we are using Enter as the hotkey here, if the active
          // element is inside the current card, we want that to take
          // precedence.
            if (document.activeElement.closest('article') === notification) {
              return;
            }

            const elements = notification.querySelectorAll(
              '.nt-card__headline'
            );
            if (elements.length === NH.base.ONE_ITEM) {
              elements[0].click();
            } else {
              const ba = notification.querySelectorAll('button,a');
              if (ba.length === NH.base.ONE_ITEM) {
                ba[0].click();
              } else {
                NH.web.postInfoAboutElement(notification, 'notification');
              }
            }
          } else {
          // Again, because we use Enter as the hotkey for this action.
            document.activeElement.click();
          }
        }
      }
    );

    loadMoreNotifications = new Shortcut(
      'l',
      'Load more notifications',
      () => {
        const savedScrollTop = document.documentElement.scrollTop;
        let first = false;
        const notifications = this.notifications;

        /** Trigger function for {@link NH.web.otrot2}. */
        function trigger() {
          if (NH.web.clickElement(document,
            ['button[aria-label^="Load new notifications"]'])) {
            first = true;
          } else {
            NH.web.clickElement(document,
              ['main button.scaffold-finite-scroll__load-button']);
          }
        }

        /** Action function for {@link NH.web.otrot2}. */
        const action = () => {
          if (first) {
            if (notifications.item) {
              notifications.first();
            }
          } else {
            document.documentElement.scrollTop = savedScrollTop;
            this.notifications.shine();
          }
        };

        const what = {
          name: 'loadMoreNotifications',
          base: document.querySelector('div.scaffold-finite-scroll__content'),
        };
        const how = {
          trigger: trigger,
          action: action,
          duration: 2000,
        };
        NH.web.otrot2(what, how);
      }
    );

    openMeatballMenu = new Shortcut(
      '=',
      'Open the <button class="spa-meatball">⋯</button> menu',
      () => {
        NH.web.clickElement(this.notifications.item,
          ['button[aria-label^="Settings menu"]']);
      }
    );

    deleteNotification = new Shortcut(
      'X',
      'Toggle current notification deletion',
      async () => {
        const notification = this.notifications.item;

        /** Trigger function for {@link NH.web.otrot}. */
        function trigger() {
          // Hah.  Unlike in other places, these buttons already exist, just
          // hidden under the menu.
          const buttons = Array.from(notification.querySelectorAll('button'));
          const button = buttons
            .find(el => (/Delete .*notification/u).test(el.textContent));
          if (button) {
            button.click();
          } else {
            NH.web.clickElement(notification,
              ['button[aria-label^="Undo notification deletion"]']);
          }
        }
        if (notification) {
          const what = {
            name: 'deleteNotification',
            base: document.querySelector(
              'div.scaffold-finite-scroll__content'
            ),
          };
          const how = {
            trigger: trigger,
            timeout: 3000,
          };
          await NH.web.otrot(what, how);
          this.notifications.shine();
        }
      }
    );

    /** @type {Page~PageDetails} */
    static #details = {
      pathname: '/notifications/',
      pageReadySelector: 'main section div.nt-card-list',
    };

    /** @type {Scroller-How} */
    static #notificationsHow = {
      uidCallback: Notifications.uniqueIdentifier,
      classes: ['tom'],
      snapToTop: false,
      clickConfig: Notifications.cardItemToClick,
    };

    /** @type {Scroller~What} */
    static #notificationsWhat = {
      name: 'Notification cards',
      containerItems: [
        {
          container: 'main section div.nt-card-list',
          items: 'article',
        },
      ],
    };

    #keyboardService
    #notificationScroller

  }

  /** Class for handling the Profile page. */
  class Profile extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...Profile.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      this.addService(LinkedInToolbarService, this)
        .addHows(Profile.#sectionsHow, Profile.#entriesHow)
        .postActivateHook(this.#toolbarHook);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueSectionIdentifier(element) {
      const div = element.querySelector('div');
      let content = element.innerText;
      if (div?.id) {
        content = div.id;
      }
      return NH.base.strHash(content);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueEntryIdentifier(element) {
      const content = element.innerText;
      return NH.base.strHash(content);
    }

    /** @type {Scroller} */
    get entries() {
      if (!this.#entryScroller && this.sections.item) {
        this.#entryScroller = new Scroller(
          {base: this.sections.item, ...Profile.#entriesWhat},
          Profile.#entriesHow
        );
        this.#entryScroller.dispatcher.on('change', this.#onEntryChange);
        this.#entryScroller.dispatcher.on(
          'out-of-range', this.#returnToSection
        );
      }
      return this.#entryScroller;
    }

    /** @type {Scroller} */
    get sections() {
      if (!this.#sectionScroller) {
        this.#sectionScroller = new Scroller(Profile.#sectionsWhat,
          Profile.#sectionsHow);
        this.addService(LinkedInScrollerService)
          .setScroller(this.#sectionScroller);
        this.#sectionScroller.dispatcher.on('change', this.#onSectionChange);

        this.#lastScroller = this.#sectionScroller;
      }
      return this.#sectionScroller;
    }

    nextSection = new Shortcut(
      'j',
      'Next section',
      () => {
        this.sections.next();
      }
    );

    prevSection = new Shortcut(
      'k',
      'Previous section',
      () => {
        this.sections.prev();
      }
    );

    nextEntry = new Shortcut(
      'n',
      'Next entry in a section',
      () => {
        this.entries.next();
      }
    );

    prevEntry = new Shortcut(
      'p',
      'Previous entry in a section',
      () => {
        this.entries.prev();
      }
    );

    firstItem = new Shortcut(
      '<',
      'Go to the first section',
      () => {
        this.#lastScroller.first();
      }
    );

    lastItem = new Shortcut(
      '>',
      'Go to the last section',
      () => {
        this.#lastScroller.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Change browser focus to current item',
      () => {
        NH.web.focusOnElement(this.#lastScroller.item);
      }
    );

    seeMore = new Shortcut(
      'm',
      'Show more/all of current item (context sensitive, may go to new page)',
      () => {
        // Slightly more complicated than something like `Feed`.  Some items
        // (e.g., Experiences), will expand and stay that way, making it easy
        // to find the next one.  Others (e.g., Activity), will navigate away,
        // and then come back, staying collapsed.  Then there are the
        // tabpanels which have multiple links at the section level.  So, we
        // will look for the 'Show all' links in the current item first, then
        // look for buttons with 'more' in them.
        const el = this.#lastScroller.item;
        if (el) {
          const links = Array.from(el.querySelectorAll('a'))
            .filter(x => x.innerText.includes('Show all'))
            .filter(x => x.clientHeight);
          if (links.length === NH.base.ONE_ITEM) {
            links[0].click();
          } else {
            NH.web.clickElement(el, [
              'button.inline-show-more-text__button',
              'button[aria-label="More actions"]',
            ]);
          }
        }
      }
    );

    editItem = new Shortcut(
      'E',
      'Edit the current section (if possible)',
      () => {
        const current = this.sections.item;
        // And, of course, the sections are inconsistent
        if (current) {
          let item = current.querySelector(
            '[aria-label^="Edit "],[aria-label^="View "]'
          );
          if (item) {
            if (!['A', 'BUTTON'].includes(item.tagName)) {
              item = item.closest('a,button');
            }
            item.click();
          }
        }
      }
    );

    /** @type {Page~PageDetails} */
    static #details = {
      // eslint-disable-next-line prefer-regex-literals
      pathname: RegExp('^/in/.*', 'u'),
      pageReadySelector: 'aside > section[data-view-name]',
    };

    /** @type {Scroller~How} */
    static #entriesHow = {
      uidCallback: Profile.uniqueEntryIdentifier,
      classes: ['dick'],
      autoActivate: true,
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #entriesWhat = {
      name: 'Profile entries',
      // There are a couple of selector variants that work with most sections,
      // then a few specific ones.
      selectors: [
        // Common selectors (the pvs-list stuff can also be nested deep into
        // an entry, so we have to be explicit with the divs near the top.
        ':scope > div.pvs-list__outer-container > ul.pvs-list > li',
        ':scope > div > div.pvs-list__outer-container > ul.pvs-list > li',

        // Member school/work
        ':scope ul.pv-text-details__right-panel > li',
        // Member edit carousel
        ':scope ul.artdeco-carousel__slider > li',

        // Activity
        ':scope div.scaffold-finite-scroll__content > ul > li',

        // Interests/Recommendations - Have tabs inside of them to make things
        // interesting
        ':scope div[role="tablist"]',
        ':scope div[role="tabpanel"] > div.pvs-list__outer-container ' +
          '> ul.pvs-list > li',

        // Footer - catches most
        ':scope div.pvs-list__outer-container > div.pvs-list__footer-wrapper',
        ':scope > footer',

        // Catch all for debugging
        // ':scope ul > li',
      ],
    };

    /** @type {Scroller~How} */
    static #sectionsHow = {
      uidCallback: Profile.uniqueSectionIdentifier,
      classes: ['tom'],
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #sectionsWhat = {
      name: 'Profile sections',
      containerItems: [
        {
          container: 'main',
          items: [
            // Major sections
            ':scope > section',
          ].join(','),
        },
      ],
    };

    #entryScroller
    #keyboardService
    #lastScroller
    #sectionScroller

    #toolbarHook = () => {
      const me = 'toolbarHook';
      this.logger.entered(me);

      this.logger.log('Initializing scroller:', this.sections.item);

      this.logger.leaving(me);
    }

    #resetEntries = () => {
      if (this.#entryScroller) {
        this.#entryScroller.destroy();
        this.#entryScroller = null;
      }
      this.entries;
    }

    #onEntryChange = () => {
      this.#lastScroller = this.entries;
    }

    #onSectionChange = () => {
      this.#resetEntries();
      this.#lastScroller = this.sections;
    }

    #returnToSection = () => {
      this.sections.item = this.sections.item;
    }

  }

  /** Class for handling the Events page. */
  class Events extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...Events.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      spa.details.navbarScrollerFixup(Events.#collectionsHow);
      spa.details.navbarScrollerFixup(Events.#eventsHow);

      this.#collectionScroller = new Scroller(
        Events.#collectionsWhat, Events.#collectionsHow
      );
      this.addService(LinkedInScrollerService)
        .setScroller(this.#collectionScroller);

      this.#collectionScroller.dispatcher.on(
        'change', this.#onCollectionChange
      );
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueCollectionIdentifier(element) {
      const h1 = element.querySelector('h1');
      const h2 = element.querySelector('h2');
      let content = element.innerText;
      if (h2?.innerText) {
        content = h2.innerText;
      }
      if (h1?.innerText) {
        content = h1.innerText;
      }
      return NH.base.strHash(content);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueEventIdentifier(element) {
      const me = 'uniqueEventIdentifier';
      this.logger.entered(me, element);

      let content = element.innerText;
      const anchor = element.querySelector('a');
      if (anchor?.href) {
        content = anchor.href;
      }

      this.logger.leaving(me, content);
      return NH.base.strHash(content);
    }

    /** @type {Scroller} */
    get collections() {
      return this.#collectionScroller;
    }

    /** @type {Scroller} */
    get events() {
      if (!this.#eventScroller && this.collections.item) {
        this.#eventScroller = new Scroller(
          {base: this.collections.item, ...Events.#eventsWhat},
          Events.#eventsHow
        );
        this.#eventScroller.dispatcher.on('change', this.#onEventChange);
        this.#eventScroller.dispatcher.on(
          'out-of-range', this.#returnToCollections
        );
      }
      return this.#eventScroller;
    }

    nextEventsCollection = new Shortcut(
      'j',
      'Next event collection',
      () => {
        this.collections.next();
      }
    );

    prevEventsCollection = new Shortcut(
      'k',
      'Previous event collection',
      () => {
        this.collections.prev();
      }
    );

    nextEvent = new Shortcut(
      'n',
      'Next event in collection',
      () => {
        this.events.next();
      }
    );

    prevEvent = new Shortcut(
      'p',
      'Previous event in collection',
      () => {
        this.events.prev();
      }
    );

    firstItem = new Shortcut(
      '<',
      'Go to first item',
      () => {
        this.#lastScroller.first();
      }
    );

    lastItem = new Shortcut(
      '>',
      'Go to last item',
      () => {
        this.#lastScroller.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Change browser focus to current item',
      () => {
        const el = this.#lastScroller.item;
        NH.web.focusOnElement(el);
      }
    );

    shareItem = new Shortcut(
      'S',
      'Share the current item, if available',
      () => {
        const me = 'shareItem';
        const item = this.events.item;
        this.logger.entered(me, item);

        if (item) {
          NH.web.clickElement(item,
            ['button.events-components-shared-support-share__share-button']);
        }

        this.logger.leaving(me);
      }
    );

    /** @type {Scroller~How} */
    static #collectionsHow = {
      uidCallback: Events.uniqueCollectionIdentifier,
      classes: ['tom'],
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #collectionsWhat = {
      name: `${this.name} collections`,
      containerItems: [
        {
          container: 'main',
          items: [
            // Major collections
            ':scope > section',
          ].join(','),
        },
      ],
    };

    static #details = {
      pathname: '/events/',
      pageReadySelector: '#share-linkedin-small',
    };

    /** @type {Scroller~How} */
    static #eventsHow = {
      uidCallback: Events.uniqueEventIdentifier,
      classes: ['dick'],
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #eventsWhat = {
      name: `${this.name} events`,
      selectors: [
        // Your events collection
        ':scope > section > div',
        // Most event collections
        ':scope > main > div > section',
        // Show more
        ':scope > footer',
      ],
    };

    #collectionScroller
    #eventScroller
    #keyboardService
    #lastScroller

    #resetEvents = () => {
      this.#eventScroller?.destroy();
      this.#eventScroller = null;
      this.events;
    }

    #onEventChange = () => {
      this.#lastScroller = this.events;
    }

    #returnToCollections = () => {
      this.collections.goto(this.collections.item);
    }

    #onCollectionChange = () => {
      this.#resetEvents();
      this.#lastScroller = this.collections;
    }

  }

  /** Class for handling the SearchResultsPeople page. */
  class SearchResultsPeople extends Page {

    /** @param {SPA} spa - SPA instance that manages this Page. */
    constructor(spa) {
      super({spa: spa, ...SearchResultsPeople.#details});

      this.#keyboardService = this.addService(VMKeyboardService);
      this.#keyboardService.addInstance(this);

      this.addService(LinkedInToolbarService, this)
        .addHows(
          SearchResultsPeople.#resultsHow,
          SearchResultsPeople.#paginationHow
        )
        .postActivateHook(this.#toolbarHook);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniquePaginationIdentifier(element) {
      let content = '';
      if (element) {
        content = element.innerText;
        const label = element.getAttribute('aria-label');
        if (label) {
          content = label;
        }
      }
      log.log('SearchResultsPeople.uniquePaginationIdentifier content:',
        content);
      return NH.base.strHash(content);
    }

    /**
     * @implements {Scroller~uidCallback}
     * @param {Element} element - Element to examine.
     * @returns {string} - A value unique to this element.
     */
    static uniqueResultIdentifier(element) {
      const div = element.querySelector('div');
      let content = element.innerText;
      if (div?.dataset.chameleonResultUrn) {
        content = div.dataset.chameleonResultUrn;
      }
      return NH.base.strHash(content);
    }

    /** @type {Scroller} */
    get paginator() {
      if (!this.#paginationScroller) {
        this.#paginationScroller = new Scroller(
          SearchResultsPeople.#paginationWhat,
          SearchResultsPeople.#paginationHow
        );
        this.addService(LinkedInScrollerService)
          .setScroller(this.#paginationScroller);
        this.#paginationScroller.dispatcher.on('activate',
          this.#onPaginationActivate);
        this.#paginationScroller.dispatcher.on('change',
          this.#onPaginationChange);
      }
      return this.#paginationScroller;
    }

    /** @type {Scroller} */
    get results() {
      if (!this.#resultScroller) {
        this.#resultScroller = new Scroller(SearchResultsPeople.#resultsWhat,
          SearchResultsPeople.#resultsHow);
        this.addService(LinkedInScrollerService)
          .setScroller(this.#resultScroller);
        this.#resultScroller.dispatcher.on('change', this.#onResultChange);

        this.#lastScroller = this.#resultScroller;
      }
      return this.#resultScroller;
    }

    nextResult = new Shortcut(
      'j',
      'Next result',
      () => {
        this.results.next();
      }
    );

    prevReslt = new Shortcut(
      'k',
      'Previous result',
      () => {
        this.results.prev();
      }
    );

    nextResultsPage = new Shortcut(
      'N',
      'Next results page',
      () => {
        this.paginator.next();
      }
    );

    prevResultsPage = new Shortcut(
      'P',
      'Previous results page',
      () => {
        this.paginator.prev();
      }
    );

    selectCurrentResultsPage = new Shortcut(
      'c',
      'Select current results page',
      () => {
        NH.web.clickElement(this.paginator.item, ['button']);
      }
    );

    firstItem = new Shortcut(
      '<',
      'Go to the first item',
      () => {
        this.#lastScroller.first();
      }
    );

    lastItem = new Shortcut(
      '>',
      'Go to the last item',
      () => {
        this.#lastScroller.last();
      }
    );

    focusBrowser = new Shortcut(
      'f',
      'Change browser focus to current item',
      () => {
        NH.web.focusOnElement(this.#lastScroller.item);
      }
    );

    static #details = {
      pathname: '/search/results/people/',
      pageReadySelector: '#globalfooter-about',
    };

    /** @type {Scroller~How} */
    static #paginationHow = {
      uidCallback: this.uniquePaginationIdentifier,
      classes: ['dick'],
      snapToTop: false,
      bottomMarginCSS: '3em',
      containerTimeout: 1000,
    };

    /** @type {Scroller~What} */
    static #paginationWhat = {
      name: 'SearchResultsPeople pagination',
      containerItems: [
        {
          // This selector is also used in #onPaginationActivate.
          container: 'div.artdeco-pagination > ul',
          items: ':scope > li',
        },
      ],
    };

    /** @type {Scroller~How} */
    static #resultsHow = {
      uidCallback: SearchResultsPeople.uniqueResultIdentifier,
      classes: ['dick'],
      snapToTop: false,
    };

    /** @type {Scroller~What} */
    static #resultsWhat = {
      name: 'SearchResultsPeople cards',
      containerItems: [
        {
          container: 'ul.reusable-search__entity-result-list',
          items: ':scope > li',
        },
      ],
    };

    #keyboardService
    #lastScroller
    #paginationScroller
    #resultScroller

    #toolbarHook = () => {
      const me = 'toolbarHook';
      this.logger.entered(me);

      this.logger.log('Initializing paginator:', this.paginator.item);
      this.logger.log('Initializing results:', this.results.item);

      this.logger.leaving(me);
    }

    #onPaginationActivate = async () => {
      const me = 'onPaginationActivate';
      this.logger.entered(me);

      try {
        const timeout = 2000;
        const item = await NH.web.waitForSelector(
          'div.artdeco-pagination > ul > li.selected',
          timeout
        );
        this.paginator.goto(item);

        // The previous line popped the page to the bottom, so go to someplace
        // reasonable.  On a similar page, JobCollections, the URL changes to
        // match the current card, so it watches that to avoid this same
        // problem.
        const result = this.results.item;
        if (result) {
          this.results.goto(result);
        } else {
          this.results.first();
        }
      } catch (e) {
        this.logger.log('Results paginator not found, staying put');
      }

      this.logger.leaving(me);
    }

    #onPaginationChange = () => {
      this.#lastScroller = this.paginator;
    }

    #onResultChange = () => {
      this.#lastScroller = this.results;
    }

  }

  /** Base class for {@link SPA} instance details. */
  class SPADetails {

    /** Create a SPADetails instance. */
    constructor() {
      if (new.target === SPADetails) {
        throw new TypeError('Abstract class; do not instantiate directly.');
      }

      this.#logger = new NH.base.Logger(this.constructor.name);
      this.#id = NH.base.safeId(NH.base.uuId(this.constructor.name));
      this.dispatcher = new NH.base.Dispatcher('errors', 'news');
    }

    /**
     * @type {string} - CSS selector to monitor if self-managing URL changes.
     * The selector must resolve to an element that, once it exists, will
     * continue to exist for the lifetime of the SPA.
     */
    urlChangeMonitorSelector = 'body';

    /** @type {string} - Unique ID for this instance . */
    get id() {
      return this.#id;
    }

    /** @type {NH.base.Logger} - NH.base.Logger instance. */
    get logger() {
      return this.#logger;
    }

    /** @type {TabbedUI} */
    get ui() {
      return this.#ui;
    }

    /** @param {TabbedUI} val - UI instance. */
    set ui(val) {
      this.#ui = val;
    }

    /**
     * Called by SPA instance during its construction to allow post
     * instantiation stuff to happen.  If overridden in a subclass, this
     * should definitely be called via super.
     */
    init() {
      this.dispatcher.on('errors', this._errors);
      this.dispatcher.on('news', this._news);
    }

    /**
     * Called by SPA instance when initialization is done.  Subclasses should
     * call via super.
     */
    done() {
      const me = 'done (SPADetails)';
      this.logger.entered(me);

      this.logger.leaving(me);
    }

    /**
     * Handles notifications about changes to the {@link SPA} Errors tab
     * content.
     * @implements {NH.base.Dispatcher~Handler}
     * @param {string} eventType - Event type.
     * @param {number} count - Number of errors currently logged.
     */
    _errors = (eventType, count) => {
      this.logger.log('errors:', eventType, count);
    }

    /**
     * Handles notifications about activity on the {@link SPA} News tab.
     * @implements {NH.base.Dispatcher~Handler}
     * @param {string} eventType - Event type.
     * @param {object} data - Undefined at this time.
     */
    _news = (eventType, data) => {
      this.logger.log('news', eventType, data);
    }

    /**
     * @implements {SPA~TabGenerator}
     * @returns {TabbedUI~TabDefinition} - Where to find documentation
     * and file bugs.
     */
    docTab() {
      this.logger.log('docTab is not implemented');
      throw new Error('Not implemented.');
      return {  // eslint-disable-line no-unreachable
        name: 'Not implemented.',
        content: 'Not implemented.',
      };
    }

    /**
     * @implements {SPA~TabGenerator}
     * @returns {TabbedUI~TabDefinition} - License information.
     */
    licenseTab() {
      this.logger.log('licenseTab is not implemented');
      throw new Error('Not implemented.');
      return {  // eslint-disable-line no-unreachable
        name: 'Not implemented.',
        content: 'Not implemented.',
      };
    }

    #id
    #logger

    /** @type {TabbedUI} */
    #ui = null;

  }

  /** LinkedIn specific information. */
  class LinkedIn extends SPADetails {

    /**
     * @param {LinkedInGlobals} globals - Instance of a helper class to avoid
     * circular dependencies.
     */
    constructor(globals) {
      super();
      this.#globals = globals;
      this.#primaryItemsObserver = new MutationObserver(
        this.#primaryItemsHandler
      );
      this.ready = this.#waitUntilPageLoadedEnough();
    }

    urlChangeMonitorSelector = 'div.authentication-outlet';

    /** @type {LinkedInGlobals} - Instance passed in during construction. */
    get globals() {
      return this.#globals;
    }

    /** @type {string} - The element.id used to identify the info pop-up. */
    get infoId() {
      return this.#infoId;
    }

    /** @param {string} val - Set the value of the info element.id. */
    set infoId(val) {
      this.#infoId = val;
    }

    /**
     * @typedef {object} LicenseData
     * @property {string} name - Name of the license.
     * @property {string} url - License URL.
     */

    /** @type {LicenseData} */
    get licenseData() {
      const me = 'licenseData';
      this.logger.entered(me);

      if (!this.#licenseData) {
        try {
          this.#licenseData = NH.userscript.licenseData();
        } catch (e) {
          if (e instanceof NH.userscript.UserscriptError) {
            this.logger.log('e:', e);
            NH.base.issues.post(e.message);
            this.#licenseData = {
              name: 'Unable to extract: Please file a bug',
              url: '',
            };
          }
        }
      }

      this.logger.leaving(me, this.#licenseData);
      return this.#licenseData;
    }

    /** @type {NH.base.Dispatcher} */
    get navbarDispatcher() {
      return this.#navbarDispatcher;
    }

    /** @inheritdoc */
    done() {
      super.done();
      const me = 'done';
      this.logger.entered(me);

      const licenseEntry = this.ui.tabs.get('License');
      licenseEntry.panel.addEventListener('expose', this.#licenseHandler);
      VMKeyboardService.condition = '!inputFocus && !inDialog';
      VMKeyboardService.start();

      this.logger.leaving(me);
    }

    /**
     * Many classes have some static {Scroller~How} items that need to be
     * fixed up after the page loads enough that the values are available.
     * They do that by calling this method.
     * @param {Scroller~How} how - Object to be fixed up.
     */
    navbarScrollerFixup(how) {
      const me = 'navbarScrollerFixup';
      this.logger.entered(me, how);

      how.topMarginPixels = this.#globals.navbarHeightPixels;
      how.topMarginCSS = this.#globals.navbarHeightCSS;
      how.bottomMarginCSS = '3em';

      this.logger.leaving(me, how);
    }

    /** @inheritdoc */
    _errors = (eventType, count) => {
      const me = 'errors';
      this.logger.entered(me, eventType, count);

      const button = document.querySelector('#lit-nav-button');
      const toggle = button.querySelector('.notification-badge');
      const badge = button.querySelector('.notification-badge__count');
      badge.innerText = `${count}`;
      if (count) {
        toggle.classList.add('notification-badge--show');
      } else {
        toggle.classList.remove('notification-badge--show');
      }

      this.logger.leaving(me);
    }

    /** @inheritdoc */
    docTab() {
      const me = 'docTab';
      this.logger.entered(me);

      const issuesLink = this.#globals.ghUrl('labels/linkedin-tool');
      const newIssueLink = this.#globals.ghUrl('issues/new/choose');
      const newGfIssueLink = this.#globals.gfUrl('feedback');
      const releaseNotesLink = this.#globals.gfUrl('versions');

      const content = [
        `<p>This is information about the <b>${GM.info.script.name}</b> ` +
          'userscript, a type of add-on.  It is not associated with ' +
          'LinkedIn Corporation in any way.</p>',
        '<p>Documentation can be found on ' +
          `<a href="${GM.info.script.supportURL}">GitHub</a>.  Release ` +
          'notes are automatically generated on ' +
          `<a href="${releaseNotesLink}">Greasy Fork</a>.</p>`,
        '<p>Existing issues are also on GitHub ' +
          `<a href="${issuesLink}">here</a>.</p>`,
        '<p>New issues or feature requests can be filed on GitHub (account ' +
          `required) <a href="${newIssueLink}">here</a>.  Then select the ` +
          'appropriate issue template to get started.  Or, on Greasy Fork ' +
          `(account required) <a href="${newGfIssueLink}">here</a>.  ` +
          'Review the <b>Errors</b> tab for any useful information.</p>',
        '',
      ];

      const tab = {
        name: 'About',
        content: content.join('\n'),
      };

      this.logger.leaving(me, tab);
      return tab;
    }

    /** @inheritdoc */
    newsTab() {
      const me = 'newsTab';
      this.logger.entered(me);

      const {dates, knownIssues} = this.#preprocessKnownIssues();

      const content = [
        '<p>The contains a manually curated list of changes over the last ' +
          'month or so that:',
        '<ul>',
        '<li>Added new features like support for new pages or more ' +
          'hotkeys</li>',
        '<li>Explicitly fixed a bug</li>',
        '<li>May cause a use noticeable change</li>',
        '</ul>',
        '</p>',
        '<p>See the <b>About</b> tab for finding all changes by release.</p>',
      ];

      const dateHeader = 'h3';
      const issueHeader = 'h4';

      for (const [date, items] of dates) {
        content.push(`<${dateHeader}>${date}</${dateHeader}>`);
        for (const [issue, subjects] of items) {
          content.push(
            `<${issueHeader}>${knownIssues.get(issue)}</${issueHeader}>`
          );
          content.push('<ul>');
          for (const subject of subjects) {
            content.push(`<li>${subject}</li>`);
          }
          content.push('</ul>');
        }
      }

      const tab = {
        name: 'News',
        content: content.join('\n'),
      };

      this.logger.leaving(me);
      return tab;
    }

    /** @inheritdoc */
    licenseTab() {
      const me = 'licenseTab';
      this.logger.entered(me);

      const {name, url} = this.licenseData;
      const tab = {
        name: 'License',
        content: `<p><a href="${url}">${name}</a></p>`,
      };

      this.logger.leaving(me, tab);
      return tab;
    }

    static #icon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">' +
      '<defs>' +
      '<mask id="a" maskContentUnits="objectBoundingBox">' +
      '<path fill="#fff" d="M0 0h1v1H0z"/>' +
      '<circle cx=".5" cy=".5" r=".25"/>' +
      '</mask>' +
      '<mask id="b" maskContentUnits="objectBoundingBox">' +
      '<path fill="#fff" mask="url(#a)" d="M0 0h1v1H0z"/>' +
      '<rect x="0.375" y="-0.05" height="0.35" width="0.25"' +
      ' transform="rotate(30 0.5 0.5)"/>' +
      '</mask>' +
      '</defs>' +
      '<rect x="9.5" y="7" width="5" height="10"' +
      ' transform="rotate(45 12 12)"/>' +
      '<circle cx="6" cy="18" r="5" mask="url(#a)"/>' +
      '<circle cx="18" cy="6" r="5" mask="url(#b)"/>' +
      '</svg>';

    #globals
    #infoId
    #infoKeyboard
    #infoTabs
    #infoWidget
    #licenseData
    #licenseLoaded
    #navbar
    #navbarDispatcher = new NH.base.Dispatcher('resize');
    #ourMenuItem
    #primaryItems
    #primaryItemsObserver
    #shortcutsWidget
    #useOriginalInfoDialog = !litOptions.enableDevMode;

    /** Hang out until enough HTML has been built to be useful. */
    #waitUntilPageLoadedEnough = async () => {
      const me = 'waitOnPageLoadedEnough';
      this.logger.entered(me);

      // TODO(#242): If the choice of the divider class does not cause any
      // problems, we should make that the official item to wait for, and then
      // populate this.#navbar with a simple call to document.querySelector().
      this.#navbar = await NH.web.waitForSelector('#global-nav', 0);
      try {
        const waitTime = 1000;
        await NH.web.waitForSelector(
          '.global-nav__primary-item--divider', waitTime
        );
        this.logger.log('Divider showed up');
      } catch (e) {
        this.logger.log(
          'Divider did not show up, but that is all right...',
          'just a way of wasting time',
          e
        );
        if (litOptions.enableDevMode) {
          NH.base.issues.post('TODO(#242): Wait for divider timed out');
        }
      }
      this.#finishConstruction();

      this.logger.leaving(me);
    }

    /** Do the bits that were waiting on the page. */
    #finishConstruction = () => {
      const me = 'finishConstruction';
      this.logger.entered(me);

      this.#createInfoWidget();
      this.#addInfoTabs();
      this.#addLitStyle();
      this.#addToolMenuItem();
      this.#observeNavBar();

      this.logger.leaving(me);
    }

    /**
     * Lazily load license text when exposed.
     * @param {Event} evt - The 'expose' event.
     */
    #licenseHandler = async (evt) => {
      const me = 'licenseHandler';
      this.logger.entered(me, evt.target);

      // Probably should debounce this.  If the user visits this tab twice
      // fast enough, they end up with two copies loaded.  Amusing, but
      // probably should be resilient.
      if (!this.#licenseLoaded) {
        const info = document.createElement('p');
        info.innerHTML = '<i>Loading license...</i>';
        evt.target.append(info);
        const {name, url} = this.licenseData;

        const response = await fetch(url);
        if (response.ok) {
          const license = document.createElement('iframe');
          license.style.flexGrow = 1;
          license.title = name;
          license.sandbox = '';
          license.srcdoc = await response.text();
          info.replaceWith(license);
          this.#licenseLoaded = true;
        }
      }

      this.logger.leaving(me);
    }

    #createInfoWidget = () => {
      this.#infoWidget = new NH.widget.Info('LinkedIn Tool');
      const widget = this.#infoWidget.container;
      widget.classList.add('lit-info');
      document.body.prepend(widget);
      const dismissId = NH.base.safeId(`${widget.id}-dismiss`);

      const infoName = this.#infoName(dismissId);
      const instructions = this.#infoInstructions();

      widget.append(infoName, instructions);

      document.getElementById(dismissId)
        .addEventListener('click', () => {
          this.#infoWidget.close();
        });

      this.#infoKeyboard = new VM.shortcut.KeyboardService();
      widget.addEventListener('open', this.#onOpenInfo);
      widget.addEventListener('close', this.#onCloseInfo);
    }

    /**
     * @param {string} dismissId - Element #id to give dismiss button.
     * @returns {Element} - For the info widget name header.
     */
    #infoName = (dismissId) => {
      const nameElement = document.createElement('div');
      nameElement.classList.add('lit-justify');
      const title = `<b>${GM.info.script.name}</b> - ` +
            `v${GM.info.script.version}`;
      const dismiss = `<button id=${dismissId}>X</button>`;
      nameElement.innerHTML = `<span>${title}</span><span>${dismiss}</span>`;

      return nameElement;
    }

    /** @returns {Element} - Instructions for navigating the info widget. */
    #infoInstructions = () => {
      const instructions = document.createElement('div');
      instructions.classList.add('lit-justify');
      instructions.classList.add('lit-instructions');
      const left = VMKeyboardService.parseSeq('c-left');
      const right = VMKeyboardService.parseSeq('c-right');
      const esc = VMKeyboardService.parseSeq('esc');
      instructions.innerHTML =
        `<span>Use the ${left} and ${right} keys or click to select ` +
        'tab</span>' +
        `<span>Hit ${esc} to close</span>`;

      return instructions;
    }

    #onOpenInfo = () => {
      VMKeyboardService.setKeyboardContext('inDialog', true);
      this.#infoKeyboard.enable();
      this.#buildShortcutsInfo();
      this.logger.log('info opened');
    }

    #onCloseInfo = () => {
      this.#infoKeyboard.disable();
      VMKeyboardService.setKeyboardContext('inDialog', false);
      this.logger.log('info closed');
    }

    /** Create CSS styles for stuff specific to LinkedIn Tool. */
    #addLitStyle = () => {  // eslint-disable-line max-lines-per-function
      const style = document.createElement('style');
      style.id = `${this.id}-style`;
      const styles = [
        '.lit-info:modal {' +
          ' height: 100%;' +
          ' width: 65rem;' +
          ' display: flex;' +
          ' flex-direction: column;' +
          '}',
        '.lit-info button {' +
          ' border-width: 1px;' +
          ' border-style: solid;' +
          ' border-radius: 1em;' +
          ' padding: 3px;' +
          '}',
        '.lit-news {' +
          ' position: absolute;' +
          ' bottom: 14px;' +
          ' right: -5px;' +
          ' width: 16px;' +
          ' height: 16px;' +
          ' border-radius: 50%;' +
          ' border: 5px solid green;' +
          '}',
        '.lit-justify {' +
          ' display: flex;' +
          ' flex-direction: row;' +
          ' justify-content: space-between;' +
          '}',
        '.lit-instructions {' +
          ' padding-bottom: 1ex;' +
          ' border-bottom: 1px solid black;' +
          ' margin-bottom: 5px;' +
          '}',
        '.lit-info kbd > kbd {' +
          ' font-size: 0.85em;' +
          ' padding: 0.07em;' +
          ' border-width: 1px;' +
          ' border-style: solid;' +
          '}',
        '.lit-info th { text-align: left; }',
        '.lit-info td:first-child {' +
          ' white-space: nowrap;' +
          ' text-align: right;' +
          ' padding-right: 0.5em;' +
          '}',
      ];
      style.textContent = styles.join('\n');
      document.head.prepend(style);
    }

    #addInfoTabs = () => {
      const me = 'addInfoTabs';
      this.logger.entered(me);

      const tabs = [
        this.#shortcutsTab(),
        this.docTab(),
        this.newsTab(),
      ];

      this.#infoTabs = new TabbedUI('LinkedIn Tool');

      for (const tab of tabs) {
        this.#infoTabs.addTab(tab);
      }
      this.#infoTabs.goto(tabs[0].name);

      this.#infoWidget.container.append(this.#infoTabs.container);

      this.#infoKeyboard.register('c-right', this.#nextTab);
      this.#infoKeyboard.register('c-left', this.#prevTab);

      this.logger.leaving(me);
    }

    #nextTab = () => {
      this.#infoTabs.next();
    }

    #prevTab = () => {
      this.#infoTabs.prev();
    }

    /** Add a menu item to the global nav bar. */
    #addToolMenuItem = () => {
      const me = 'addToolMenuItem';
      this.logger.entered(me);

      this.#primaryItems = document.querySelector(
        'ul.global-nav__primary-items'
      );
      this.#primaryItemsObserver.observe(
        this.#primaryItems, {childList: true}
      );

      this.#ourMenuItem = document.createElement('li');
      this.#ourMenuItem.classList.add('global-nav__primary-item');
      this.#ourMenuItem.innerHTML =
        '<button id="lit-nav-button" class="global-nav__primary-link">' +
        '  <div class="global-nav__primary-link-notif ' +
        'artdeco-notification-badge">' +
        '    <div class="notification-badge">' +
        '      <span class="notification-badge__count"></span>' +
        '    </div>' +
        `    <div>${LinkedIn.#icon}</div>` +
        '    <span class="lit-news-badge">TBD</span>' +
        '    <span class="t-12 global-nav__primary-link-text">Tool</span>' +
        '  </div>' +
        '</button>';

      const button = this.#ourMenuItem.querySelector('button');
      button.addEventListener('click', () => {
        if (this.#useOriginalInfoDialog) {
          const info = document.querySelector(`#${this.infoId}`);
          info.showModal();
          info.dispatchEvent(new Event('open'));
        } else {
          this.#infoWidget.open();
        }
        if (litOptions.enableDevMode) {
          this.#useOriginalInfoDialog = !this.#useOriginalInfoDialog;
        }
      });

      this.#connectMenuItem();

      this.logger.leaving(me);
    }

    #connectMenuItem = () => {
      const navMe = this.#primaryItems.querySelector('li .global-nav__me')
        ?.closest('li');
      if (navMe) {
        navMe.after(this.#ourMenuItem);
      } else {
        // If the site changed and we cannot insert ourself after the Me menu
        // item, then go first.
        this.#primaryItems.prepend(this.#ourMenuItem);
        NH.base.issues.post(
          'Unable to find the Profile navbar item.',
          'LIT menu installed in non-standard location.'
        );
      }
    }

    #primaryItemsHandler = () => {
      const me = 'primaryItemsHandler';
      this.logger.entered(me);

      if (!this.#ourMenuItem.isConnected) {
        this.logger.log('reconnecting');
        this.#connectMenuItem();
        if (litOptions.enableDevMode) {
          // Make this event pop by publishing a bug in dev mode.
          NH.base.issues.post('Had to reconnect the menu item.');
        }
      }

      this.logger.leaving(me);
    }

    #observeNavBar = () => {
      new ResizeObserver(this.#setNavBarInfo)
        .observe(this.#navbar);

      // An initial run.
      this.#setNavBarInfo();
    }

    /** Set some useful global variables. */
    #setNavBarInfo = () => {
      const margin = 4;

      this.logger.log('Raw navbar height is', this.#navbar.clientHeight);

      this.#globals.navbarHeightPixels = this.#navbar.clientHeight +
        margin;

      this.#navbarDispatcher.fire('resize', this.#globals);
    }

    /**
     * @returns {TabbedUI~TabDefinition} - Keyboard shortcuts listing.
     */
    #shortcutsTab = () => {
      this.#shortcutsWidget = new AccordionTableWidget('Shortcuts');

      const tab = {
        name: 'Keyboard Shortcuts',
        content: this.#shortcutsWidget.container,
      };
      return tab;
    }

    #buildShortcutsInfo = () => {
      const me = 'buildShortcutsInfo';
      this.logger.entered(me);

      this.#shortcutsWidget.clear();
      for (const service of VMKeyboardService.services) {
        this.logger.log('service:', service.shortName, service.active);
        // Works in progress may not have any shortcuts yet.
        if (service.shortcuts.length) {
          const parsedName = NH.base.simpleParseWords(service.shortName)
            .join(' ');
          this.#shortcutsWidget.addSection(service.shortName);
          this.#shortcutsWidget.addHeader(service.active, parsedName);
          for (const shortcut of service.shortcuts) {
            this.logger.log('shortcut:', shortcut);
            this.#shortcutsWidget.addData(
              `${VMKeyboardService.parseSeq(shortcut.seq)}:`, shortcut.desc
            );
          }
        }
      }

      this.logger.leaving(me);
    }

    /** @returns {obj} - dates and known issues. */
    #preprocessKnownIssues = () => {
      const knownIssues = new Map(globalKnownIssues);
      const unknownIssues = new Set();
      const unusedIssues = new Set(knownIssues.keys());

      const dates = new NH.base.DefaultMap(
        () => new NH.base.DefaultMap(Array)
      );

      for (const item of globalNewsContent) {
        for (const issue of item.issues) {
          if (knownIssues.has(issue)) {
            unusedIssues.delete(issue);
            dates.get(item.date)
              .get(issue)
              .push(item.subject);
          } else {
            unknownIssues.add(issue);
          }
        }
      }

      this.logger.log('unknown', unknownIssues);
      this.logger.log('unused', unusedIssues);

      if (unknownIssues.size) {
        const issues = Array.from(unknownIssues)
          .join(', ');
        throw new Error(`Unknown issues were detected: ${issues}`);
      }

      return {
        dates: dates,
        knownIssues: knownIssues,
      };
    }

  }

  /**
   * A userscript driver for working with a single-page application.
   *
   * Generally, a single instance of this class is created, and all instances
   * of {Page} are registered to it.  As the user navigates through the
   * single-page application, this will react to it and enable and disable
   * view specific handling as appropriate.
   */
  class SPA {

    /** @param {SPADetails} details - Implementation specific details. */
    constructor(details) {
      this.#name = `${this.constructor.name}: ${details.constructor.name}`;
      this.#id = NH.base.safeId(NH.base.uuId(this.#name));
      this.#logger = new NH.base.Logger(this.#name);
      this.#details = details;
      this.#details.init(this);
      this._installNavStyle();
      this._initializeInfoView();
      NH.base.issues.listen(this.#issueListener);
      document.addEventListener('focus', this._onFocus, true);
      document.addEventListener('urlchange', this.#onUrlChange, true);
      this.#startUrlMonitor();
      this.#details.done();
    }

    static _errorMarker = '---';

    /**
     * @implements {TabGenerator}
     * @returns {TabbedUI~TabDefinition} - Initial table for the keyboard
     * shortcuts.
     */
    static _shortcutsTab() {
      return {
        name: 'Keyboard shortcuts',
        content: '<table data-spa-id="shortcuts"><tbody></tbody></table>',
      };
    }

    /**
     * Generate information about the current environment useful in bug
     * reports.
     * @returns {string} - Text with some wrapped in a `pre` element.
     */
    static _errorPlatformInfo() {
      const header = 'Please consider including some of the following ' +
            'information in any bug report:';

      const msgs = NH.userscript.environmentData();

      return `${header}<pre>${msgs.join('\n')}</pre>`;
    }

    /**
     * @implements {TabGenerator}
     * @returns {TabbedUI~TabDefinition} - Initial placeholder for error
     * logging.
     */
    static _errorTab() {
      return {
        name: 'Errors',
        content: [
          '<p>Any information in the text box below could be helpful in ' +
            'fixing a bug.</p>',
          '<p>The content can be edited and then included in a bug ' +
            'report.  Different errors should be separated by ' +
            `"${SPA._errorMarker}".</p>`,
          '<p><b>Please remove any identifying information before ' +
            'including it in a bug report!</b></p>',
          SPA._errorPlatformInfo(),
          '<textarea data-spa-id="errors" spellcheck="false" ' +
            'placeholder="No errors logged yet."></textarea>',
        ].join(''),
      };
    }

    /** @type {Element} - The most recent element to receive focus. */
    _lastInputElement = null;

    /** @type {KeyboardService} */
    _tabUiKeyboard = null;

    /** @type {Set<Page>} - A copy of the current active pages. */
    get activePages() {
      return new Set(this.#activePages);
    }

    /** @type {SPADetails} */
    get details() {
      return this.#details;
    }

    /** @type {NH.base.Logger} */
    get logger() {
      return this.#logger;
    }

    /**
     * Set the context (used by VM.shortcut) to a specific value.
     * @param {string} context - The name of the context.
     * @param {object} state - What the value should be.
     */
    _setKeyboardContext(context, state) {
      const pages = Array.from(this.#pages.values());
      for (const page of pages) {
        page.keyboard.setContext(context, state);
      }
    }

    /**
     * Handle focus events to track whether we have gone into or left an area
     * where we want to disable hotkeys.
     * @param {Event} evt - Standard 'focus' event.
     */
    _onFocus = (evt) => {
      const me = 'onFocus';
      this.logger.entered(me, evt);

      if (this._lastInputElement && evt.target !== this._lastInputElement) {
        this._lastInputElement = null;
        this._setKeyboardContext('inputFocus', false);
      }
      if (NH.web.isInput(evt.target)) {
        this._setKeyboardContext('inputFocus', true);
        this._lastInputElement = evt.target;
      }

      this.logger.leaving(me);
    }

    /** Configure handlers for the info view. */
    _addInfoViewHandlers() {
      const errors = document.querySelector(
        `#${this._infoId} [data-spa-id="errors"]`
      );
      errors.addEventListener('change', (evt) => {
        const count = evt.target.value.split('\n')
          .filter(x => x === SPA._errorMarker).length;
        this.#details.dispatcher.fire('errors', count);
        this._updateInfoErrorsLabel(count);
      });
    }

    /** Create the CSS styles used for indicating the current items. */
    _installNavStyle() {
      const style = document.createElement('style');
      style.id = NH.base.safeId(`${this.#id}-nav-style`);
      const styles = [
        '.tom {' +
          ' border-color: orange !important;' +
          ' border-style: solid !important;' +
          ' border-width: medium !important;' +
          '}',
        '.dick {' +
          ' border-color: red !important;' +
          ' border-style: solid !important;' +
          ' border-width: thin !important;' +
          '}',
        '',
      ];
      style.textContent = styles.join('\n');
      document.head.append(style);
    }

    /**
     * Create and configure a separate {@link KeyboardService} for the info
     * view.
     */
    _initializeTabUiKeyboard() {
      this._tabUiKeyboard = new VM.shortcut.KeyboardService();
      this._tabUiKeyboard.register('c-right', this._nextTab);
      this._tabUiKeyboard.register('c-left', this._prevTab);
    }

    /**
     * @callback TabGenerator
     * @returns {TabbedUI~TabDefinition}
     */

    /** Add CSS styling for use with the info view. */
    _addInfoStyle() {  // eslint-disable-line max-lines-per-function
      const style = document.createElement('style');
      style.id = NH.base.safeId(`${this.#id}-info-style`);
      const styles = [
        `#${this._infoId}:modal {` +
          ' height: 100%;' +
          ' width: 65rem;' +
          ' display: flex;' +
          ' flex-direction: column;' +
          '}',
        `#${this._infoId} .left { text-align: left; }`,
        `#${this._infoId} .right { text-align: right; }`,
        `#${this._infoId} .spa-instructions {` +
          ' display: flex;' +
          ' flex-direction: row;' +
          ' padding-bottom: 1ex;' +
          ' border-bottom: 1px solid black;' +
          ' margin-bottom: 5px;' +
          '}',
        `#${this._infoId} .spa-instructions > span { flex-grow: 1; }`,
        `#${this._infoId} textarea[data-spa-id="errors"] {` +
          ' flex-grow: 1;' +
          ' resize: none;' +
          '}',
        `#${this._infoId} .spa-danger { background-color: red; }`,
        `#${this._infoId} .spa-current-page { background-color: lightgray; }`,
        `#${this._infoId} kbd > kbd {` +
          ' font-size: 0.85em;' +
          ' padding: 0.07em;' +
          ' border-width: 1px;' +
          ' border-style: solid;' +
          '}',
        `#${this._infoId} p { margin-bottom: 1em; }`,
        `#${this._infoId} th { padding-top: 1em; text-align: left; }`,
        `#${this._infoId} td:first-child {` +
          ' white-space: nowrap;' +
          ' text-align: right;' +
          ' padding-right: 0.5em;' +
          '}',
        // The "color: unset" addresses dimming because these display-only
        // buttons are disabled.
        `#${this._infoId} button {` +
          ' border-width: 1px;' +
          ' border-style: solid;' +
          ' border-radius: 1em;' +
          ' color: unset;' +
          ' padding: 3px;' +
          '}',
        `#${this._infoId} ul {` +
          ' padding-inline: revert !important;' +
          '}',
        `#${this._infoId} button.spa-meatball { border-radius: 50%; }`,
        '',
      ];
      style.textContent = styles.join('\n');
      document.head.prepend(style);
    }

    /**
     * Create the Info dialog and add some static information.
     * @returns {Element} - Initialized dialog.
     */
    _initializeInfoDialog() {
      const dialog = document.createElement('dialog');
      dialog.id = this._infoId;
      const nameElement = document.createElement('div');
      nameElement.innerHTML = `<b>${GM.info.script.name}</b> - ` +
        `v${GM.info.script.version}`;
      const instructions = document.createElement('div');
      instructions.classList.add('spa-instructions');
      const left = VMKeyboardService.parseSeq('c-left');
      const right = VMKeyboardService.parseSeq('c-right');
      const esc = VMKeyboardService.parseSeq('esc');
      instructions.innerHTML =
        `<span class="left">Use the ${left} and ${right} keys or ` +
        'click to select tab</span>' +
        `<span class="right">Hit ${esc} to close</span>`;
      dialog.append(nameElement, instructions);
      return dialog;
    }

    /**
     * Add basic dialog with an embedded tabbed ui for the info view.
     * @param {TabbedUI~TabDefinition[]} tabs - Array defining the info tabs.
     */
    _addInfoDialog(tabs) {
      const dialog = this._initializeInfoDialog();

      this._info = new TabbedUI(`${this.#name} Info`);
      for (const tab of tabs) {
        this._info.addTab(tab);
      }
      // Switches to the first tab.
      this._info.goto(tabs[0].name);

      dialog.append(this._info.container);
      document.body.prepend(dialog);

      // Dialogs do not have a real open event.  We will fake it.
      dialog.addEventListener('open', () => {
        this._setKeyboardContext('inDialog', true);
        VMKeyboardService.setKeyboardContext('inDialog', true);
        this._tabUiKeyboard.enable();
        for (const {panel} of this._info.tabs.values()) {
          // 0, 0 is good enough
          panel.scrollTo(0, 0);
        }
      });
      dialog.addEventListener('close', () => {
        this._setKeyboardContext('inDialog', false);
        VMKeyboardService.setKeyboardContext('inDialog', false);
        this._tabUiKeyboard.disable();
      });
    }

    /** Set up everything necessary to get the info view going. */
    _initializeInfoView() {
      this._infoId = `info-${this.#id}`;
      this.#details.infoId = this._infoId;
      this._initializeTabUiKeyboard();

      const tabGenerators = [
        SPA._shortcutsTab(),
        this.#details.docTab(),
        this.#details.newsTab(),
        SPA._errorTab(),
        this.#details.licenseTab(),
      ];

      this._addInfoStyle();
      this._addInfoDialog(tabGenerators);
      this.#details.ui = this._info;
      this._addInfoViewHandlers();
    }

    _nextTab = () => {
      this._info.next();
    }

    _prevTab = () => {
      this._info.prev();
    }

    /**
     * Generate a unique id for page views.
     * @param {Page} page - An instance of the Page class.
     * @returns {string} - Unique identifier.
     */
    _pageInfoId(page) {
      return `${this._infoId}-${page.infoHeader}`;
    }

    /**
     * Add shortcut descriptions from the page to the shortcut tab.
     * @param {Page} page - An instance of the Page class.
     */
    _addInfo(page) {
      const shortcuts = document.querySelector(`#${this._infoId} tbody`);
      const section = NH.base.simpleParseWords(page.infoHeader)
        .join(' ');
      const pageId = this._pageInfoId(page);
      let s = `<tr id="${pageId}"><th></th><th>${section}</th></tr>`;
      for (const {seq, desc} of page.allShortcuts) {
        const keys = VMKeyboardService.parseSeq(seq);
        s += `<tr><td>${keys}:</td><td>${desc}</td></tr>`;
      }
      // Don't include works in progress that have no keys yet.
      if (page.allShortcuts.length) {
        shortcuts.innerHTML += s;
        for (const button of shortcuts.querySelectorAll('button')) {
          button.disabled = true;
        }
      }
    }

    /**
     * Update Errors tab label based upon value.
     * @param {number} count - Number of errors currently logged.
     */
    _updateInfoErrorsLabel(count) {
      const me = 'updateInfoErrorsLabel';
      this.logger.entered(me, count);

      const label = this._info.tabs.get('Errors').label;
      if (count) {
        this._info.goto('Errors');
        label.classList.add('spa-danger');
      } else {
        label.classList.remove('spa-danger');
      }

      this.logger.leaving(me);
    }

    /**
     * Get the hot keys tab header element for this page.
     * @param {Page} page - Page to find.
     * @returns {?Element} - Element that acts as the header.
     */
    _pageHeader(page) {
      const me = 'pageHeader';
      this.logger.entered(me, page);

      let element = null;
      if (page) {
        const pageId = this._pageInfoId(page);
        this.logger.log('pageId:', pageId);
        element = document.querySelector(`#${pageId}`);
      }

      this.logger.leaving(me, element);
      return element;
    }

    /**
     * Highlight information about the page in the hot keys tab.
     * @param {Page} page - Page to shine.
     */
    _shine(page) {
      const me = 'shine';
      this.logger.entered(me, page);

      const element = this._pageHeader(page);
      element?.classList.add('spa-current-page');

      this.logger.leaving(me);
    }

    /**
     * Remove highlights from this page in the hot keys tab.
     * @param {Page} page - Page to dull.
     */
    _dull(page) {
      const me = 'dull';
      this.logger.entered(me, page);

      const element = this._pageHeader(page);
      element?.classList.remove('spa-current-page');

      this.logger.leaving(me);
    }

    /**
     * Add content to the Errors tab so the user can use it to file feedback.
     * @param {string} content - Information to add.
     */
    addError(content) {
      const errors = document.querySelector(
        `#${this._infoId} [data-spa-id="errors"]`
      );
      errors.value += `${content}\n`;

      if (content === SPA._errorMarker) {
        const evt = new Event('change');
        errors.dispatchEvent(evt);
      }
    }

    /**
     * Add a marker to the Errors tab so the user can see where different
     * issues happened.
     */
    addErrorMarker() {
      this.addError(SPA._errorMarker);
    }

    /**
     * Add a new page to those supported by this instance.
     * @param {function(SPA): Page} Klass - A {Page} class to instantiate.
     */
    register(Klass) {
      if (Klass.prototype instanceof Page) {
        const page = new Klass(this);
        page.start();
        this._addInfo(page);
        this.#pages.add(page);
      } else {
        throw new Error(`${Klass.name} is not a Page`);
      }
    }

    /**
     * Determine which page can handle this portion of the URL.
     * @param {string} pathname - A {URL.pathname}.
     * @returns {Set<Page>} - The pages to use.
     */
    _findPages(pathname) {
      const pages = Array.from(this.#pages.values());
      return new Set(pages.filter(page => page.pathname.test(pathname)));
    }

    /**
     * Handle switching from the old page (if any) to the new one.
     * @param {string} pathname - A {URL.pathname}.
     */
    activate(pathname) {
      const me = 'activate';
      this.logger.entered(me, pathname, this.#activePageNames());

      const pages = this._findPages(pathname);
      const oldPages = new Set(this.#activePages);
      const newPages = new Set(pages);
      for (const page of pages) {
        oldPages.delete(page);
      }
      for (const page of oldPages) {
        page.deactivate();
        this._dull(page);
      }
      for (const page of newPages) {
        page.activate();
        this._shine(page);
      }
      this.#activePages = pages;

      this.logger.leaving(me, this.#activePageNames());
    }

    /** @type {Set<Page>} - Currently active {Page}s. */
    #activePages = new Set();

    #details
    #id
    #logger
    #name
    #oldUrl

    /** @type {Set<Page>} - Registered {Page}s. */
    #pages = new Set();

    /** @returns {string[]} - Names of active pages. */
    #activePageNames = () => {
      const names = Array.from(this.#activePages, x => x.constructor.name);
      return names;
    }

    #issueListener = (...issues) => {
      for (const issue of issues) {
        this.addError(issue);
      }
      this.addErrorMarker();
    }

    /**
     * Tampermonkey was the first(?) userscript manager to provide events
     * about URLs changing.  Hence the need for `@grant window.onurlchange` in
     * the UserScript header.
     * @fires Event#urlchange
     */
    #startUserscriptManagerUrlMonitor = () => {
      this.logger.log('Using Userscript Manager provided URL monitor.');
      window.addEventListener('urlchange', (info) => {
        // The info that TM gives is not really an event.  So we turn it into
        // one and throw it again, this time onto `document` where something
        // is listening for it.
        const newUrl = new URL(info.url);
        const evt = new CustomEvent('urlchange', {detail: {url: newUrl}});
        document.dispatchEvent(evt);
      });
    }

    /**
     * Install a long lived MutationObserver that watches
     * {SPADetails.urlChangeMonitorSelector}.  Whenever it is triggered, it
     * will check to see if the current URL has changed, and if so, send an
     * appropriate event.
     * @fires Event#urlchange
     */
    #startMutationObserverUrlMonitor = async () => {
      this.logger.log('Using MutationObserver for monitoring URL changes.');

      const observeOptions = {childList: true, subtree: true};

      const element = await NH.web.waitForSelector(
        this.#details.urlChangeMonitorSelector, 0
      );
      this.logger.log('element exists:', element);

      this.#oldUrl = new URL(window.location);
      new MutationObserver(() => {
        const newUrl = new URL(window.location);
        if (this.#oldUrl.href !== newUrl.href) {
          const evt = new CustomEvent('urlchange', {detail: {url: newUrl}});
          this.#oldUrl = newUrl;
          document.dispatchEvent(evt);
        }
      })
        .observe(element, observeOptions);
    }

    /** Select which way to monitor the URL for changes and start it. */
    #startUrlMonitor = () => {
      if (window.onurlchange === null) {
        this.#startUserscriptManagerUrlMonitor();
      } else {
        this.#startMutationObserverUrlMonitor();
      }
    }

    /**
     * Handle urlchange events that indicate a switch to a new page.
     * @param {CustomEvent} evt - Custom 'urlchange' event.
     */
    #onUrlChange = (evt) => {
      this.activate(evt.detail.url.pathname);
    }

  }

  NH.xunit.testing.run();

  const linkedIn = new LinkedIn(linkedInGlobals);

  // Inject some test errors
  if (litOptions.enableDevMode && Math.random() < litOptions.fakeErrorRate) {
    NH.base.issues.post('This is a dummy test issue.',
      'It was added because enableDevMode is true.');
    NH.base.issues.post('This is a second issue.',
      'We just want to make sure things count properly.');
  }

  await linkedIn.ready;
  log.log('proceeding...');

  const spa = new SPA(linkedIn);
  spa.register(Global);
  spa.register(Feed);
  spa.register(MyNetwork);
  spa.register(Messaging);
  spa.register(InvitationManagerReceivedInvites);
  spa.register(InvitationManagerSentInvites);
  spa.register(Jobs);
  spa.register(JobCollections);
  spa.register(JobView);
  spa.register(Notifications);
  spa.register(Profile);
  spa.register(Events);
  spa.register(SearchResultsPeople);
  spa.activate(window.location.pathname);

  log.log('Initialization successful.');

})();
