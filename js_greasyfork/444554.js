// ==UserScript==
// @name         Kanji Search Notes
// @namespace    http://tampermonkey.net/
// @version      1.2.17
// @description  Shows groups of related words (similar kanji, pronunciations, meanings, etc.), English-to-Japanese mnemonics, and other helpful comments/explanations.
// @author       Mark Hennessy
// @license      None
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1673042
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @homepageURL  https://community.wanikani.com/t/56890
// @downloadURL https://update.greasyfork.org/scripts/444554/Kanji%20Search%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/444554/Kanji%20Search%20Notes.meta.js
// ==/UserScript==

/*
Kanji Search Notes
==
Shows groups of related words (similar kanji, pronunciations, meanings, etc.),
English-to-Japanese mnemonics, and other helpful comments/explanations.

See the [Kanji Search FAQ](https://www.kanjisearch.com/faq.pdf) for more info.
*/

const COMMA_WITH_SPACE = ', ';
const JAPANESE_COMMA = '、';

const STORAGE_KEY = 'ks_data';

const KS_DOMAIN = 'https://www.kanjisearch.com';

const KS_LINK_CLASS = 'ks-link';

const CSS = `
  /* always test lesson, review, and detail pages when making style changes */
  .ks-note h3, #item-info .ks-note h3 {
    font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 18px;
    line-height: 20px;
    font-weight: 300;
    letter-spacing: -1px;
    text-shadow: 0 1px 0 #ffffff;
    margin: 10px 0;
  }

  #item-info .ks-note h3 {
    font-size: 1em;
    padding: 0;
  }

  .ks-note p {
    margin: 0 0 10px;
  }

  .ks-note p, .ks-note li {
    font-family: "Ubuntu", Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6em;
  }

  #item-info .ks-note p, #item-info .ks-note li {
    font-size: inherit;
  }

  .ks-note ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ks-heading-details {
    font-size: max(0.57em, 12px);
    vertical-align: middle;
  }

  .ks-link {
    color: inherit;
    text-decoration: none;
  }

  .ks-link:hover, .ks-link:focus {
    color: #005580;
    text-decoration: underline;
  }

  .ks-note-content {
    margin: 0 !important;
  }

  .ks-group,
  .ks-remark,
  .ks-definition {
    margin-bottom: 16px;
  }

  .pre {
    white-space: pre-wrap;
  }

  .ks-entry {
    position: relative;
  }

  .ks-currentEntry::before {
    content: '•';
    position: absolute;
    left: -8px;
    font-size: 8px;
  }

  /* undo style from Breeze Dark Stylus theme */
  #lesson #supplement-info .ks-note li span {
    box-shadow: initial !important;
  }
`;

injectStyle(CSS);

let currentType = null;
let currentCharacters = null;

// wkItemInfo is a global variable added by the WK Item Info Injector script
wkItemInfo
  .forType('kanji,vocabulary')
  .under('reading')
  .spoiling('meaning,reading')
  .append(
    createElementFromHtml(createNoteHeadingHtml()),
    async ({ type, characters }) => {
      currentType = type;
      currentCharacters = characters;

      const noteBody = await createNoteBodyHtml();

      // call setTimeout to allow the initial heading to be added to the DOM
      // before trying to update it
      setTimeout(updateHeading);

      return createElementFromHtml(noteBody);
    },
  );

function createNoteHeadingHtml() {
  const ksLink = createLinkHtml(
    KS_LINK_CLASS,
    KS_DOMAIN,
    'kanjisearch.com',
    true,
  );

  return `
  <span class="ks-heading">
    Notes <span class="ks-heading-details">(${ksLink})</span>
  </span>`;
}

function updateHeading() {
  const [ksLink] = document.getElementsByClassName(KS_LINK_CLASS);
  if (ksLink) {
    ksLink.setAttribute(
      'href',
      `${KS_DOMAIN}/${currentType}/${currentCharacters}`,
    );
  }
}

async function createNoteBodyHtml() {
  const noteOrErrorMessage = await createNoteOrErrorMessageHtml();

  return `
  <div class="ks-note" lang="ja">
    ${noteOrErrorMessage}
  </div>`;
}

async function createNoteOrErrorMessageHtml() {
  try {
    const note = await getNote();

    if (
      !note?.groups.length &&
      !note?.remarks.length &&
      !note?.definitions.length
    ) {
      return createNoneMessageHtml();
    }

    return createNoteHtml(note);
  } catch (e) {
    return createErrorHtml(e);
  }
}

async function getNote() {
  const response = await fetch(
    `${KS_DOMAIN}/notes/${currentType}/${currentCharacters}.json`,
  );

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  let errorMessage;
  if (data) {
    errorMessage = data.error || JSON.stringify(data);
  } else {
    errorMessage = `${response.status} ${response.statusText}`;
  }

  throw new Error(errorMessage);
}

function createNoneMessageHtml() {
  return '<p>None</p>';
}

function createErrorHtml(error) {
  return `
  <h3 class="ks-error-heading">Error</h3>
  <p>${error.message}</p>`;
}

function createNoteHtml(note) {
  const { groups, remarks, definitions } = note;

  const content = [
    createGroupsHtml(groups),
    createRemarksHtml(remarks),
    createDefinitionsHtml(definitions),
    createDonationsHtml(),
  ]
    .filter(Boolean)
    .map(createNoteContentHtml)
    .join('');

  return content;
}

function createNoteContentHtml(sectionContent) {
  return `
  <div class="ks-note-content">
    ${sectionContent}
  </div>`;
}

function createGroupsHtml(groups) {
  if (!groups.length) {
    return null;
  }

  return `
  <h3>Groups</h3>
  <ul class="ks-groups">
    ${groups.map(createGroupHtml).join('')}
  </ul>`;
}

function createGroupHtml(group) {
  return `
  <li class="ks-group">
    ${createEntriesHtml(group.entries)}
  </li>`;
}

function createEntriesHtml(entries) {
  return `
  <ul class="ks-entries">
    ${entries.map(createEntryHtml).join('')}
  </ul>
  `;
}

function createEntryHtml(entry) {
  const { characters, metadata, meanings } = entry;

  return `
  <li class="${cn({
    'ks-entry': true,
    'ks-currentEntry': characters === currentCharacters,
  })}">
    ${createCharactersHtml(characters, metadata.notOnWk)}
    ${createMetadataHtml(metadata)}
    ${createMeaningsHtml(meanings)}
  </li>`;
}

function createCharactersHtml(characters, notOnWk) {
  if (notOnWk) {
    return createCharactersSpanHtml(characters);
  }

  return createCharactersLinkHtml(characters);
}

function createCharactersSpanHtml(characters) {
  return `
  <span class="ks-characters" tabindex="0" title="not on WaniKani">
    ${characters}
  </span>`;
}

function createCharactersLinkHtml(characters) {
  const href = `https://www.wanikani.com/${currentType}/${characters}`;
  return createLinkHtml(
    `ks-characters ${KS_LINK_CLASS}`,
    href,
    characters,
    true,
  );
}

function createMetadataHtml(metadata) {
  return `
  <span class="ks-metadata">
    （${serializeMetadata({ ...metadata, override: false })}）
  </span>`;
}

function serializeMetadata(metadata) {
  const { readingGroups, vt, vi, unknown, kanaOnly, notOnWk, override } =
    metadata;

  const readingGroupStrings = readingGroups.map((readingGroup) => {
    return readingGroup.readings.join(COMMA_WITH_SPACE);
  });

  return joinNonEmpty(
    [
      ...readingGroupStrings,
      vt && 'vt',
      vi && 'vi',
      ...unknown,
      kanaOnly && 'kana only',
      notOnWk && 'not on WK',
      override && 'override',
    ],
    JAPANESE_COMMA,
  );
}

function joinNonEmpty(array, separator) {
  return array.filter(Boolean).join(separator);
}

function createMeaningsHtml(meanings) {
  return `
  <span class="ks-meanings">
    ${meanings.join(COMMA_WITH_SPACE)}
  </span>`;
}

function createRemarksHtml(remarks) {
  if (!remarks.length) {
    return null;
  }

  return `
  <h3>Remarks</h3>
  <ul class="ks-remarks">
    ${remarks.map(createRemarkHtml).join('')}
  </ul>`;
}

function createRemarkHtml(remark) {
  // single-line formatting is needed for white-space: pre
  return `
  <li class="ks-remark pre">${remark}</li>`;
}

function createDefinitionsHtml(definitions) {
  if (!definitions.length) {
    return null;
  }

  return `
  <h3>Definitions</h3>
  <ul class="ks-definitions">
    ${definitions.map(createDefinitionHtml).join('')}
  </ul>`;
}

function createDefinitionHtml(definition) {
  // single-line formatting is needed for white-space: pre
  return `
  <li class="ks-definition pre">${definition}</li>`;
}

function createDonationsHtml() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  let notesLoaded = data.notesLoaded || 0;
  notesLoaded++;
  data.notesLoaded = notesLoaded;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  const donationMessageThreshold = 600;
  if (notesLoaded % donationMessageThreshold !== 0) {
    return null;
  }

  const donationUrl = 'https://www.paypal.com/paypalme/mhennessy116';
  const donating = createLinkHtml(null, donationUrl, 'donating', true);
  const donations = createLinkHtml(null, donationUrl, 'donations', true);

  const message1 = `
  <p>
    Do you love Kanji Search notes and use them every day? Have you donated
    this month? Please consider ${donating} to show your support.
    Donations help keep the service running and fund new updates and features.
    How much is up to you. Enough to buy a cup of coffee, or a meal if you’re
    feeling generous.
  </p>
  <p>
    Thank you so much for using my service 💖, and all the best on your
    Japanese learning journey.
  </p>
  <p>
    頑張ってね！
  </p>`;

  const message2 = `
  <p>
    Hi! I'm Mark. I single-handedly created Kanji Search to share my notes with
    you.
  </p>
  <p>
    However, the Kanji Search website and user script were expensive to build
    (over 6 months of full-time unpaid work) and continue to be expensive to
    maintain since data is hosted by my own service and database.
    I’d hate to have to compromise the service in the future due to rising
    maintenance costs and a lack of donations. Even small ${donations} add up!
  </p>
  <p>
    どうもありがとうございました 💖
  </p>`;

  const donationMessage =
    (notesLoaded / donationMessageThreshold) % 2 === 1 ? message1 : message2;

  return `
  <h3>Donations</h3>
  ${donationMessage}`;
}

function createLinkHtml(className, href, content, openInNewTab) {
  const classAttribute = className ? `class="${className}"` : '';

  const hrefAttribute = `href="${href}"`;

  const openInNewTabAttributes = openInNewTab
    ? 'target="_blank" rel="noopener noreferrer"'
    : '';

  const attributes = `${classAttribute} ${hrefAttribute} ${openInNewTabAttributes}`;

  // this needs to be formatted on one line since <a> is an inline element and
  // would otherwise preserve unwanted space
  return `<a ${attributes}>${content}</a>`;
}

function injectStyle(css) {
  const [head] = document.getElementsByTagName('head');
  if (!head) {
    return;
  }

  const STYLE_ID = 'kanjisearch';
  const existingStyleElement = document.getElementById(STYLE_ID);
  if (existingStyleElement) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.setAttribute('id', STYLE_ID);
  styleElement.innerHTML = css;
  head.appendChild(styleElement);
}

function createElementFromHtml(html) {
  const placeholder = document.createElement('div');
  placeholder.innerHTML = html;
  return placeholder.firstElementChild;
}

function cn(classConfig) {
  return Object.entries(classConfig)
    .filter((entry) => entry[1])
    .map((entry) => entry[0])
    .join(' ');
}
