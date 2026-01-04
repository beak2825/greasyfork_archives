/* globals GM, GM.xmlHttpRequest, GM_setValue, GM_getValue, GM_info */
// ==UserScript==
// @name            Kinopoisk+
// @name:ru         Кинопоиск+
// @description     Adds links to search for popular torrent sites
// @description:ru  Добавляет ссылки для поиска по популярным торрент-сайтам
// @namespace       kp.user.js
// @version         1.1.9
// @author          Xant1k@bt (2015-2017), askornot (2020-2025)
// @license         MIT
// @icon            https://icons.duckduckgo.com/ip9/kinopoisk.ru.ico
// @homepageURL     https://greasyfork.org/en/scripts/418547-kinopoisk
// @supportURL      https://greasyfork.org/en/scripts/418547-kinopoisk/feedback
// @match           https://www.kinopoisk.ru/*
// @grant           GM.xmlHttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @connect         www.google.com
// @run-at          document-end
// @compatible      chrome     Violentmonkey 2.12.7
// @compatible      firefox    Greasemonkey  4.10.0
// @compatible      firefox    Tampermonkey  4.11.6120
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/418547/Kinopoisk%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/418547/Kinopoisk%2B.meta.js
// ==/UserScript==

'use strict';

const css = String.raw`
<style type="text/css">
  .resources { padding: 4px; }
  .resources a { display: inline-block; margin: 2px; }
  .resources a img { width: 16px; height: 16px; }
  .iface__resources { display: none; }
  .iface__resources__active { display: block; }
  .plus__square {
    background: none; vertical-align: top;
    border: none; color: rgba(31,31,31,.5); padding: 1px;
  }
  .plus__square:hover { color: #1f1f1f; }
  .plus__square:before { content: "\02795"; }
  .minus__square:before { content: "\2796"; }
  .input__resource { width: 80%; }
  label[for="input__resource"] {
    color: #393939;
    font-weight: 400; font-size: 12px;
  }
</style>`;

const DEFAULT_RESOURCES = [
  'https://reyohoho.github.io/reyohoho/#%id',
  'https://rutracker.org/forum/tracker.php?nm=%text %year',
  'https://kinozal.tv/browse.php?s=%text&d=%year',
  'https://rutor.info/search/0/0/100/0/%text %year',
  'https://teamhd.org/browse?search=%text&year=%YEAR',
  'https://nnmclub.to/forum/tracker.php?nm=%text %year',
  'https://www.imdb.com/search/title/?title=%engtext&release_date=%year,%endyear',
  'https://www.youtube.com/results?search_query=%text %year'
];

const HINT = (
  'Шаблоны для составления запроса %id, %text %engtext %year %endyear'
);

const LOADING_IMG = 'data:image/gif;base64,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';
const CONTAINER_WAITING_TIME = 1000;
const ONE_PIXEL = 1;

const STORAGE_KEY = '__kp_resources';
const USER_RESOURCES = [];
const QUERY_DATA = {};

let containerResources, controlResources;

const blobToBase64 = (blob, fn) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => fn(reader.result);
};

const favicon = ({ target }) => {
  if (target.naturalWidth === ONE_PIXEL) {
    target.setAttribute('src', LOADING_IMG);
    GM.xmlHttpRequest({
      url: 'https://www.google.com/s2/favicons?domain=' + target.alt,
      method: 'GET',
      onload: ({ status, response }) => {
        if (status === 200) {
          blobToBase64(response, (base64) => {
            target.setAttribute('src', base64);
          });
        }
      },
      responseType: 'blob'
    });
  }
};

const safeURL = (str) => {
  try {
    return new URL(str);
  } catch {
    return {};
  }
};

const querystring = (str) => (
  str.replace(/(?:%(\w+)?)/g, (str, word) => {
    if (word === undefined) return '';
    word = word.toLowerCase();
    return word in QUERY_DATA
      ? encodeURIComponent(QUERY_DATA[word])
      : str;
  })
);

const extractQueryData = () => {
  try {
    const script = document.querySelector('#__NEXT_DATA__');
    const { props, query } = JSON.parse(script.textContent);
    const { apolloState: { data } } = props;
    const { id } = query;
    const { releaseYears, productionYear, title } = (
      data[`TvSeries:${id}`] ||
      data[`Film:${id}`]
    );
    const [ year ] = Array.isArray(releaseYears)
      ? releaseYears
      : [ productionYear ];
    const { start, end } = typeof year === 'object'
      ? year
      : { start: year, end: year };
    Object.assign(QUERY_DATA, {
      id,
      year: start,
      endyear: end,
      engtext: title.original || title.russian,
      text: title.russian
    });
  } catch {}
};

const addResource = (host, href) => {
  const a = document.createElement('a');
  const img = document.createElement('img');
  const query = querystring(href);
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.setAttribute('title', host);
  a.setAttribute('href', query);
  img.setAttribute('src', 'https://favicon.yandex.net/favicon/' + host);
  img.setAttribute('alt', host);
  img.addEventListener('load', favicon, { once: true });
  img.addEventListener('error', favicon, { once: true });
  a.append(img);
  containerResources.insertAdjacentElement('afterbegin', a);
};

const addResourceClick = ({ target }) => {
  const { previousSibling: input } = target;
  const { host, href } = safeURL(input.value);
  if (host === undefined) return false;
  addResource(host, href);
  USER_RESOURCES.push(href);
  input.value = '';
};

const controlClick = ({ target }) => {
  target.classList.toggle('minus__square');
  controlResources.classList.toggle('iface__resources__active');
};

const initInterface = () => {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const button = document.createElement('button');
  const span = document.createElement('span');
  span.classList.add('error__resource');
  input.classList.add('input__resource');
  label.textContent = HINT;
  button.textContent = '+';
  label.setAttribute('for', 'input__resource');
  input.setAttribute('id', 'input__resource');
  button.addEventListener('click', addResourceClick);
  controlResources.append(label);
  controlResources.append(input);
  controlResources.append(button);
  controlResources.append(span);
  containerResources.insertAdjacentElement('afterend', controlResources);
};

const initControl = () => {
  const button = document.createElement('button');
  const i = document.createElement('i');
  button.className = 'plus__square';
  button.setAttribute('role', 'button');
  button.setAttribute('title', 'Добавить новый ресурс');
  button.addEventListener('click', controlClick);
  button.append(i);
  containerResources.append(button);
};

const initResources = (resources) => {
  for (const resource of resources) {
    const { host, href } = safeURL(resource);
    if (host === undefined) continue;
    addResource(host, href);
  }
};

extractQueryData();
if (Object.keys(QUERY_DATA).length === 0) return;
containerResources = document.createElement('div');
containerResources.classList.add('resources');
initResources(DEFAULT_RESOURCES);
const timer = setInterval(() => {
  const container = document.querySelector('.styles_posterContainer__DBJVw');
  if (container) clearInterval(timer);
  document.head.insertAdjacentHTML('beforeend', css);
  container.insertAdjacentElement('beforeend', containerResources);
  if (GM_info.scriptHandler !== 'Greasemonkey') {
    controlResources = document.createElement('div');
    controlResources.classList.add('iface__resources');
    const resources = GM_getValue(STORAGE_KEY, USER_RESOURCES);
    USER_RESOURCES.push(...resources);
    initResources(resources);
    initControl();
    initInterface();
    window.onbeforeunload = (event) => {
      GM_setValue(STORAGE_KEY, USER_RESOURCES);
      delete event.returnValue;
    };
  }
}, CONTAINER_WAITING_TIME);
