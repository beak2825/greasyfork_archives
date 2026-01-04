// ==UserScript==
// @name        IAFD
// @author      peolic
// @version     4.116
// @description Add extra utilities to iafd.com
// @icon        https://www.iafd.com/favicon-196x196.png
// @namespace   https://github.com/peolic
// @match       https://www.iafd.com/*
// @grant       GM.setClipboard
// @grant       GM.addStyle
// @homepageURL https://gist.github.com/peolic/9e2981a8a14a49b9626cb277f878b157
// @downloadURL https://update.greasyfork.org/scripts/498187/IAFD.user.js
// @updateURL https://update.greasyfork.org/scripts/498187/IAFD.meta.js
// ==/UserScript==

function main() {
  makeInternalLinksHTTPS();
  fixIAFDLinks();

  const path = location.pathname + location.search;

  if (/^\/title\.(asp|rme\/)/.test(path))
    return titlePage();
  if (/^\/person\.(asp|rme\/)/.test(path))
    return personPage();
  if (/^\/(([a-z]{4}_)?studio|distrib)\.(asp\??|rme\/?)$/.test(path))
    return studioDistribSelectPage();
  if (/^\/(studio|distrib)\.(asp\?|rme\/)(studio|distrib)=\d+/.test(path))
    return studioDistribPage();
  if (/^\/(new|updated)(perfs|headshots)\.asp/.test(path))
    return personUpdatePage();
  if (/^\/lookuptat\.asp/.test(path))
    return tattooLookupPage();
  if (/^\/results\.asp/.test(path))
    return setSearchField();
}

const getBioDataElement = (headingText) => {
  return Array.from(document.querySelectorAll('p.bioheading'))
    .find(e => e.innerText.localeCompare(headingText, 'en', { sensitivity: 'accent' }) === 0)
    ?.nextElementSibling;
};

const makeBioEntry = (heading, ...data) => {
  return [['heading', heading], ...data.map((d) => ['data', d])].map(([type, text]) => {
    const p = document.createElement('p');
    p.classList.add(`bio${type}`);
    if (text instanceof Node) p.append(text);
    else p.innerText = text;
    return p;
  });
};

const makeQuickSelect = (text) => {
  const b = document.createElement('b');
  Object.assign(b.style, { userSelect: 'all', cursor: 'cell', textDecoration: 'underline dotted' });
  b.innerText = text;
  return b;
};

const makeISODateElement = (date) => {
  const isoDate = new Date(`${date} 0:00 UTC`).toISOString().slice(0, 10);
  return makeQuickSelect(isoDate);
};


const slug = (text, char='-') => {
  return encodeURI(text.replace(/[^a-z0-9_.,:'()-]+/gi, '___'))
    .toLowerCase()
    .replace(/___/g, char);
};

const makeLegacyTitleLink = (title, year) => {
  const encodedTitle = slug(title, '+').replace(/^\+|\++$|^(a|an|the)\+/g, '');
  return `https://www.iafd.com/title.rme/title=${encodedTitle}/year=${year}/${encodedTitle.replace(/\+/g, '-')}.htm`;
};

const makeLegacyPerformerLink = (perfId, gender, name=undefined) => {
  const nameSlug = name ? `/${slug(name, '-')}.htm` : '';
  return `https://www.iafd.com/person.rme/perfid=${perfId}/gender=${gender}${nameSlug}`;
};

function makeInternalLinksHTTPS() {
  /** @type {NodeListOf<HTMLAnchorElement>} */
  (document.querySelectorAll('a[href^="http://www.iafd.com/"]')).forEach((el) => {
    el.href = el.href.replace(/^http:/, 'https:');
  });
};

function fixIAFDLinks() {
  const replacer = (_, offset, string) => {
    if (offset > string.indexOf('/year=')) return '-';
    else return '+';
  };
  /** @type {NodeListOf<HTMLAnchorElement>} */
  (document.querySelectorAll('a[href*="//www.iafd.com/"]')).forEach((el) => {
    el.href = el.href
      // upper-case UUID to lower-case UUID
      .replace(/(?<=\/id=)([A-F0-9-]+)$/g, (t) => t.toLowerCase())
      // fix bad escaped characters
      .replace(/%2f/g, replacer);
  });
};

function titlePage() {
  const canonical = document.querySelector('.panel:last-of-type .padded-panel')
    ?.innerText?.match(/should be linked to:\n(.+)/)?.[1]?.replace(/^http:/, 'https:');
  if (canonical)
    history.replaceState(null, '', canonical);

  const titleHeading = document.querySelector('h1');
  // remove trailing space
  titleHeading.textContent = titleHeading.textContent.replace(/[ \t\n]+$/, '');
  formatTitle(titleHeading);

  const correct = document.querySelector('#correct');

  if (correct) {
    const filmIdBio = makeBioEntry('Film ID', correct.querySelector('input[name="FilmID"]')?.value);
    filmIdBio[0].style.marginTop = '4em';
    correct.before(...filmIdBio);

    const links = [];
    if (canonical) {
      const link = document.createElement('a');
      link.href = canonical;
      link.title = link.href;
      link.innerText = 'Title Page Link';
      Object.assign(link.style, {
        color: '#337ab7',
        margin: '1em 0',
      });
      links.push(link);
    }

    // Legacy link
    const titleAndYear = titleHeading.innerText.match(/^(.+) \((\d+)\)$/)?.slice(1) ?? [];
    const legacyLink = document.createElement('a');
    legacyLink.href = makeLegacyTitleLink(...titleAndYear);
    legacyLink.title = legacyLink.href;
    legacyLink.innerText = 'Legacy Title Page Link';
    Object.assign(legacyLink.style, {
      color: '#337ab7',
      margin: '1em 0',
    });
    links.push(legacyLink);

    correct.before(...makeBioEntry('🔗 Links', ...links));
  }

  const releaseDateElement = getBioDataElement('RELEASE DATE');
  const releaseDateNodes = Array.from(releaseDateElement.childNodes).filter((node) => node.nodeType === node.TEXT_NODE);
  releaseDateNodes.forEach((node) => {
    const text = node.textContent.trim();
    const releaseDate = text.replace(/ \(.+\)$/, '');
    if (!releaseDate || releaseDate === 'No Data')
      return;
    releaseDateElement.insertBefore(makeISODateElement(releaseDate), node);
    releaseDateElement.insertBefore(document.createElement('br'), node);
  });

  setupScenePerformers();
}

/**
 * @param {HTMLHeadingElement} titleHeading
 */
const formatTitle = (titleHeading) => {
  // Break up the title text node
  for (let i = 0; i < Math.min(titleHeading.childNodes.length, 10); i++) {
    const node = titleHeading.childNodes[i];
    const open = node.textContent.indexOf('(', 1);
    const close = node.textContent.indexOf(')', open + 1) + 1;
    if (open < 0 && close <= 0) continue;
    node.splitText([open, close].find((v) => v > -1));
  }

  /** @type {[RegExpMatchArray | null, string][]} */
  ([ /* roman numerals */
    [titleHeading.innerText.match(/(\(X{0,3}(IX|IV|V?I{0,3})\))/), '#c8c8c8'],
    /* year */
    [titleHeading.innerText.match(/(\(\d{1,4}\))\s*$/), '#828282'],
  ]).forEach(([match, color]) => {
    if (!(match?.[1])) return;
    const curNode = Array.from(titleHeading.childNodes).find((node) => node.textContent.includes(match?.[1]));
    const newNode = document.createElement('small');
    newNode.style.color = color;
    newNode.textContent = curNode.textContent;
    titleHeading.replaceChild(newNode, curNode);
  });
};

const setupScenePerformers = () => {
  const sceneInfo = document.querySelector('#sceneinfo');
  if (!sceneInfo) return;
  const scenes = Array.from(sceneInfo.querySelectorAll('table tr'));
  if (scenes.length === 0) return;

  const castboxes = Array.from(document.querySelectorAll('.castbox')).map((cb) => ({
    name: cb.querySelector('a').lastChild.textContent,
    cb,
  }));

  GM.addStyle(/* css */`
#sceneinfo table td:first-of-type { padding: 8px; width: 5.5em; }
#sceneinfo table td[colspan="3"] { padding: 8px 0; }
.ext__scene-performers-toggle { white-space: nowrap; cursor: pointer; text-decoration: underline; }
.ext__scene-performers { display: flex; flex-wrap: wrap; column-gap: 1em; }
.ext__scene-performers .multiple-matches { background: #bf0000cc; color: white; flex-basis: 100%; font-weight: 600; margin: 0.5em 1em 0 0; padding: 0.25em 0.6em; }
.ext__scene-performers .castbox { max-width: 180px; min-height: unset; float: unset; margin-left: 0; }
.ext__scene-performers .castbox img.headshot { margin-left: -14px; }
`);

  const toggleStates = new Array(scenes.length).fill(false);
  const sceneToggles = scenes.map((sceneRow, sceneIndex) => {
    const sceneLabel = sceneRow.querySelector(':scope > td:first-of-type');
    const sceneLabelText = sceneLabel.innerText.toLowerCase();
    const scenePerformers = sceneLabel.nextElementSibling;
    const toggle = (newState = undefined) => {
      let sceneContainer = sceneRow.querySelector('.ext__scene-performers');
      if (sceneContainer) {
        sceneContainer.style.display = sceneContainer.style.display === 'none' || newState === true ? '' : 'none';
        toggleStates[sceneIndex] = sceneContainer.style.display !== 'none';
        return;
      } else if (newState === false) {
        return;
      }
      const performers = scenePerformers.innerText
        .match(/^.+$/m)[0] // grab first row
        .replace(/ \[[a-z0-9 ]+\]/gi, '') // remove tags
        .split(/, /g); // split names
      sceneContainer = document.createElement('div');
      sceneContainer.className = 'ext__scene-performers';
      performers.forEach((performer) => {
        // FIXME: 2+ performers with the same name, all in the same scene - https://ibb.co/sJhtKzy
        const matches = castboxes.filter(({ name }) => name === performer);
        if (matches.length === 0) {
          const [count, text] = performer.match(/^(\d+) (.+?)s?$/)?.slice(1, 3) ?? [1, performer];
          for (let i = 1; i <= count; i++) {
            const node = document.createElement('div');
            node.className = 'castbox';
            const p = document.createElement('p');
            const placeholder = document.createElement('div');
            Object.assign(placeholder.style, { width: '170px', height: '200px', padding: '1em' });
            const na = document.createElement('abbr');
            na.title = `Performer "${performer}" was not found above`;
            na.innerText = '[N/A]';
            p.append(placeholder, `${count == 1 ? performer : text} `, na);
            node.append(p);
            sceneContainer.append(node);
          }
        } else {
          if (matches.length > 1) {
            const warning = document.createElement('div');
            warning.innerText = `multiple matches for "${performer}"`;
            warning.className = 'multiple-matches';
            sceneContainer.prepend(warning);
          }
          matches.forEach(({ cb: performerCB }) => {
            const node = performerCB.cloneNode(true);
            // remove empty elements and extra line breaks from the inner paragraph element
            for (const cn of Array.from(node.firstElementChild.childNodes).reverse()) {
              if (cn.textContent.trim()) break;
              cn.remove();
            }
            sceneContainer.append(node);
          });
        }
      });
      scenePerformers.append(sceneContainer);
      toggleStates[sceneIndex] = true;
    };

    const sceneToggle = document.createElement('div');
    sceneLabel.append(sceneToggle);
    sceneToggle.append(...Array.from(sceneLabel.childNodes).slice(0, -1));
    sceneToggle.title = `View performers for ${sceneLabelText}`;
    sceneToggle.className = 'ext__scene-performers-toggle';
    sceneToggle.addEventListener('click', () => {
      if (window.getSelection().type === 'Range') return; // Prevent unwanted action when selecting text
      toggle();
    });

    return toggle;
  });

  // Toggle all scenes
  const sceneInfoHeading = sceneInfo.querySelector('.panel-heading h3');
  Object.assign(sceneInfoHeading.style, { cursor: 'pointer', textDecoration: 'double underline' });
  sceneInfoHeading.title = `View performers for all ${scenes.length} scenes\n  [hold Alt to reset]`;
  sceneInfoHeading.addEventListener('click', (ev) => {
    if (window.getSelection().type === 'Range') return; // Prevent unwanted action when selecting text
    if (ev.altKey) {
      sceneInfo.querySelectorAll('.ext__scene-performers').forEach((el) => el.remove());
      return toggleStates.fill(false);
    }
    const newState = toggleStates.filter(Boolean).length < scenes.length;
    sceneToggles.forEach((toggle) => toggle(newState));
  });
};

function personPage() {
  makeExportButton();

  document.querySelectorAll('a[target="starlet"]').forEach((el) => {
    el.target = '_blank';
  });

  const canonical = document.querySelector('#perfwith a[href^="/person.rme/"]')?.href;
  if (canonical)
    history.replaceState(null, '', canonical);

  const nameHeading = document.querySelector('h1');
  // remove trailing space
  nameHeading.textContent = nameHeading.textContent.replace(/[ \n]$/, '');
  // Director page
  if (/\/gender=d\//.test(location.pathname)) {
    const directorPage = document.createElement('b');
    directorPage.innerText = 'Director-only page:';
    const [maleLink, femaleLink] = ['male', 'female'].map((gender) => {
      const a = document.createElement('a');
      a.href = (canonical ?? location.href).replace('/gender=d/', `/gender=${gender.charAt(0)}/`);
      a.innerText = gender;
      return a;
    });
    const directorHelp = document.createElement('div');
    directorHelp.append(directorPage, ' try the ', maleLink, ' or ', femaleLink, ' performer pages');
    nameHeading.after(directorHelp);
  }

  const corrections = document.querySelector('#corrections');

  if (corrections) {
    const perfIdCorrectionInput = corrections.querySelector('input[name="PerfID"]');
    const gender = (
      ({ Woman: 'f', Man: 'm', 'Trans woman': 'tf', 'Trans man': 'tm' })[getBioDataElement('GENDER')?.innerText]
      ?? corrections.querySelector('input[name="Gender"]')?.value
    );
    const perfIdScenePair = document.querySelector('#scenepairings')?.dataset.src.match(/\/perfid=(.+)$/)?.[1];
    const headshotImg = document.querySelector('#headshot > img:not([src*="/nophoto"]):not([src*="iafd_ad.gif"])');
    // https://regex101.com/r/kyphBY/1
    const perfIdHeadshot = headshotImg?.src.match(/\/headshots\/(\w+?(?=_t?[fmd]_)|[a-z\d]+?(?=_t?[fmd]_|_\w+|\.jpg$))/i)?.[1];
    const perfId = perfIdCorrectionInput?.value ?? perfIdScenePair ?? perfIdHeadshot;

    const perfIdBio = makeBioEntry('Performer ID', `${perfId ?? '?'} [${gender.toUpperCase()}]`);
    perfIdBio[0].style.marginTop = '4em';
    corrections.before(...perfIdBio);

    const links = [];
    if (canonical) {
      const link = document.createElement('a');
      link.href = canonical;
      link.title = link.href;
      link.innerText = 'Performer Page Link';
      Object.assign(link.style, {
        color: '#337ab7',
        margin: '1em 0',
      });
      links.push(link);
    }

    // Legacy link
    if (perfId && gender) {
      const legacyLink = document.createElement('a');
      legacyLink.href = makeLegacyPerformerLink(perfId, gender, nameHeading.innerText);
      legacyLink.title = legacyLink.href;
      legacyLink.innerText = 'Legacy Performer Page Link';
      Object.assign(legacyLink.style, {
        color: '#337ab7',
        margin: '1em 0',
      });
      links.push(legacyLink);
    }

    if (links.length > 0)
      corrections.before(...makeBioEntry('🔗 Links', ...links));
  }

  performerDate(getBioDataElement('BIRTHDAY'));
  performerDate(getBioDataElement('DATE OF DEATH'));

  ['HEIGHT', 'WEIGHT'].forEach((headingText) => {
    const node = /** @type {Text | null | undefined} */ (getBioDataElement(headingText)?.firstChild);
    const match = node?.textContent.match(/(?<= \()(\d+) [a-z]+\)$/);
    if (!(match && node)) return;
    const metricNode = node.splitText(match.index); // split before metric value
    metricNode.splitText(match[1].length); // split after metric value
    metricNode.replaceWith(makeQuickSelect(match[1])); // replace metric value with quick-select
  });

  // examples: Lee Stone, Richard Moulton
  const akasDirectorElement = getBioDataElement('DIRECTOR AKA');
  if (/(?!^)No known aliases$/.test(akasDirectorElement?.innerText)) {
    akasDirectorElement.innerText = akasDirectorElement.innerText.match(/^(.+)No known aliases$/)[1];
  }

  const akasElement = getBioDataElement('AKA') ?? getBioDataElement('PERFORMER AKA');
  const akas = akasElement?.innerText.trim();
  // empty Performer AKA
  if (akas === '') {
    akasElement.innerText = 'No known aliases';
  }
  if (akas && akas !== 'No known aliases') {
    const copyButtonDefaultText = '[copy names]';

    const akasCopy = document.createElement('a');
    akasCopy.innerText = copyButtonDefaultText;
    akasCopy.title = 'Copy only the names used (removes site names)'
    akasCopy.id = 'copy-akas';
    Object.assign(akasCopy.style, { float: 'right', cursor: 'pointer', lineHeight: 1 });

    akasCopy.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      // https://regex101.com/r/7Ad3U1/2
      const names = akas.replace(/ \(.+?\)/g, '').split(/[,;\n] ?/g).map((s) => s.trim()).filter(Boolean);
      if (!names || names.length === 0) {
        akasCopy.innerText = '❌ Failed!';
        akasCopy.style.color = 'red';
        return;
      }

      const result = names.join(', ');
      GM.setClipboard(result);
      akasCopy.innerText = '✔ Copied to clipboard';
      akasCopy.style.color = 'green';
      akasElement.innerText = result;
      akasElement.style.backgroundColor = 'yellow';

      await wait(2500);
      akasCopy.innerText = copyButtonDefaultText;
      akasCopy.style.color = null;
      akasElement.innerText = akas;
      akasElement.style.backgroundColor = '';
    })

    akasElement.previousElementSibling.append(akasCopy);
  }
}

/**
 * @param {HTMLElement} [dateEl]
 */
const performerDate = (dateEl) => {
  if (!dateEl) return;
  const dateText = dateEl.innerText;
  const fullDate = dateText.trim().match(/([A-Z][a-z]+ \d{1,2}, \d{4})\b/);
  if (fullDate) {
    dateEl.prepend(makeISODateElement(fullDate[1]), document.createElement('br'));
  } else {
    const partialDate = dateText.trim().match(/(?<month>\?\?|\d{1,2})\/(?<day>\?\?|\d{1,2})\/(?<year>\d{2}[\d?]{2})/);
    if (partialDate) {
      const { year, month, day } = partialDate.groups;
      const exactYear = /^\d{4}$/.test(year);
      if (exactYear) {
        const dateParts = [year, month, day].join('-');
        const firstQM = dateParts.indexOf('?', 4) - 1;
        const [isoDate, remainder] = [dateParts.slice(0, firstQM), dateParts.slice(firstQM)];
        dateEl.prepend(makeQuickSelect(isoDate), remainder, document.createElement('br'));
      }

      if (month !== '??') {
        const partialDateStr = (new Date(dateText.replace(/\?\?/g, '01') + ' 12:00'))
          .toLocaleString('en-us', {
            month: month === '??' ? undefined : 'long',
            day: day === '??' ? undefined : 'numeric',
            year: exactYear ? 'numeric' : undefined,
          }) + (exactYear ? '' : `, ${year}`);
        dateEl.lastChild.before(document.createTextNode(partialDateStr), document.createElement('br'));
      }
    }
  }
}

function studioDistribSelectPage() {
  const select = document.querySelector('select[name="Studio"], select[name="Distrib"]');
  const pageType = select.closest('form').getAttribute('action').replace(/^\/|\.rme\/$/g, '').toLowerCase();
  const selectType = select.name.toLowerCase();
  const fullType = selectType === 'distrib' ? 'distributor' : selectType;
  const listId = `${selectType}-list`;
  const submit = document.querySelector('form input[type="submit"]');

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = `Lookup ${fullType}...`;
  input.setAttribute('list', listId);
  Object.assign(input.style, {
    display: 'block',
    width: window.getComputedStyle(select).width,
    marginBottom: '.5rem',
  });
  select.before(input);
  input.focus();

  const datalist = document.createElement('datalist');
  datalist.id = listId;
  for (const option of select.children) {
    const cloned = option.cloneNode(true);
    cloned.removeAttribute('value');
    datalist.append(cloned);
  }
  select.before(datalist);

  const escapeRegex = (string) => {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  input.addEventListener('input', () => {
    const value = input.value.trim();
    if (!value) return;
    const search = new RegExp(`^${escapeRegex(value)}`, 'i');
    const found = Array.from(select.children).find((o) => search.test(o.innerText));
    if (!found) return;
    select.value = found.value;
  });

  const handleClick = (/** @type {Event} */ ev) => {
    if (!select.value)
      return;

    ev.preventDefault();
    ev.stopPropagation();

    const displayName = select.selectedOptions[0].textContent.replace(/[^a-z0-9.-]/ig, '-');
    location.href = `https://www.iafd.com/${pageType}.rme/${selectType}=${select.value}/${displayName}.htm`;
  };

  select.addEventListener('dblclick', (ev) => {
    if (ev.target instanceof HTMLOptionElement)
      return handleClick(ev);
  });
  select.addEventListener('keyup', (/** @type {KeyboardEvent} */ ev) => {
    if (ev.key === 'Enter')
      return handleClick(ev);
  });

  submit.addEventListener('click', handleClick);
}

function studioDistribPage() {
  makeExportButton();
}

async function makeExportButton() {
  const filter = await elementReady('div[id$="_filter"]');
  const type = filter.id.split('_')[0];

  const exportButtonDefaultText = 'Export CSV';
  const exportTimestamp = (new Date()).toISOString();

  const tools = document.createElement('div');
  Object.assign(tools.style, {
    marginRight: '.5em',
    display: 'inline-block',
  });
  filter.prepend(tools);

  const button = document.createElement('button');
  button.type = 'button';
  button.innerText = exportButtonDefaultText;
  button.style.marginRight = '.5em';
  tools.prepend(button);

  (async () => {
    const info = await Promise.race([
      elementReady(`div#${type}_info`).then((el) => /** @type {HTMLDivElement} */ (el).innerText),
      wait(5000).then(() => null),
    ]);

    if (!info) return;

    /** @param {string} s */
    const toNumber = (s) => Number(s?.replace(/,/, ''));

    const { start, end, total } = info
      .match(/Showing (?<start>[\d,]+) to (?<end>[\d,]+) of (?<total>[\d,]+) entries/i)
      ?.groups || {};
    const count = toNumber(end) - Math.max(toNumber(start) - 1, 0);
    const totalCount = toNumber(total);
    let countLabel = `Count: ${count}`;
    if (count !== totalCount)
      countLabel += ` out of ${total}`;
    button.title = countLabel;
  })();

  button.addEventListener('click', async () => {
    const output = makeOutput(type);
    if (!output) {
      button.innerText = '❌ Failed!';
      button.style.backgroundColor = 'red';
      return;
    }

    GM.setClipboard(output);
    button.innerText = '✔ Copied to clipboard';
    button.style.backgroundColor = 'yellow';

    await wait(1500);
    button.innerText = exportButtonDefaultText;
    button.style.backgroundColor = '';
  });

  /** @param {string} type */
  const makeOutput = (type) => {
    const dataRows = Array.from(document.querySelectorAll(`div#${type}_wrapper .dataTable tbody > tr`));
    let columns;
    let csv;

    if (type === 'studio' || type === 'distable') {
      const data = dataRows.map((tr) => ({
        url: tr.children[0].querySelector('a').href,
        title: tr.children[0].innerText,
        studio: tr.children[1].innerText,
        year: Number(tr.children[2].innerText),
      }));

      columns = ['Title', 'Studio', 'Year', 'URL'];
      csv = data.map((d) => columns.map((c) => d[c.toLowerCase()]).join('\t'));
    } else if (type === 'personal') {
      const data = dataRows.map((tr) => ({
        url: tr.children[0].querySelector('a').href,
        title: tr.children[0].innerText,
        year: Number(tr.children[1].innerText),
        distributor: tr.children[2].innerText,
        notes: tr.children[3].innerText,
      }));

      columns = ['Title', 'Distributor', 'Year', /*'Notes', */'URL'];
      csv = data.map((d) => columns.map((c) => d[c.toLowerCase()]).join('\t'));
    } else {
      return null;
    }

    return columns.join('\t') +`\t${exportTimestamp}` + '\n' + csv.join('\n') + '\n';
  };
}

function personUpdatePage() {
}

async function tattooLookupPage() {
  const info = await Promise.race([
    elementReady(`div[id^="tat"][id$="_info"]`).then((el) => /** @type {HTMLDivElement} */ (el).innerText),
    wait(5000).then(() => null),
  ]);

  if (!info) return;
}

function setSearchField() {
  const field = document.querySelector('#the-basics > input[name="searchstring"]');
  const params = new URLSearchParams(location.search);
  field.value = params.get('searchstring');
}

const wait = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 *
 * @param {string} selector
 * @param {HTMLElement} [parentEl]
 * @returns {Promise<Element>}
 */
function elementReady(selector, parentEl) {
  return new Promise((resolve, reject) => {
    let el = (parentEl || document).querySelector(selector);
    if (el) {resolve(el);}
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from((parentEl || document).querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    })
    .observe(parentEl || document.documentElement, {
      childList: true,
      subtree: true
    });
  });
}

main();
