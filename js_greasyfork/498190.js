// ==UserScript==
// @name        indexxx
// @author      peolic
// @version     3.15
// @description Adds useful information and tools to indexxx pages
// @icon        https://www.indexxx.com/apple-touch-icon.png
// @namespace   https://github.com/peolic
// @match       https://www.indexxx.com/*
// @grant       none
// @homepageURL https://gist.github.com/peolic/6aa2cef8fafa377cb5848a473c0e3b30
// @downloadURL https://update.greasyfork.org/scripts/498190/indexxx.user.js
// @updateURL https://update.greasyfork.org/scripts/498190/indexxx.meta.js
// ==/UserScript==

//@ts-check

/** @type {{ name: string; url: string; } | null} */
let currentModel = null;

function main() {
  // Model page
  if (/^\/m\/(.+)/.test(window.location.pathname)) {
    new ModelPage();
  } else if (/^\/websites\/(.+)\/sets\//.test(window.location.pathname)) {
    new WebsiteSetsPage();
  }
}

const NO_ALIAS = '[no alias]';

class ModelPage {

  constructor() {
    currentModel = {
      name: /** @type {HTMLHeadingElement} */ (document.querySelector('h1#model-name')).innerText,
      url: /** @type {HTMLLinkElement} */ (document.querySelector('link[rel="canonical"]')).href,
    };

    this.websitesBox = /** @type {HTMLDivElement} */ (document.querySelector('#model-websites-box'));
    this.modelHeader = /** @type {HTMLDivElement} */ (document.querySelector('#model-header'));
    this.portfolioHeader = /** @type {HTMLHeadingElement} */ (this.modelHeader.querySelector(':scope > .block1 > h2'));

    /** @type {IndexxxSet[]} */
    this.allSets =
      /** @type {HTMLDivElement[]} */
      (Array.from(document.querySelectorAll('.pset.card'))).map(parseSetCard);

    this.uniqueSets = this.allSets
      .filter((set, i, self) => {
        const { outUrl, display } = set.site;
        const alias = set.models[0].name;
        return i === self.findIndex((other) =>
          (outUrl ? outUrl === other.site.outUrl : display === other.site.display)
          && alias === other.models[0].name
        );
      });

    this.aliases = this.aliasesUsageCount();

    const boxAliases = this.aliasUsageCountBox();
    const boxSites = this.sitesForAliasBox();
    this.websitesBox.after(boxAliases, boxSites);

    tryResizable(boxAliases, { handles: 'e', minWidth: 130 });
    tryResizable(boxSites, { handles: 'e', minWidth: 204 });

    this.setUpToggle();
    this.exportTarget = this.setUpExport();
  }

  style = {
    box: {
      borderColor: '#006ccc',
      backgroundColor: '#8bbeff',
      width: '204px',
    },
    title: {
      backgroundColor: '#006ccc',
    },
    body: {
      backgroundColor: '#e5eff9',
      wordBreak: 'break-word',
      padding: '0.1rem',
    },
    csv: {
      userSelect: 'all',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: '10px',
    },
  }

  // Alias Usage Count
  aliasUsageCountBox() {
    const box = document.createElement('div');
    box.classList.add('model-snippet-box');
    setStyles(box, this.style.box);
    const boxTitle = document.createElement('div');
    boxTitle.classList.add('box-title', 'd-flex', 'justify-content-between', 'px-1');
    boxTitle.innerText = 'Alias Usage Count';
    setStyles(boxTitle, this.style.title);
    box.appendChild(boxTitle);
    const titleAliasCount = document.createElement('span');
    boxTitle.appendChild(titleAliasCount);
    const boxBody = document.createElement('div');
    boxBody.classList.add('box-body');
    setStyles(boxBody, this.style.body);
    this.aliases
      .sort(({ count: a }, { count: b }) => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      })
      .forEach(({ alias, count, listed }) => {
        const div = document.createElement('div');
        const searchSpan = document.createElement('span');
        setStyles(searchSpan, { marginRight: '.25rem', cursor: 'pointer', userSelect: 'none' });
        searchSpan.innerText = '🔎';
        searchSpan.addEventListener('click', () => {
          const input = /** @type {HTMLInputElement} */ (document.querySelector('input#aliasSitesInput'));
          input.value = alias;
          input.dispatchEvent(new Event('input'));
        });
        const aliasSpan = document.createElement('span');
        setStyles(aliasSpan, {
          fontWeight: alias === NO_ALIAS ? 'bold' : undefined,
          userSelect: 'all',
        });
        if (!listed) {
          aliasSpan.classList.add('text-danger');
          aliasSpan.title = `"${alias}" is not listed as an alias.`;
        }
        aliasSpan.innerText = alias;
        div.append(searchSpan, aliasSpan, ` = ${count >= 0 ? count : '?'}`);
        boxBody.appendChild(div);
      });
    box.appendChild(boxBody);
    const csv = document.createElement('div');
    setStyles(csv, this.style.csv);
    const validAliases = this.aliases
      .reduce(
        (r, { alias }) => alias !== NO_ALIAS ? r.concat(alias) : r,
        /** @type {string[]} */ ([])
      );
    csv.innerText = validAliases.sort().join(', ');
    titleAliasCount.innerText = `${validAliases.length}`;
    box.appendChild(csv);
    return box;
  }

  // Sites For Alias
  sitesForAliasBox() {
    const box = document.createElement('div');
    box.classList.add('model-snippet-box');
    setStyles(box, this.style.box);
    const boxTitle = document.createElement('div');
    boxTitle.classList.add('box-title', 'd-flex', 'justify-content-between', 'px-1');
    setStyles(boxTitle, this.style.title);
    box.appendChild(boxTitle);
    const boxDefaultTitle = 'Websites By Alias';
    const boxTitleNode = document.createTextNode(boxDefaultTitle);
    boxTitle.appendChild(boxTitleNode);
    const titleSetCount = document.createElement('span');
    boxTitle.appendChild(titleSetCount);
    const boxBody = document.createElement('div');
    boxBody.classList.add('box-body');
    setStyles(boxBody, this.style.body);
    box.appendChild(boxBody);
    const results = document.createElement('div');
    results.innerText = 'Results will show up here';
    boxBody.appendChild(results);
    const filterDiv = document.createElement('div');
    filterDiv.classList.add('d-flex');
    boxBody.prepend(filterDiv);
    const input = document.createElement('input');
    input.id = 'aliasSitesInput';
    input.type = 'text';
    input.setAttribute('placeholder', 'Click 🔎 or enter an alias...');
    input.setAttribute('list', 'modelAliases');
    setStyles(input, { flex: 'auto', marginBottom: '0.2rem' });
    filterDiv.append(input);
    const clearWrapper = document.createElement('span');
    clearWrapper.style.position = 'relative';
    const clear = document.createElement('span');
    setStyles(clear, {
      position: 'absolute',
      top: '-0.22em',
      right: '.1em',
      padding: '0 .1em',
      color: this.style.title.backgroundColor,
      fontWeight: '800',
      fontFamily: 'sans-serif',
      fontSize: '1.2rem',
      cursor: 'pointer',
      userSelect: 'none',
    })
    clear.title = 'Clear';
    clear.innerText = 'x';
    clear.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    });
    clearWrapper.appendChild(clear);
    filterDiv.append(clearWrapper);
    const datalist = document.createElement('datalist');
    datalist.id = 'modelAliases';
    for (const alias of this.aliases.map(({ alias }) => alias).sort()) {
      const option = document.createElement('option');
      option.innerText = alias;
      datalist.appendChild(option);
    }
    input.after(datalist);
    const csv = document.createElement('div');
    setStyles(csv, this.style.csv);
    box.appendChild(csv);
    const handleInput = () => {
      const value = input.value.trim();
      filterAll.disabled = !value;
      filterAll.checked = false;
      restoreAllSets();

      let sites = this.sitesForName(value, true)
        .sort((a, b) => (a.name || a.display).localeCompare((b.name || b.display), undefined, { sensitivity: 'accent' }));
      if (!value)
        sites = sites.filter(({ setCount }) => setCount > 0);

      if (sites.length === 0) {
        boxTitleNode.textContent = boxDefaultTitle;
        titleSetCount.innerText = '';
        csv.innerText = '';
        if (value) {
          results.innerText = 'No results';
          filterAll.disabled = true;
          filterAll.checked = false;
        } else {
          results.innerText = 'Results will show up here';
        }
        return;
      }

      const totalSetCount = sites.reduce((sum, { setCount }) => sum + setCount, 0);
      // Disable if there are no sets
      filterAll.disabled = totalSetCount === 0;

      boxTitleNode.textContent = value ? boxDefaultTitle : 'Sets By Website';
      results.innerText = '';
      results.append(...sites.map(makeSiteDiv));

      csv.innerText = sites
        .map((s) => s.name || s.display)
        .filter((s, i, self) => self.indexOf(s) === i)
        .join(',');

      titleSetCount.innerText = `${totalSetCount} sets`;
    };
    input.addEventListener('input', handleInput);

    const filterAll = document.createElement('input');
    filterAll.type = 'checkbox';
    filterAll.checked = false;
    filterAll.disabled = true;
    filterAll.title = 'Select/unselect all sites below';
    setStyles(filterAll, { margin: '0 2px 2px 0' });
    filterDiv.prepend(filterAll);
    filterAll.addEventListener('input', () => {
      const checkboxes = getFilterCheckboxes();
      checkboxes.forEach((cb) => {
        cb.checked = filterAll.checked;
      });
      filterSets();
    });

    /** @param {SiteFilter} site */
    const makeSiteDiv = (site) => {
      const { name, display, listedCount, setCount } = site;
      const div = document.createElement('div');
      const filter = document.createElement('input');
      filter.type = 'checkbox';
      filter.name = 'siteSetFilter';
      filter.value = JSON.stringify(site);
      filter.disabled = setCount === 0;
      filter.title = 'Filter sets by this sites';
      setStyles(filter, { marginRight: '.25rem' });
      filter.addEventListener('input', () => {
        const checkboxes = getFilterCheckboxes();
        filterAll.checked = checkboxes.every((cb) => cb.checked);
        filterSets();
      });
      const siteSpan = document.createElement('abbr');
      setStyles(siteSpan, { userSelect: 'all', wordBreak: 'break-all' });
      siteSpan.innerText = name || display;
      if (name && name !== display)
        siteSpan.title = display;
      const countEl = document.createElement('span');
      countEl.innerText = ` (${setCount || listedCount})`;
      const currentFilter = input.value.trim();
      if (currentFilter && listedCount && setCount === 0) {
        countEl.classList.add('text-danger');
        countEl.title = `No sets as "${currentFilter}" found.`;
      }
      div.append(filter, siteSpan, countEl);
      return div;
    };

    /** @type {IndexxxSet["el"][]} */
    const filteredSets = [];

    const restoreAllSets = () => {
      filteredSets.forEach((el) => {
        el.classList.toggle('d-none', false);
      });
      filteredSets.length = 0;
    }

    const getFilterCheckboxes = () =>
      /** @type {HTMLInputElement[]} */
      (Array.from(document.querySelectorAll('input[name="siteSetFilter"]:not(:disabled)')))

    const filterSets = () => {
      const checkboxes = getFilterCheckboxes();
      /** @type {string[]} */
      const selected = [];
      for (const cb of checkboxes) {
        if (cb.checked) {
          /** @type {SiteFilter} */
          const site = JSON.parse(cb.value);
          selected.push(site.display);
        }
      }
      // console.debug('selected sites', selected);

      this.allSets.forEach((set) => {
        const isSelected = selected.length === 0 || selected.includes(set.site.display);
        const currentFilter = input.value.trim();
        const isMatch = isSelected && (!currentFilter || set.models[0].name === currentFilter);
        set.el.classList.toggle('d-none', !isMatch);
        if (!isMatch) return filteredSets.push(set.el);
        const index = filteredSets.indexOf(set.el);
        if (index !== -1) filteredSets.splice(index, 1);
      });
    };

    // initial state
    handleInput();

    return box;
  }

  _createActions() {
    const modelTitleSection = /** @type {HTMLDivElement */ (document.querySelector('#modelTitleSection'));

    const atid = 'userscript-actions-top';
    /** @type {HTMLDivElement | null} */
    let actionsTop = modelTitleSection.querySelector(`#${atid}`);
    if (!actionsTop) {
      actionsTop = document.createElement('div');
      actionsTop.id = atid;
      setStyles(actionsTop, { fontSize: '2em', width: '3.3em', padding: '0 0.25rem' });
      actionsTop.classList.add('d-flex', 'justify-content-between');
      modelTitleSection.appendChild(actionsTop);
    }

    const abid = 'userscript-actions-bottom';
    /** @type {HTMLSpanElement | null} */
    let actionsBottom = this.portfolioHeader?.querySelector(`#${abid}`);
    if (this.portfolioHeader && !actionsBottom) {
      actionsBottom = document.createElement('span');
      actionsBottom.id = abid;
      actionsBottom.classList.add('ml-2');
      this.portfolioHeader.appendChild(actionsBottom);
    }

    return {
      titleActions: actionsTop,
      portfolioActions: actionsBottom,
    };
  }

  setUpToggle() {
    const { titleActions } = this._createActions();
    const toggleButton = document.createElement('div');
    setStyles(toggleButton, { cursor: 'pointer' });
    toggleButton.title = 'Toggle all info boxes';
    toggleButton.innerText = '🔘';
    titleActions.append(toggleButton);

    toggleButton.addEventListener('click', () => {
      const anyHidden =
        /** @type {HTMLDivElement[]} */
        (Array.from(this.modelHeader.querySelectorAll('.box-title + .box-body')))
          .some((el) => el.style.display === 'none');

      /** @type {HTMLDivElement[]} */
      (Array.from(this.modelHeader.querySelectorAll('.box-title + .box-body')))
        .forEach((el) => el.style.display = anyHidden ? '' : 'none');

      const twitter = /** @type {HTMLDivElement} */ (this.modelHeader.querySelector(':scope > .twitter'));
      if (twitter)
        twitter.classList.toggle('d-none', !anyHidden);

      const modelImage = /** @type {HTMLImageElement} */ (this.modelHeader.querySelector('img.model-img'));
      if (modelImage.dataset.maxHeight) {
        modelImage.style.maxHeight = modelImage.dataset.maxHeight;
        modelImage.dataset.maxHeight = '';
      } else {
        modelImage.dataset.maxHeight = modelImage.style.maxHeight;
        modelImage.style.maxHeight = '350px';
      }
    });
  }

  /** @type {Map<string, (set: IndexxxSet) => HTMLTableCellElement>} */
  ExportFields = new Map([
    ['URL', (set) => {
      const cell = document.createElement('td');
      cell.style.maxWidth = '500px';
      const a = document.createElement('a');
      a.href = a.innerText = set.url;
      a.target = '_blank';
      cell.appendChild(a);
      return cell;
    }],
    ['Site', (set) => {
      const cell = document.createElement('td');
      cell.innerText = set.site.name || set.site.display;
      return cell;
    }],
    ['Date', (set) => {
      const cell = document.createElement('td');
      cell.innerText = set.date;
      return cell;
    }],
    ['Title', (set) => {
      const cell = document.createElement('td');
      cell.style.maxWidth = '400px';
      cell.innerText = set.title;
      return cell;
    }],
    ['Models', (set) => {
      const cell = document.createElement('td');
      cell.style.maxWidth = '400px';
      set.models.forEach((model, idx) => {
        if (idx > 0) cell.append(' | ');
        const a = document.createElement('a');
        a.classList.add('d-inline-block');
        a.innerText =
          model.actualName && model.actualName !== model.name
            ? `${model.name} (${model.actualName})`
            : (model.actualName || model.name);
        a.href = model.url;
        cell.append(a);
      });
      return cell;
    }],
  ]);

  exportColumnOrder = Array.from(this.ExportFields.keys());

  setUpExport() {
    const { portfolioActions } = this._createActions();

    if (!portfolioActions)
      return;

    const exportButton = document.createElement('span');
    setStyles(exportButton, { cursor: 'pointer' });
    exportButton.title = 'Export visible sets';
    exportButton.innerText = '📤';
    portfolioActions.append(exportButton);

    const exportTarget = document.createElement('div');
    exportTarget.id = 'export-target';
    this.portfolioHeader.after(exportTarget);

    exportButton.addEventListener('click', () => this.onExport());

    return exportTarget;
  }

  onExport() {
    const table = document.createElement('table');
    table.classList.add('table', 'table-sm', 'table-bordered', 'table-striped', 'w-auto');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.append(thead, tbody);

    const theadrow = document.createElement('tr');
    theadrow.classList.add('table-primary');
    this.exportColumnOrder.forEach((key, column) => {
      const cell = document.createElement('th');
      cell.innerText = key;
      cell.style.cursor = 'pointer';
      cell.title = 'Hide values in column';
      cell.addEventListener('click', () => {
        for (const row of tbody.rows) {
          row.cells[column].classList.toggle('invisible');
        }
      });
      theadrow.appendChild(cell);
    });
    thead.append(theadrow);

    const visibleSets = this.allSets.filter(({ el }) => !el.classList.contains('d-none'));

    const rows = visibleSets.map((set) => {
      const row = document.createElement('tr');
      for (const fieldFunc of this.ExportFields.values()) {
        row.appendChild(fieldFunc(set));
      }
      return row;
    });
    tbody.append(...rows);

    this.exportTarget.innerHTML = '';
    this.exportTarget.append(table);

    const { portfolioActions } = this._createActions();

    const bodyRect = document.body.getBoundingClientRect();
    const targetRect = this.exportTarget.getBoundingClientRect();
    window.scrollTo({
      behavior: 'smooth',
      top: targetRect.top - bodyRect.top - 50,
      left: 0,
    });

    /** @type {HTMLSpanElement | null} */
    let buttons = this.portfolioHeader.querySelector('#userscript-export-buttons');
    if (!buttons) {
      buttons = document.createElement('span');
      buttons.id = 'userscript-export-buttons';
      buttons.classList.add('ml-2');
      portfolioActions.append(buttons);
    }

    const scrollUp = () =>
      window.scrollTo({ behavior: 'smooth', top: bodyRect.top, left: 0 });

    const titleUp = 'Go up';
    if (!buttons.querySelector(`[title="${titleUp}"]`)) {
      const up = document.createElement('span');
      setStyles(up, { cursor: 'pointer' });
      up.title = titleUp;
      up.innerText = '🔝';
      up.addEventListener('click', scrollUp);
      buttons.append(up);
    }

    const titleClose = 'Close';
    if (!buttons.querySelector(`[title="${titleClose}"]`)) {
      const close = document.createElement('span');
      setStyles(close, { cursor: 'pointer' });
      close.title = titleClose;
      close.innerText = '❌';
      close.addEventListener('click', () => {
        this.exportTarget.innerHTML = '';
        close.remove();
      });
      buttons.append(close);
    }
  }

  /**
   * Number of uses for each alias (sets or listed)
   */
  aliasesUsageCount() {
    /** @type {string[]} */
    const sites = [];

    /** @type {{ alias: string, count: number, listed: boolean }[]} */
    const results = [];

    /** @type {HTMLSpanElement[]} */
    const aliasSpans = (Array.from(this.websitesBox.querySelectorAll('li span.alias')));

    aliasSpans.forEach((aliasSpan) => {
      let name = aliasSpan.innerText.trim();
      if (!name) name = NO_ALIAS;

      const siteEl = closestWebsiteLink(aliasSpan);
      if (!siteEl) {
        console.error('error getting site for', aliasSpan);
        return;
      }

      const site = siteEl.innerText;
      if (site) {
        const key = [site, name].join('|');
        if (sites.includes(key)) {
          console.debug(`skipping duplicate site/alias: ${key}`);
          return;
        }
        sites.push(key);
      }

      const { length: setCount } = this.setsBySite(siteEl, aliasSpan.innerText);
      const listedCount = this.getAliasListedCount(aliasSpan);

      if (listedCount === null && !setCount) return;

      const minSetCount = setCount || listedCount || 1;

      const result = results.find(({ alias }) => alias === name);
      if (!result) results.push({ alias: name, count: minSetCount, listed: true });
      else result.count += minSetCount;
    });

    this.uniqueSets
      .forEach((set) => {
        const { name } = set.models[0];
        if (results.find(({ alias }) => alias === name) === undefined) {
          const { display: siteDisplay, el: siteEl } = set.site;
          const key = [siteDisplay, name].join('|');
          if (sites.includes(key)) {
            // console.debug(`skipping duplicate site/alias: ${key}`);
            return;
          }
          sites.push(key);

          const { length: count } = this.setsBySite(siteEl, name);
          results.push({ alias: name, count, listed: false });
        }
      });

    return results;
  }

  /**
   * @typedef SiteFilter
   * @property {string | null} name
   * @property {string} display
   * @property {number} listedCount
   * @property {number} setCount
   */
  /**
   * List of sites for alias
   * @param {string} [name]
   * @param {boolean} [exact=false]
   * @returns {SiteFilter[]}
   */
  sitesForName(name, exact=false) {
    /** @type {SiteFilter[]} */
    const sites = [];

    /**
     * @param {SiteFilter} other
     */
    const findExistingSite = (other) =>
      sites.find((site) => site.name == other.name && site.display == other.display);

    /**
     * @param {string} name
     * @param {string} display
     * @param {number} count
     * @param {boolean} fromList
     */
    const push = (name, display, count, fromList) => {
      const countTarget = (c = fromList) => c ? 'listedCount' : 'setCount';
      const final = /** @type {SiteFilter} */ ({
        name,
        display,
        [countTarget()]: count,
        [countTarget(!fromList)]: 0,
      });
      const existingSite = findExistingSite(final);
      if (existingSite)
        existingSite[countTarget()] += count;
      else
        sites.push(final);
    };

    /**
     * @param {string} alias
     */
    const shouldHandle = (alias) => (
      !name
      || (name === NO_ALIAS && !alias)
      || alias.localeCompare(name, undefined, { sensitivity: exact ? 'variant' : 'accent' }) === 0
    );

    /** @type {HTMLSpanElement[]} */
    (Array.from(this.websitesBox.querySelectorAll('li span.alias')))
      .forEach((aliasSpan) => {
        const alias = aliasSpan.innerText.trim();

        if (shouldHandle(alias)) {
          const siteEl = closestWebsiteLink(aliasSpan);
          if (!siteEl) {
            console.error('error getting site for', aliasSpan);
            sites.push({ name: null, display: '???', listedCount: 0, setCount: 0 });
            return;
          }

          const siteSets = this.setsBySite(siteEl);
          const siteName = siteSets[0]?.site.name || '';
          const siteDisplay = siteEl.innerText;

          const hasSetsAsAlias = !!siteSets.find((set) => set.models[0].name === alias);
          if (!hasSetsAsAlias) {
            const listedCount = (name ? this.getAliasListedCount(aliasSpan) : 0);
            if (listedCount !== null)
              push(siteName, siteDisplay, listedCount, true);
          }
        }
      });

    this.uniqueSets
      .forEach((set) => {
        const alias = set.models[0].name;
        if (shouldHandle(alias)) {
          const { name: siteName, display: siteDisplay, el: siteEl } = set.site;
          const { length: setCount } = this.setsBySite(siteEl, alias);
          push(siteName, siteDisplay, setCount, false);
        }
      });

    return sites;
  }

  /**
   * Get only the listed count of aliases.
   * @param {HTMLSpanElement} aliasSpan
   * @returns {number | null}
   */
  getAliasListedCount(aliasSpan) {
    let nextSpan = /** @type {HTMLElement | undefined} */ (aliasSpan.nextElementSibling);

    if (!nextSpan || nextSpan.matches('a[title="edit"]')) {
      // get parent site (multiple names for one site, set count on site row)
      const site = closestWebsiteLink(aliasSpan);
      if (!site) {
        console.error('error getting site for', aliasSpan);
        return 0;
      }

      const siteParent = /** @type {HTMLElement} */ (site.parentElement);
      nextSpan = /** @type {HTMLSpanElement} */ (siteParent.querySelector(':scope > span > span'));
      if (!nextSpan)
        return 0;
    }

    if (nextSpan.classList.contains('count')) {
      return Number(nextSpan.innerText.trim()) || 0;
    }

    if (nextSpan.classList.contains('descr')) {
      const text = nextSpan.innerText.trim();
      if (/\b(delete|remove)\b/i.test(text))
        return null;
      const match = text.match(/^(\d+) *;.+/);
      if (match)
        return Number(match[0]);
    }

    return 0;
  }

  /**
   * @param {HTMLAnchorElement | HTMLSpanElement} siteEl
   * @param {string} [alias]
   * @returns {IndexxxSet[]}
   */
  setsBySite(siteEl, alias) {
    const site = siteEl.getAttribute('href') || siteEl.innerText;

    if (!site)
      return [];

    const sets = this.allSets.filter((set) => {
      if (alias && set.models[0].name !== alias)
        return false;

      if (/^https?:\/\//.test(site) || site.startsWith('/')) // outUrl
        return set.site.outUrl === site;
      else
        return set.site.display === site;
    });

    return sets;
  }

} // ModelPage

class WebsiteSetsPage {

  constructor() {
    /** @type {IndexxxSet[]} */
    this.allSets =
      /** @type {HTMLDivElement[]} */
      (Array.from(document.querySelectorAll('.pset.card'))).map(parseSetCard);
  }

} // WebsiteSetsPage

/**
 * @param {HTMLElement} start
 * @returns {HTMLAnchorElement | null}
 */
function closestWebsiteLink(start) {
  const selector = ':scope > a.websiteLink, :scope > span.websiteLink';
  let current = /** @type {HTMLElement} */ (start.parentElement).closest('li');
  while (current && !current.querySelector(selector)) {
    current = /** @type {HTMLElement} */ (current.parentElement).closest('li');
  }
  if (!current) return null;
  return current.querySelector(selector);
}

/**
 * @typedef IndexxxSetModel
 * @property {string} name
 * @property {string} [actualName]
 * @property {string} url
 * @property {HTMLAnchorElement | HTMLSpanElement | null} el
 */
/**
 * @typedef IndexxxSetSite
 * @property {string} name (title)
 * @property {string} display (innerText)
 * @property {string | null} outUrl (href)
 * @property {HTMLAnchorElement | HTMLSpanElement} el
 */
/**
 * @typedef IndexxxSet
 * @property {string} title
 * @property {string} date
 * @property {string} url
 * @property {[self: IndexxxSetModel, ...other: IndexxxSetModel[]]} models
 * @property {IndexxxSetSite} site
 * @property {HTMLDivElement} el
 */
/**
 * @param {HTMLDivElement} setCard
 * @returns {IndexxxSet}
 */
function parseSetCard(setCard) {
  const setLink = /** @type {HTMLAnchorElement} */ (setCard.querySelector('.psetInfo > div:nth-of-type(2) > a'));
  const url = setLink.href;

  const date = /** @type {HTMLTimeElement} */ (setCard.querySelector('time')).innerText.trim();

  // alt="Lily Jordan, Kylie Page in Kylie Page fucking in the bed with her small tits,  at 2chickssametime.com"
  // alt="Lily Jordan in  at amkingdom.com"
  // alt="Michelle B (Lenka) in Michelle B 1,  at domai.com"
  // alt="Eva Fenix in ,  at atkexotics.com"
  // [website sets - no models] alt="in The Pro,  at brandibelle.com"
  // https://regex101.com/r/SqnoyK/3
  const alt = /** @type {HTMLImageElement} */ (setCard.querySelector('img')).alt.trim();
  const altMatch = alt.match(/^(?:(.*?) )?in (?:(.+)?, )? at .+$/);
  if (!altMatch) {
    console.debug(setCard);
    throw new Error(`Failed to parse alt value: ${alt}`);
  }

  const [, rawActualNames, rawTitle] = altMatch;
  if (currentModel && !rawActualNames)
    throw new Error(`Failed to parse alt value: ${alt} (no models)`);

  const title = rawTitle || '[no title]';
  setLink.title = title;

  /** @type {{ [index: number]: string | undefined }} */
  const actualNames = {};
  rawActualNames?.split(/, /g).forEach((name, i) => {
    // https://regex101.com/r/fO11Ht/1
    const nameMatch = name.match(/^(.+?)(?: \((.+)\))?$/);
    if (!nameMatch) {
      console.error(`Failed to parse name: ${name}`, setCard);
      return;
    }
    const [, aliasOrName, actualName] = nameMatch;
    actualNames[i] = actualName || aliasOrName || undefined;
  });

  /** @type {IndexxxSetModel[]} */
  const allModels = (
    /** @type {(HTMLAnchorElement | HTMLSpanElement)[]} */
    (Array.from(setCard.querySelectorAll('.models li .modelLink')))
      .map((modelLink, i) => ({
        name: modelLink.innerText.trim(),
        actualName: actualNames[i],
        url: (modelLink instanceof HTMLAnchorElement
          ? modelLink
          : /** @type {HTMLLinkElement} */ (modelLink.nextElementSibling)
        ).href,
        el: modelLink,
      }))
  );
  let thisModel = allModels.find(({ el }) => el instanceof HTMLSpanElement);
  if (thisModel) {
    allModels.splice(allModels.indexOf(thisModel), 1);
  } else {
    if (currentModel) {
      console.info('unexpected missing set model', setCard);
      /** @type {IndexxxSetModel} */
      thisModel = ({ ...currentModel, el: null });
    }
  }
  // FIXME: TypeScript error
  /** @type {IndexxxSet["models"]} */
  const models = [thisModel, ...allModels];

  const siteEl = /** @type {HTMLAnchorElement | HTMLSpanElement} */
    (setCard.querySelector('.psetInfo > .psWebsite > :first-child'));
  const { innerText: display, title: siteTitle } = siteEl;
  const outUrl = siteEl.getAttribute('href');

  const siteName = siteTitle?.replace(/^Go to: /, '');

  /** @type {IndexxxSet["site"]} */
  const site = { name: siteName, display, outUrl, el: siteEl };

  return { date, url, models, site, title, el: setCard };
}

/**
 * @template {HTMLElement} E
 * @param {E} el
 * @param {Partial<CSSStyleDeclaration>} styles
 * @returns {E}
 */
function setStyles(el, styles) {
  Object.assign(el.style, styles);
  return el;
}

/**
 * @template {HTMLElement} E
 * @param {E} el
 * @param {Object} opts
 * @returns {E}
 */
function tryResizable(el, opts) {
  try {
    //@ts-expect-error
    jQuery(el).resizable(opts);
  } catch (error) {}
  return el;
}

main();
