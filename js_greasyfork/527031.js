// ==UserScript==
// @name         SLS Tuesday
// @namespace    http://tampermonkey.net/
// @version      2.7.22
// @description  Trailers
// @author       Ange & Sturm
// @match        https://video.dmm.co.jp/av/list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmm.co.jp
// @require      https://cdnjs.cloudflare.com/ajax/libs/htm/3.1.1/htm.min.js
// @require      https://unpkg.com/react@18.3.1/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js
// @require      https://unpkg.com/styled-components@4.3.2/dist/styled-components.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/date-fns/4.1.0/cdn.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.js
// @require      https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js
// @require      https://cdn.jsdelivr.net/npm/vanilla-calendar-pro@3.0.3/index.min.js
// @require      https://unpkg.com/@yaireo/tagify@4.33.2/dist/tagify.js
// @require      https://unpkg.com/compare-versions@6.1.1/lib/umd/index.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_openInTab
// @resource     TOAST_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @resource     OPENSANS_CSS https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap
// @resource     FANCYBOX_CSS https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css
// @resource     CAL_CSS https://cdn.jsdelivr.net/npm/vanilla-calendar-pro@3.0.3/styles/index.min.css
// @resource     TAG_CSS https://unpkg.com/@yaireo/tagify@4.33.2/dist/tagify.css
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/527031/SLS%20Tuesday.user.js
// @updateURL https://update.greasyfork.org/scripts/527031/SLS%20Tuesday.meta.js
// ==/UserScript==

const { useCallback, useState, useRef, useEffect, createElement, Fragment, forwardRef, useMemo } = React;
const { getDate, endOfMonth, eachDayOfInterval, startOfMonth, lastDayOfMonth, isTuesday, formatDate, addDays, nextTuesday, previousFriday, previousSaturday, isFuture, isSameDay } = dateFns;
const hooks = `{"iv":[121,169,165,181,237,194,145,101,63,170,245,105],
"salt":[22,145,186,245,86,228,74,13,17,250,142,122,29,170,41,9],
"data":[69,104,66,156,171,25,86,92,169,221,46,34,94,163,190,233,116,146,27,225,163,112,183,25,189,243,170,170,62,139,59,63,84,39,107,163,74,153,109,131,50,153,17,136,242,125,172,130,199,98,29,79,162,96,13,55,22,158,90,51,227,175,78,16,95,249,154,38,145,80,44,63,151,254,147,182,103,87,235,76,63,66,218,119,30,56,104,158,250,114,30,155,20,233,75,134,54,164,218,94,254,188,138,78,25,73,213,31,214,195,5,246,199,226,65,173,110,195,95,229,189,106,73,58,165,204,97,61,203,173,15,186,238,172,14,48,21,167,208,238,144,31,142,64,206,36,198,255,78,18,120,51,219,103,203,127,69,244,253,250,41,68,197,148,216,69,203,96,152,216,157,171,187,42,37,9,117,242,146,64,39,54,91,255,32,45,248,79,148,165,145,92,94,171,131,118,50,55,35,94,26,105,142,149,30,7,255,231,196,92,109,195,117,64,215,65,67,212,184,152,154,17,49,210,191,230,126,211,190,58,143,103,97,57,55,28,36,156,155,46,58,240,167,90,86,119,228,130,58,15,12,236,62,30,32,19,251,236,45,52,143,101,169,90,179,210,59,250,215,173,154,71,19,200,80,123,202,74,193,1,122,163,246,159,11,13,104,176,103,150,141,78,246,112,113,0,28,116,162,163,159,51,174,62,105,255,177,112,7,101,114,226,141,175,149,63,141,3,1,103,129,58,225,144,197,182,118,251,69,168,151,230,239,121,55,42,210,47,209,65,23,71,111,114,173,83,72,87,32,42,184,135,70,62,23,48,243,241,244,125,56,25,12,218,154,28,135,221,56,140,116,38,68,197,202,109,36,139,191,252,22,112,56,152,4,57,219,255,22,224,87,113,17,23,70,208,103,78,104,227,187,178,6,74,157,83,241,69,208,252,61,164,171,88,236,79,195,70,160,76,122,236,58,185,10,6,132,52,24,38,80,69,139,62,127,177,24,162,227,240,45,50,146]}`;

const getCurrentTokyoDateTime = () => new Date(new Intl.DateTimeFormat('en-US', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZone: 'Asia/Tokyo',
}).format());

const currentTokyoDateTime = getCurrentTokyoDateTime();

// 2025-05-02
const convertDatestringToTokyoDate = datestring => {
  const [yearString, monthString, dateString] = datestring.split('-');
  const [year, month, date] = [yearString, monthString, dateString].map(s => Number(s));
  const tokyo = new Date(new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Tokyo',
  }).format());
  tokyo.setFullYear(year);
  tokyo.setMonth(month - 1, date);
  return tokyo;
};

const getCurrentPageAndDate = () => {
  const currentPageURL = new URL(window.location.href);
  const date = currentPageURL.searchParams.get('date') || null;
  return { currentPageURL, date };
};

if (!getCurrentPageAndDate().date) return console.log("Error: No `date` query param found. Wrong url");

// const EXCLUDE_LABELS = new Set(['mizd', 'dazd']);
const EXCLUDE_LABELS = new Set([]);

const html = htm.bind(createElement);
const qs = (q, el = document) => el?.querySelector(q);
const qsa = (q, el = document) => [...el?.querySelectorAll(q)];
const headers = {
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Cache-Control': 'no-cache',
};

const store = {
  get: key => localStorage.getItem(key),
  set: (key, value) => { localStorage.setItem(key, value); return value; },
  isTrue: key => localStorage.getItem(key) === 'true',
  isFalse: key => localStorage.getItem(key) === 'false',
};

const showToast = (text, destination) => {
  const isTextAnObject = text?.constructor === Object;
  const options = isTextAnObject ? text : {};
  text = isTextAnObject ? '' : text;

  const toast = Toastify({
    text,
    duration: 3000,
    destination,
    gravity: "top",
    position: "left",
    newWindow: true,
    style: { fontFamily: "Open Sans", background: "#6233ae" },
    ...options,
  });

  toast.showToast();
  return toast;
};

const showErrorToast = text => showToast({ text, style: { fontFamily: "Open Sans", background: "#CD1C18" } });

const fetchResponse = (url, options = {}) => {
  const { origin } = new URL(url);
  const requestOptions = {
    headers,
    ...options,
    url,
    method: options.method || 'GET',
    responseType: options.responseType || 'document',
    cookiePartition: { topLevelSite: origin },
  };

  if (options.data) requestOptions.data = options.data;

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({ ...requestOptions, onload: res => resolve(res), onerror: err => reject(err) });
  });
};

const isResourceOnline = async (url, options = {}) => {
  const { status } = await fetchResponse(url, {
    method: 'HEAD',
    headers,
    ...options,
  }).catch(() => ({ status: 500, finalUrl: '', responseHeaders: '' }));
  return status < 300;
};

const getDmmId = cid => {
  const id = /([a-z]+)[0-9]+[a-z]{0,3}\d?$/.exec(cid)?.[0] || cid;
	const result = /([a-z]+((?<=\bt)28)?)[^0-9a-z]?(\d+[a-z]{0,4}\d?$)/.exec(id);
  if (!result) return id;
  const label = result[1];
  let code = result[3];
	let digits = /\d+/.exec(code)[0];
	if (digits.length >= 5 && code.startsWith('00')) {
    digits = digits.slice(2, digits.length);
    code = code.slice(2, code.length);
  }
	if (digits.length >= 5 && code.startsWith('0')) code = code.slice(1, code.length);
	if (label && code) return `${label}-${code}`.toUpperCase();
	return id;
};

const getActress = (() => {
  const cache = new Map();

  return async jpName => {
    try {
      const cachedInfo = cache.get(jpName);
      if (cachedInfo) return cachedInfo;
      // search first
      const { response: searchHtml } = await fetchResponse(`https://japantube.video/?s=${jpName}`);
      const posts = qsa('.actress-list .post', searchHtml).map(post => {
        const a = qs('.actress-list-image h2 a', post);
        return { name: a?.innerText?.trim(), url: a?.href };
      });
      const firstResult = posts.find(post => post?.name?.includes(jpName));
      if (!firstResult?.url) return null;
      // actress page
      const { response } = await fetchResponse(firstResult.url);
      const name = qs('.actress-english-name', response)?.innerText?.split('/')?.[0]?.trim()?.split(' ')?.reverse()?.join(' ')?.replace('ū', 'u')?.replace('ō', 'o');
      const jpNameFromPage = qs('.actress-meta h1 a', response)?.innerText?.trim();
      const info = {
        jpName: jpNameFromPage,
        ruby: qs('.actress-meta h1 span', response)?.innerText?.replace('(', '')?.split('、')[0]?.replace(')', '')?.trim(),
        name: name || jpNameFromPage || '', // jpName used for actresses that have romanji names, i.e. RARA
      };
      cache.set(jpName, info);
      return info;
    } catch (e) {
      console.error(e);
      cache.set(jpName, null);
      return null;
    }
  };
})();

const getTrailerFromProductPage = async url => {
  const { response: html } = await fetchResponse(url, { headers });
  const urlObj = new URL(url).search;
  const id = new URLSearchParams(urlObj).get('id');
  const scriptNodes = qsa("script", html);
  const hydrationScriptNodes = Array.from(scriptNodes).filter((e) => e.innerHTML.includes("self.__next_f.push"));
  const scriptNode = hydrationScriptNodes.find((e) => (e.innerHTML.includes(`\\"__typename\\":\\"av\\"`) || e.innerHTML.includes(`\\"__typename\\":\\"amateur\\"`)) && e.innerHTML.includes(id));
  const nextData = scriptNode.innerHTML.replace('self.__next_f.push(', '').replace(/\)$/, '');
  const contents = JSON.parse(nextData)[1].replace(/^\d+:/, '')
  const json = JSON.parse(contents).pop().content;
  return json.sampleMovie?.movieUrlForSeo || '';
};

const getTrailer = async (cid, useApi = false) => {
  const match = /^((\w)\w\w)/.exec(cid);
  if (!match) return '';
  const [, firstThreeLetters, firstLetter] = match;
  const trailer = `https://cc3001.dmm.com/litevideo/freepv/${firstLetter}/${firstThreeLetters}/${cid}/${cid}hhb.mp4`;

  if (!useApi) return trailer;

  if (await isResourceOnline(trailer, { headers })) return trailer;
  const mediumQualityTrailer = trailer.replace('hhb.mp4', 'mhb.mp4');
  if (await isResourceOnline(mediumQualityTrailer, { headers })) return mediumQualityTrailer; // try medium quality
  return '';
};

const waitForElm = (selector, el = document) => {
  return new Promise((resolve, reject) => {
    if (qs(selector, el)) return resolve(qs(selector, el));

    const observer = new MutationObserver(() => {
      if (qs(selector, el)) {
        observer.disconnect();
        resolve(qs(selector, el));
      }
    });

    setTimeout(() => {
      observer.disconnect();
      reject(`${selector} not found`);
    }, 2000);

    observer.observe(document.body, { childList: true, subtree: true });
  });
};

const imagesToZip = async (maker, date, images) => {
  let errorCount = 0;
  const downloadImage = async ({ src, title }) => {
    const result = await fetchResponse(src, { responseType: 'arraybuffer', headers });
    if (result.status > 300) errorCount++;
    return { file: result.response, title };
  };

  const promises = images.map(downloadImage);
  const imagesWithFile = await Promise.all(promises);
  if (errorCount > 0) showErrorToast(`Error: ${errorCount} image${errorCount === 1 ? '' : 's'} failed to download. Check zip.`);
  const title = `${maker} (${date})`;
  const zip = new JSZip();
  const folder = zip.folder(title);

  if (imagesWithFile.length) imagesWithFile.forEach(img => folder.file(img.title, img.file));

  const content = await zip.generateAsync({ type:'blob' });
  saveAs(content, `${title}.zip`);
};

const buildTrailer = async cid => {
  try {
    // if (!trailer || trailer === '$undefined') return '';
    const aliveTrailer = await getTrailer(cid, true);
    if (aliveTrailer) return aliveTrailer;
    return getTrailerFromProductPage(`https://video.dmm.co.jp/av/content/?id=${cid}`);
  } catch {
    return '';
  }
};

const extractTitlesFromDmm = html => {
  const scriptNodes = qsa("script", html);
  const hydrationScriptNodes = Array.from(scriptNodes).filter((e) => e.innerHTML.includes("self.__next_f.push"));
  const scriptNode = hydrationScriptNodes.find((e) => e.innerHTML.includes("contentList"));
  const nextData = scriptNode.innerHTML.replace('self.__next_f.push(', '').replace(/\)$/, '');
  const contents = JSON.parse(nextData)[1].replace(/^\d+:/, '');
  const contentList = JSON.parse(contents).pop().contentList;
  return contentList.map(content => {
    const { id, packageImage, sampleImageList, actressList, deliveryStartAt, isVr, sampleMovieUrl } = content;
    return {
      cid: id,
      id: getDmmId(id),
      label: id.split('00')[0],
      url: `https://video.dmm.co.jp/av/content/?id=${id}`,
      date: new Date(deliveryStartAt.replace('$D', '')).toISOString(),
      poster: packageImage,
      cover: packageImage.replace('ps.jpg', 'pl.jpg'),
      gallery: sampleImageList,
      actresses: actressList.map(({ id, name }) => ({ id, name: ACTRESSES[name] || name, isTranslated: !!ACTRESSES[name] })),
      actressesByName: actressList.map(({ name }) => ACTRESSES[name] || name ),
      trailerPromise: buildTrailer(id),
      isVr,
    };
  });
};

const buildUrls = async (currentPageNumber, html, baseUrl) => {
  const elm = await waitForElm('[data-e2eid="pagination"]', html);
  const lastPageURL = qs('a', qsa('li', elm).at(-2))?.href;
  const totalPages = lastPageURL ? new URL(lastPageURL).searchParams.get('page') : currentPageNumber || '1';
  return Array.from({ length: Number(totalPages) }, (_, idx) => {
    const url = new URL(baseUrl);
    url.searchParams.set('page', idx + 1);
    return url.href;
  });
};

const getCompilationExcludeCids = async () => {
  const MAX_ACTRESS_LIMIT = 1;
  try {
    const bestUrl = 'https://video.dmm.co.jp/av/list/?genre=6608&sort=release_date';
    const compilationUrl = 'https://video.dmm.co.jp/av/list/?genre=6003&sort=release_date';
    const promises = [bestUrl, compilationUrl].map(async url => {
      const { response } = await fetchResponse(url);
      const items = await extractTitlesFromDmm(response);
      return items.filter(i => i.actresses.length > MAX_ACTRESS_LIMIT).map(i => i.cid);
    });
    return (await Promise.all(promises)).flat();
  } catch {
    return [];
  }
};

const TAB_MAKER_ID = 'maker';
const TAB_DEBUT_ID = 'debut';
const TAB_ACTRESS_ID = 'actress';
const TAB_SCHEDULE_ID = 'schedule';
const TAB_PID_ID = 'pid';
const TAB_SETTINGS_ID = 'settings';
const TABS = [
  { id: TAB_MAKER_ID, title: 'Makers', tabId: 'tab1' },
  { id: TAB_DEBUT_ID, title: 'Debut', tabId: 'tab2' },
  { id: TAB_ACTRESS_ID, title: 'Actress', tabId: 'tab3' },
  { id: TAB_SCHEDULE_ID, title: 'Schedule', tabId: 'tab4' },
  { id: TAB_SETTINGS_ID, title: 'Settings', tabId: 'tab6' },
];

if (store.isTrue('isPID')) TABS.splice(4, 0, { id: TAB_PID_ID, title: 'PID', tabId: 'tab5' });

const scheduleDates = (numberOfTuesdays = 4) => {
  const today = currentTokyoDateTime;
  const firstOfNextMonth = addDays(endOfMonth(today), 1);
  const daysInCurrentMonth = eachDayOfInterval({ start: startOfMonth(today), end: lastDayOfMonth(today) });
  const daysInNextMonth = eachDayOfInterval({ start: firstOfNextMonth, end: lastDayOfMonth(firstOfNextMonth) });
  const allTuesdays = [daysInCurrentMonth, daysInNextMonth].flatMap(months => {
    const allTuesdays = months.filter(isTuesday);
    const tuesdays = allTuesdays.map((d, idx) => {
      // Add another week if there are 5 tuesdays in a month
      const fridayReleaseDay = addDays(d, allTuesdays.length > 4 ? 31 : 24);
      const saturdayReleaseDay = addDays(d, allTuesdays.length > 4 ? 32 : 25);
      return {
        tuesday: formatDate(d, 'yyyy-MM-dd'),
        tuesdayShortText: formatDate(d, 'do EEEE'),
        tuesdayText: formatDate(d, 'do EEEE, MMMM'),
        friday: formatDate(fridayReleaseDay, 'yyyy-MM-dd'),
        fridayText: formatDate(fridayReleaseDay, 'do MMMM'),
        saturday: formatDate(saturdayReleaseDay, 'yyyy-MM-dd'),
        saturdayText: formatDate(saturdayReleaseDay, 'do MMMM'),
        month: formatDate(d, 'MMMM'),
        slot: idx,
      };
    });
    return tuesdays.slice(0, numberOfTuesdays);
  });
  return allTuesdays.reduce((acc, day) => {
    if (!acc[day.month]) acc[day.month] = [day];
    else acc[day.month].push(day);
    return acc;
  }, {});
};

const sortReleases = (releases, uniqueLabels) => {
  const results = releases
    .toSorted((a, b) => (a.cid > b.cid) ? 1 : (b.cid > a.cid) ? -1 : 0)
    .reduce((acc, release) => {
      if (!uniqueLabels.has(release.label)) return acc;
      if (!acc[release.label]) acc[release.label] = [release];
      else acc[release.label].push(release);
      return acc;
    }, {});
  return [...uniqueLabels].flatMap(lbl => results[lbl] || []);
};

const getActresses = (releases, excludeCids = []) => {
  const filteredReleases = releases.filter(r => !excludeCids.includes(r.cid));
  return [...new Set(
    filteredReleases.flatMap(rls => rls.actresses.map(({ name }) => name))
  )].toSorted((a, b) => (a > b) ? 1 : (b > a) ? -1 : 0);
};

const updateDmmElementVisibility = isFullScreen => {
  const header = qs('header');
  const footer = qs('footer');
  const navigation = qs('[data-e2eid="nav-header"]');
  const sidebar = qs('main > div > div');
  const els = qsa('main > div > div + div > :not(div.sls)');
  qs('div.sls')?.parentElement?.classList[isFullScreen ? 'remove' : 'add']('ml-4');
  [header, footer, navigation, sidebar, ...els].forEach(el => el?.setAttribute('style', `display: ${isFullScreen ? 'none' : 'block'}`));
};

const getResults = async (currentPageNumber, html, baseUrl = window.location.href) => {
  const urls = await buildUrls(currentPageNumber, html, baseUrl);
  const htmlPages = urls.map(async url => {
    const currentPageURL = new URL(url);
    const page = currentPageURL.searchParams.get('page');
    const { response } = page === currentPageNumber ? { response: html } : await fetchResponse(url);
    return extractTitlesFromDmm(response);
  });
  return (await Promise.all(htmlPages)).flat();
};

const updateFilteredReleases = (releases, selectedActress, selectedTab, inputText, setFilteredReleases) => {
  if (selectedTab === TAB_ACTRESS_ID) {
    const filteredList = selectedActress === '' ? releases : releases.filter(r => r.actressesByName.includes(selectedActress));
    setFilteredReleases(filteredList);
    return;
  }

  if (!inputText) return setFilteredReleases(releases);

  const items = inputText.split(',').map(l => l.trim());
  const uniqueLabels = new Set(items);

  if (selectedTab === TAB_MAKER_ID) return setFilteredReleases(sortReleases(releases, uniqueLabels));
  if (selectedTab === TAB_DEBUT_ID) return setFilteredReleases(releases.filter(r => uniqueLabels.has(r.cid)));

  setFilteredReleases(releases);
};

const createState = initialValue => {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);
  const stateSetter = updatedState => {
    setState(updatedState);
    stateRef.current = updatedState;
  };
  return [state, stateRef, stateSetter];
};

const versionCheck = async () => {
  if (store.isTrue('disableVersionCheck')) return;
  try {
    const scriptVersion = GM_info.script.version;
    const { response } = await fetchResponse('https://greasyfork.org/en/scripts/527031-sls-tuesday/versions?show_all_versions=1');
    const version = qs('.history_versions > li:first-child .version-number', response)?.innerText?.trim()?.replace('v', '');
    if (!version || (compareVersions.compare(version, scriptVersion, '<='))) return;
    const toast = showToast({
      text: `Update available: v${version}`,
      duration: 0,
      onClick: () => {
        GM_openInTab('https://greasyfork.org/en/scripts/527031-sls-tuesday', { active: true });
        toast.hideToast();
      },
    });
  } catch (e) {
   console.error(e);
  }
};

const main = async () => {
  const isError = !qs('main h1')?.innerText || qs('main h1').innerText?.includes('404');
  if (isError) return showToast('This page has no releases (404) or is corrupt and you need to refresh');
  const toast = showToast({ text: "Loading SLS Tuesday 🐑🐑🐑", duration: 0 });
  const { currentPageURL } = getCurrentPageAndDate();
  try {
    const bestAndCompilationExcludeCids = getCompilationExcludeCids();
    const [results, app] = await Promise.all([
      getResults(currentPageURL?.searchParams?.get('page') || '1', document),
      waitForElm('main > div > div + div > div > ul'),
    ]);

    app.setAttribute('class', '');
    app.closest('div').setAttribute('class', 'sls');
    toast.hideToast();
    if (!app) return;
    const root = ReactDOM.createRoot(app);
    root.render(html`<${CardContainer} results=${results} bestAndCompilationExcludeCidsPromise=${bestAndCompilationExcludeCids} />`);
  } catch(e) {
    console.log(e);
  } finally {
    toast.hideToast();
  }
};

const waitForEventListeners = (selectors, callback) => {
  const result = { SUCCESS: 'Click events found', ERROR: 'Click events not found' };
  let timeout = null;

  try {
    const allElementsHaveOnClick = els => els.every(el => el.onclick);
    const elements = qsa(selectors);

    if (allElementsHaveOnClick(elements)) return callback(result.SUCCESS);

    const interval = setInterval(() => {
      if (allElementsHaveOnClick(elements)) {
        if (timeout) clearTimeout(timeout);
        clearInterval(interval);
        callback(result.SUCCESS);
      }
    }, 50);

    timeout = setTimeout(() => {
      clearInterval(interval);
      callback(result.ERROR);
    }, 5000);
  } catch {
    callback(result.ERROR);
  }
};

// Wait until one of these buttons have the "click" event attached. It should mean next.js has finished hydrating.
waitForEventListeners('[data-e2eid="sample-image-button"], [data-e2eid="sample-movie-button"]', status => {
  console.log(status);
  main();
});

// UI
const CardContainer = ({ results, bestAndCompilationExcludeCidsPromise }) => {
  const NO_MAKER = 'No maker';
  const [makersBase, setMakersBase] = useState(MAKERS);
  const [selectedMaker, setSelectedMaker] = useState(NO_MAKER);
  const [selectedTab, selectedTabRef, setSelectedTab] = createState(TABS[0].id);
  // releases
  const [releases, setReleases] = useState(results);
  const [filteredReleases, setFilteredReleases] = useState(releases);
  const releasesRef = useRef([]); // for autoscrolling
  // date
  const [date, setDate] = useState(getCurrentPageAndDate().date);
  // actresses
  const [actresses, setActresses] = useState([]);
  const [selectedActress, setSelectedActress] = useState('');
  const actressesRef = useRef(null);
  // input field
  const [inputText, setInputText] = useState('');
  // calendar
  const [, calendarRef, setCalendar] = createState(null);
  // loading state
  const [isDisabled, setDisabled] = useState(false); // <ActionBar />
  const [isLoadingLabels, setIsLoadingLabels] = useState(false); // finding new labels or debuts
  const [isUpdatingReleases, isUpdatingReleasesRef, setIsUpdatingReleases] = createState(false); // fetching releases from date change or refresh
  // setting
  const [is24Hr, setIs24Hr] = useState(store.isTrue("is24Hr"));
  const [enableDiscord, setEnableDiscord] = useState(store.isTrue("enableDiscord") ?? true);
  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [discordSubmitQueue, setDiscordSubmitQueue] = useState([]);

  const showDateHeading = [TAB_MAKER_ID, TAB_DEBUT_ID, TAB_ACTRESS_ID, TAB_SCHEDULE_ID].includes(selectedTab);

  // discord
  const [webhookUrlChannel, setWebhookUrlChannel] = useState('');
  const [webhookUrlForum, setWebhookUrlForum] = useState('');
  const [webhookUrlJav, setWebhookUrlJav] = useState('');
  const hasWebhooks = webhookUrlChannel && webhookUrlForum && webhookUrlJav;

  const updatePassword = async pw => {
    try {
      if (!pw) throw 'no password';
      const message = await decryptMessage(pw, hooks);
      const { webhookUrlChannel: channel, webhookUrlForum: forum, webhookUrlJav: jav } = JSON.parse(message);
      setWebhookUrlChannel(channel);
      setWebhookUrlForum(forum);
      setWebhookUrlJav(jav);
      sessionStorage.setItem('temp', pw);
    } catch {
      showErrorToast('Password is incorrect');
    }
  };

  const openModalWithProps = async (release, e) => {
    if (!hasWebhooks && sessionStorage.getItem('temp')) await updatePassword(sessionStorage.getItem('temp'));
    setModalProps(release);
    setIsModalOpen(true);
  };

  const changeClockFormat = state => {
    store.set("is24Hr", state);
    setIs24Hr(state);
  };

  const changeDiscordState = state => {
    store.set("enableDiscord", state);
    setEnableDiscord(state);
  };

  const makers = useMemo(() => {
    return Object.entries(makersBase)
      .map(([maker, details]) => ({
        name: maker,
        hasReleases: !!releases.filter(rls => details.labels.map(l => l.toLowerCase()).includes(rls.label)).length,
      }))
      .toSorted((a, b) => {
        if (a.hasReleases < b.hasReleases) return 1;
        if (a.hasReleases > b.hasReleases) return -1;
        return (a.name < b.name) ? -1 : (b.name < a.name) ? 1 : 0;
      });
  }, [makersBase, releases]);

  const reset = () => {
    setSelectedMaker(NO_MAKER);
    setInputText('');
    setSelectedActress('');
  };

  const updateSelectedDate = async selectedDate => {
    const { date, currentPageURL } = getCurrentPageAndDate();
    if (selectedDate === date) return;
    currentPageURL.searchParams.set('date', selectedDate);
    currentPageURL.searchParams.set('page', '1');

    const isTodayParam = currentPageURL.searchParams.get('isToday');
    if (isTodayParam) {
      currentPageURL.searchParams.delete('isToday');
      window.history.replaceState({}, "", currentPageURL.href);
    } else window.history.pushState({}, "", currentPageURL.href);

    setDate(selectedDate);
    if (![TAB_MAKER_ID, TAB_DEBUT_ID, TAB_ACTRESS_ID].includes(selectedTabRef.current)) setSelectedTab(TAB_MAKER_ID);
    try {
      setIsUpdatingReleases(true);
      reset();
      setReleases([]);

      const { response } = await fetchResponse(currentPageURL.href);
      const results = await getResults('1', response);
      setReleases(results);
    } catch (e) {
      setReleases([]);
    } finally {
      setIsUpdatingReleases(false);
    }
  };

  // update tab name
  useEffect(() => {
    if (!date) return;
    const dateString = formatDate(convertDatestringToTokyoDate(date), 'do EEEE, MMMM');
    const names = makers.filter(m => m.hasReleases).map(m => m.name).join(', ');
    document.title = names ? `${dateString} | ${names}` : dateString;
  }, [date, makers]);

  // version checker
  useEffect(() => {
    versionCheck();
  }, []);

  useEffect(() => {
    if (!calendarRef.current) return;

    const { Calendar } = VanillaCalendarPro;
    window.addEventListener('popstate', e => (window.location = e.target.location.href));

    const options = {
      inputMode: true,
      positionToInput: 'auto',
      selectedDates: [date],
      enableJumpToSelectedDate: true,
      onShow: self => {
        if (isUpdatingReleasesRef.current) self.hide();
      },
      onChangeToInput: self => {
        self.hide();
        if (!self.context.inputElement) return;
        if (self.context.selectedDates[0]) return updateSelectedDate(self.context.selectedDates[0]);
        self.context.inputElement.value = '';
      },
    };

    const vCal = new Calendar(calendarRef.current, options);

    setCalendar(vCal);

    vCal.init();
  }, [calendarRef]);

  // Auto set date to today if `isToday` queryparam is true
  useEffect(() => {
    const isToday = new URL(window.location.href).searchParams.get('isToday') === 'true';
    if (isToday && calendarRef.current) {
      const day = formatDate(currentTokyoDateTime, 'yyyy-MM-dd');
      calendarRef.current.set({ selectedDates: [day] });
      updateSelectedDate(day);
    }
  }, [calendarRef]);

  // Filter actresses based on compilation works
  useEffect(() => {
    setActresses(getActresses(releases));
    bestAndCompilationExcludeCidsPromise.then(items => {
      setActresses(getActresses(releases, items));
    });
  }, [releases]);

  useEffect(() => {
    if (actressesRef.current && selectedActress === '') actressesRef.current.value = '';
  }, [selectedActress, actressesRef.current]);

  const handleInputChange = event => {
    if (event.target.value === '') setSelectedMaker(NO_MAKER);
    setInputText(event.target.value);
  };

  useEffect(() => {
    updateFilteredReleases(releases, selectedActress, selectedTab, inputText, setFilteredReleases);
  }, [selectedTab, releases, inputText, selectedActress]);

  useEffect(() => {
    const isFullScreen = store.isTrue('isFullScreen');
    updateDmmElementVisibility(isFullScreen);
    window.scrollTo({ top: 0 });
  }, []);

  const downloadAssets = (selectedMaker, results, isDvd) => {
    const { date } = getCurrentPageAndDate();
    const dateFormatted = formatDate(date, 'yyyy-MM-dd');
    const images = results.flatMap(({ cid, cover, poster }) => {
      const sources = [{ src: cover, title: `${cid} cover.jpg` }, { src: poster, title: `${cid} poster.jpg` }];
      if (isDvd) sources.push({ src: `https://awsimgsrc.dmm.com/dig/mono/movie/${cid.replace('00', '')}/${cid.replace('00', '')}pl.jpg`, title: `${cid} cover (dvd).jpg` });
      return sources;
    });
    return imagesToZip(selectedMaker, dateFormatted, images);
  };

  const copyProducts = async products => {
    const { date } = getCurrentPageAndDate();
    const autoTranslate = store.isTrue("autoTranslate");
    const getTextForProduct = (id, url, actresses) => {
      const actressText = actresses.length ? actresses.map(ac => ac.name || ac?.jpName || '').join(', ') : '';
      return url ? `- [${id}](<${url}>) ${actressText}\n` : `- ${id} ${actressText}\n`;
    };

    const pending = products.map(async product => {
      const actresses = product.actresses.map(async ac => {
        if (ac.isTranslated || !autoTranslate) return ac;
        const result = await getActress(ac.name);
        return result || ac;
      });

      return { ...product, actresses: await Promise.all(actresses), trailer: await product.trailerPromise };
    });

    const traslatedProducts = await Promise.all(pending);
    const tokyoDate = convertDatestringToTokyoDate(date);
    const dvdDate = addDays(tokyoDate, 4);
    const text = traslatedProducts.reduce((acc, product) => acc += getTextForProduct(product.id, product.trailer, product.actresses), `**${formatDate(tokyoDate, 'd MMMM')} / ${formatDate(dvdDate, 'd MMMM')}**\n`);
    GM_setClipboard(text.trim(), "text/plain");
    showToast("Titles copied!");
  };

  const buildList = (items, isDebut) => {
    items = items === '' ? [] : items.split(',').map(l => l.trim());
    const uniqueLabels = new Set(items);
    if (!isDebut) return sortReleases(releases, uniqueLabels);
    return releases.filter(rls => uniqueLabels.has(rls.cid));
  };

  const actions = async (type, labels) => {
    const isDebut = selectedTab === 'debut';
    const list = buildList(labels, isDebut);
    const folderName = isDebut ? 'Debuts' : selectedMaker;

    console.log(list);

    if (!list.length) return showToast('No releases found for the current labels set');

    try {
      setDisabled(true);
      if (type === 'trailers') await copyProducts(list);
      if (type === 'assets') await downloadAssets(folderName, list);
      if (type === 'assetsAndDvd') await downloadAssets(folderName, list, true);
    } finally {
      setDisabled(false);
    }
  };

  const onMakerClick = async maker => {
    if (isLoadingLabels) return;
    if (selectedMaker === maker) return reset();

    const currentLabels = makersBase[maker].labels.map(t => t.toLowerCase());
    let toast = null;

    try {
      if (!store.isTrue("searchForNewLabels")) return;

      setIsLoadingLabels(true);

      toast = showToast({ text: `Finding new labels for ${maker}...`, duration: 0 });
      const { response } = await fetchResponse(`https://video.dmm.co.jp/av/list/?maker=${MAKERS[maker].id}&sort=release_date&media_type=2d`, { headers });
      const items = await extractTitlesFromDmm(response);
      const labels = items.map(i => i.label).filter(lbl => !EXCLUDE_LABELS.has(lbl));
      currentLabels.push(...labels);
      const updatedMakerDetails = { ...makersBase[maker], labels: [...new Set(currentLabels.map(l => l.toUpperCase()))] };
      setMakersBase(prev => ({ ...prev, [maker]: updatedMakerDetails }));
    } catch (e) {
      console.log(e);
    } finally {
      setInputText([...new Set(currentLabels)].map(t => t.toLowerCase()).join(','));
      setSelectedMaker(maker);
      setIsLoadingLabels(false);
      if (toast) toast.hideToast();
    }
  };

  const tabChange = tabName => {
    setSelectedTab(tabName);
    reset();
  };

  const loadDebuts = async () => {
    const toast = showToast({ text: 'Fetching debuts...', duration: 0 });
    try {
      setIsLoadingLabels(true);
      const { response } = await fetchResponse(`https://video.dmm.co.jp/av/list/?genre=6006&sort=release_date`, { headers });
      const items = await extractTitlesFromDmm(response);
      const ids = new Set(items.map(i => i.cid));
      const newDebuts = releases.reduce((acc, { cid }) => {
        if (ids.has(cid)) acc.push(cid);
        return acc;
      }, []);
      toast.hideToast();
      if (!newDebuts.length) return showToast('No debuts found');
      setInputText(newDebuts.join(','));
    } catch (e) {
      console.log(e);
      toast.hideToast();
    } finally {
      setIsLoadingLabels(false);
    }
  };

  const openLightbox = useCallback(async ({ cid, poster, cover, gallery, trailerPromise }) => {
    const trailer = await trailerPromise;
    const sources = [];
    if (trailer) sources.push({ src: trailer, videoAutoplay: false, thumb: cover });
    if (poster) sources.push({ src: poster }, { src: cover });
    if (gallery.length) gallery.forEach(src => sources.push({ src }));

    new Fancybox(
      sources,
      {
        backdropClick: false,
        Thumbs: { type: "classic" },
        Toolbar: {
        display: {
          left: ["infobar"],
          middle: ["zoomIn", "zoomOut", "toggle1to1"],
          right: ["fullscreen", "download", "thumbs", "close"],
        },
      },
      },
    );
  }, []);

  const refreshReleases = async () => {
    const { currentPageURL } = getCurrentPageAndDate();
    try {
      setIsUpdatingReleases(true);
      reset();
      setReleases([]);
      if ([TAB_SCHEDULE_ID, TAB_SETTINGS_ID].includes(selectedTabRef.current)) setSelectedTab(TAB_MAKER_ID);
      const { response } = await fetchResponse(currentPageURL.href);
      const results = await getResults(currentPageURL?.searchParams?.get('page'), response);
      const withPosterHash = results.map(r => ({ ...r, poster: `${r.poster}?d=${Date.now()}` })); // cache-buster so it refreshes stale posters
      setReleases(withPosterHash);
    } catch (e) {
      setReleases([]);
    } finally {
      setIsUpdatingReleases(false);
    }
  };

  const submitToDiscord = async ({ webhookUrl, threadId, username, release, avatar_url, options }) => {
    try {
      setDiscordSubmitQueue(current => [...current, release.cid]);
      await postToDiscord({ webhookUrl, threadId, username, release, avatar_url, options });
    } finally {
      setDiscordSubmitQueue(current => [...current.filter(cid => cid !== release.cid)]);
    }
  };

  return html`
    <${Fragment}>
      <${StyledContainer} className="gradient">
        <div style=${{ display: 'flex', justifyContent: 'space-between' }}>
          <div style=${{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <${Wrap} className="m-0">
              ${TABS.map(tab => html`
                <${StyledButton} key=${tab.tabId} className="${selectedTab === tab.id ? 'selected' : ''}" onClick=${() => tabChange(tab.id)}>${tab.title}</${StyledButton}>
              `)}
            </${Wrap}>
            <${Heading} className="m-0" style=${{ display: showDateHeading ? 'block' : 'none' }}>
              Movies coming out on the <span className="calendar" ref=${calendarRef}>${formatDate(convertDatestringToTokyoDate(date), 'do EEEE, MMMM yyyy')} <${Caret} /></span>
              ${!isUpdatingReleases && html`<button onClick=${refreshReleases} title="Refresh releases" style=${{ marginLeft: '0.75rem' }}><${Refresh} /></button>`}
            </${Heading}>
          </div>
          <${Clock} is24Hr=${is24Hr} />
        </div>
      </${StyledContainer}>

      ${selectedTab === TAB_MAKER_ID && html`
        <${StyledContainer} className="gradient">
          <${Heading}>Makers</${Heading}>
          <div>
            <${Switch} ref=${null} onChange=${e => store.set("searchForNewLabels", e.target.checked)} defaultChecked=${store.isTrue("searchForNewLabels")}  label="Search for new labels" />
          </div>
          <${MakerNav} makers=${makers} selectedMaker=${selectedMaker} isLoadingLabels=${isLoadingLabels || isUpdatingReleases} onMakerClick=${onMakerClick} />
          <${ActionBar} heading='Selected labels' inputText=${inputText} isDisabled=${isUpdatingReleases || isDisabled} handleInputChange=${handleInputChange} placeholder='1stars,sone,jur,ipzz,mida' actions=${actions} />
        </${StyledContainer}>
      `}

      ${selectedTab === TAB_DEBUT_ID && html`
        <${StyledContainer} className="gradient">
          <${Heading}>Debut</${Heading}>
          <p>Debut titles are sourced from <a href="https://video.dmm.co.jp/av/list/?genre=6006&sort=release_date" target="_blank" rel="noopener noreferrer">https://video.dmm.co.jp/av/list/?genre=6006&sort=release_date</a>.</p>
          <${Wrap}>
            <${StyledButton} disabled=${isLoadingLabels || isUpdatingReleases} onClick=${loadDebuts}>Fetch debuts</${StyledButton}>
          </${Wrap}>
          <${ActionBar} heading='Selected debut codes' inputText=${inputText} isDisabled=${isUpdatingReleases || isDisabled} handleInputChange=${handleInputChange} placeholder='sone00120,1start00001,ipzz00231' actions=${actions} />
        </${StyledContainer}>
      `}

      ${selectedTab === TAB_ACTRESS_ID && html`
        <${StyledContainer} className="gradient">
          <${Heading}>Actress</${Heading}>
          <p>Actresses found in this batch</p>
          <${Select} disabled=${isUpdatingReleases} defaultOption='Select your actress' items=${actresses} ref=${actressesRef} onChange=${e => setSelectedActress(e.target.value)} />
          <${Wrap}>
            <${StyledButton} disabled=${isUpdatingReleases} onClick=${() => setSelectedActress('')}>Clear</${StyledButton}>
          </${Wrap}>
        </${StyledContainer}>
      `}

      ${selectedTab === TAB_SCHEDULE_ID && html`<${Schedule} calendarRef=${calendarRef} date=${date} updateSelectedDate=${updateSelectedDate} />`}

      ${selectedTab === TAB_PID_ID && html`<${PidTab} />`}

      ${selectedTab === TAB_SETTINGS_ID && html`<${Settings} is24Hr=${is24Hr} enableDiscord=${enableDiscord} changeClockFormat=${changeClockFormat} changeDiscordState=${changeDiscordState} />`}

      ${[TAB_MAKER_ID, TAB_DEBUT_ID, TAB_ACTRESS_ID].includes(selectedTab) && html`
        <${StyledContainer} className="gradient">
          <${Heading}>Releases (${filteredReleases.length})</${Heading}>
          <div className="card-container">
            ${isUpdatingReleases ? html`<${Spinner} />` : html`${filteredReleases.map((release, index) => html`
              <${Card} ref=${ref => (releasesRef.current[index] = ref)} key=${release.poster} ...${release} openLightbox=${() => openLightbox(release)}>
                ${enableDiscord && html`<${StyledButton} disabled=${discordSubmitQueue.includes(release.cid)} className='small' style=${{ marginTop: '0.5rem' }} onClick=${(e) => openModalWithProps(release, e)}>Discord</${StyledButton}>`}
              </${Card}>
            `)}`}
          </div>
        </${StyledContainer}>
      `}

      <${Modal} title=${modalProps.id} isOpen=${isModalOpen} onClose=${() => setIsModalOpen(false)}>
        <${Discord}
          release=${modalProps}
          submitToDiscord=${submitToDiscord}
          discordSubmitQueue=${discordSubmitQueue}
          updatePassword=${updatePassword}
          webhookUrlChannel=${webhookUrlChannel}
          webhookUrlForum=${webhookUrlForum}
          webhookUrlJav=${webhookUrlJav}
        />
      </${Modal}>

      <${ScrollToTop} />
    </${Fragment}>
  `;
};

const RANDOM_POKEMON = 'Random Pokemon';
const profiles = [
  { username: 'fish_taku', avatar_url: 'https://i.imgur.com/MWuSprC.png' },
  { username: 'poke', avatar_url: 'https://i.imgur.com/GBdeG2k.png' },
  { username: 'Clippy', avatar_url: 'https://i.imgur.com/NsVcOmT.png' },
  { username: 'Hyper Zecter', avatar_url: 'https://i.imgur.com/Ilhbomo.png' },
  { username: RANDOM_POKEMON, avatar_url: '' },
];

const Discord = ({ webhookUrlChannel, webhookUrlForum, webhookUrlJav, updatePassword, release, submitToDiscord, discordSubmitQueue }) => {
  const [profile, setProfile] = useState(profiles.find(p => p.username === store.get('discordProfile')) || profiles[0]);
  const [thread, setThread] = useState(null);
  const [customThreadId, setCustomThreadId] = useState('');
  const inputRef = useRef(null);
  const threads = useMemo(() => THREAD_IDS.toSorted((a, b) => (a.name < b.name) ? -1 : (b.name < a.name) ? 1 : 0), []);
  const hasButtons = thread?.name || webhookUrlChannel || webhookUrlJav;
  const isLoading = discordSubmitQueue.includes(release.cid);
  const AV_DEBUT_ID = '1197473543169003520';
  const threadId = customThreadId || thread?.id;

  useEffect(() => {
    const defaultThread = threads.find(thread => thread.name === release.actressesByName[0]);
    if (defaultThread) setThread({ ...defaultThread });
  }, []);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef.current]);

  const updateThread = (name) => {
    const thread = threads.find(thread => thread.name === name);
    if (thread) {
      setCustomThreadId('');
      setThread({ ...thread });
    }
  };

  const updateProfile = username => {
    store.set('discordProfile', username);
    const profile = profiles.find(p => p.username === username);
    if (profile) setProfile({ ...profile });
  };

  const getPokemon = async profile => {
    if (profile.username !== RANDOM_POKEMON) return profile;
    try {
      const random = Math.floor(Math.random() * 100 + 1);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`);
      const { name: username } = await response.json();
      return { username, avatar_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${random}.png` };
    } catch {
      return profile;
    }
  };

  const submit = async ({ url, threadId, profile, isImageOnly, isTrailerOnly }) => {
    const notBoth = !isImageOnly && !isTrailerOnly;
    const content = notBoth ? '' : isImageOnly ? `${release.id} images` : `${release.id} trailer`;
    const options = { includeImages: !isTrailerOnly, includeTrailer: !isImageOnly, content };
    const { username, avatar_url } = await getPokemon(profile);
    submitToDiscord({
      webhookUrl: url,
      threadId,
      username,
      release,
      avatar_url,
      options,
    });
  };

  const handleKeyDown = e => {
    if (e.key !== 'Enter' || !e.target.value) return;
    updatePassword(e.target.value);
  };

  const [selectedView, setSelectedView] = useState('forum'); // 'test'
  const isForumView = selectedView === 'forum';
  const isTestView = selectedView === 'test';
  const isDebutView = selectedView === 'debut';

  if (!webhookUrlForum && !webhookUrlChannel && !webhookUrlJav) {
    return html`
      <${Fragment}>
        <p>Password</p>
        <${Input} ref=${inputRef} placeholder="Password" onKeyDown=${e => handleKeyDown(e)} />
        <${StyledButton} style=${{marginTop: '1.5rem' }} onClick=${() => updatePassword(inputRef.current.value)}>Submit</${StyledButton}>
      </${Fragment}>
    `;
  }

  return html`
    <${Fragment}>
      <p>Destination</p>
      <${Wrap} className="mt-0 mb-0">
        <${StyledButton} disabled=${isLoading || isForumView} onClick=${() => setSelectedView('forum')}>Forum</${StyledButton}>
        <${StyledButton} disabled=${isLoading || isDebutView} onClick=${() => setSelectedView('debut')}>AV Debut</${StyledButton}>
        <${StyledButton} disabled=${isLoading || isTestView} onClick=${() => setSelectedView('test')}>Test</${StyledButton}>
      </${Wrap}>

      <p className="mt-ms">Profile</p>
      <${Select} selected=${profile.username} defaultOption='Select profile' items=${profiles.map(p => p.username)} onChange=${e => updateProfile(e.target.value)} />

      ${webhookUrlForum && isForumView && html`
        <${Fragment}>
          <${Wrap} className="mt-0 mb-0">
            <div>
              <p className="mt-ms">Thread</p>
              <${Select} selected=${customThreadId ? null : thread?.name} defaultOption='Select discord thread' items=${threads.map(t => t.name)} onChange=${e => updateThread(e.target.value)} />
            </div>
            <div>
              <p className="mt-ms">Thread id</p>
               <${Input} placeholder="1320427788200575006" value=${customThreadId} onInput=${e => setCustomThreadId(e.target.value)} />
            </div>
          </${Wrap}>

          ${threadId && html`
            <p style=${{ fontSize: '12px', marginTop: '0.5rem' }}>
              Open <strong>${customThreadId || thread.name}’s</strong> thread on <a style=${{ textDecoration: 'underline' }} href=${`discord://discord.com/channels/1196376491815092265/${threadId}`}>discord</a> or <a style=${{ textDecoration: 'underline' }} href=${`https://discord.com/channels/1196376491815092265/${threadId}`} target="_blank">browser</a>
            </p>
          `}
        </${Fragment}>
      `}
      ${hasButtons && html`
        <${Wrap} className="mb-0 mt-md">
          ${isTestView && webhookUrlChannel && html`
            <${Wrap} className="mt-0 mb-0">
              <${StyledButton} disabled=${isLoading} onClick=${() => submit({ url: webhookUrlChannel, profile: profile })}>Post all</${StyledButton}>
              <${StyledButton} disabled=${isLoading} onClick=${() => submit({ url: webhookUrlChannel, profile: profile, isTrailerOnly: true })}>Trailer only</${StyledButton}>
              <${StyledButton} disabled=${isLoading} onClick=${() => submit({ url: webhookUrlChannel, profile: profile, isImageOnly: true })}>Images only</${StyledButton}>
            </${Wrap}>
          `}
          ${isDebutView && webhookUrlJav && html`
            <${Wrap} className="mt-0 mb-0">
              <${StyledButton} disabled=${isLoading} onClick=${() => submit({ url: `${webhookUrlJav}?thread_id=${AV_DEBUT_ID}`, profile: profile })}>Post all to debut</${StyledButton}>
              <${StyledButton} disabled=${isLoading} onClick=${() => submit({ url: `${webhookUrlJav}?thread_id=${AV_DEBUT_ID}`, profile: profile, isTrailerOnly: true })}>Trailer only</${StyledButton}>
              <${StyledButton} disabled=${isLoading} onClick=${() => submit({ url: `${webhookUrlJav}?thread_id=${AV_DEBUT_ID}`, profile: profile, isImageOnly: true })}>Images only</${StyledButton}>
            </${Wrap}>
          `}
          ${isForumView && webhookUrlForum && threadId && html`
            <${Wrap} className="mt-0 mb-0">
              <${StyledButton} disabled=${isLoading} onClick=${() => submit({ url: webhookUrlForum, threadId, profile: profile })}>Post all to ${customThreadId || thread?.name}</${StyledButton}>
              <${StyledButton} disabled=${isLoading} onClick=${() => submit({ url: webhookUrlForum, threadId, profile: profile, isTrailerOnly: true })}>Trailer only</${StyledButton}>
              <${StyledButton} disabled=${isLoading} onClick=${() => submit({ url: webhookUrlForum, threadId, profile: profile, isImageOnly: true })}>Images only</${StyledButton}>
            </${Wrap}>
          `}
        </${Wrap}>
      `}
    </${Fragment}>
  `;
};

const isTrailerOver100Mb = async mp4Link => {
  const response = await fetchResponse(mp4Link, { method: 'HEAD', headers });
  const isSuccess = response.status < 400;
  if (!isSuccess) return { isSuccess: false, isOverLimit: true };
  const sizeMatch = /\bcontent-length:\s*(\d+)\b/i.exec(response.responseHeaders);
  const size = sizeMatch ? Number(sizeMatch[1]) : 0;
  return { isSuccess, isOverLimit: size >= 104333312 };
};

const getTrailerUnder100Mb = async (mp4Link, qualitySuffixes = [/(4k|4ks)\.mp4/, /hhb\.mp4/, /mhb\.mp4/, /mmb\.mp4/]) => {
  const currentSuffixPattern = qualitySuffixes.find(suffix => suffix.test(mp4Link));
  const startIndex = currentSuffixPattern ? qualitySuffixes.indexOf(currentSuffixPattern) : 0;
  const suffixesToTry = qualitySuffixes.slice(startIndex);
  const baseRegex = /(4k(s)?\.mp4|hhb\.mp4|mhb\.mp4|mmb\.mp4)/;

  for (const candidateSuffixPattern of suffixesToTry) {
    let candidateSuffixString;
    if (candidateSuffixPattern.source.includes('4k|4ks')) candidateSuffixString = mp4Link.includes('4ks.mp4') ? '4ks.mp4' : '4k.mp4';
    else candidateSuffixString = candidateSuffixPattern.source.replace(/\\/g, '');

    const updatedMp4Link = mp4Link.replace(baseRegex, candidateSuffixString);
    const { isSuccess, isOverLimit } = await isTrailerOver100Mb(updatedMp4Link);
    if (isSuccess && !isOverLimit) return updatedMp4Link;
  }
  return '';
};

const getVideoBlobFromDmm = async mp4Link => {
  try {
    const link = await getTrailerUnder100Mb(mp4Link);
    if (!link) return '';
    // download mp4
    const { response: videoBlob } = await fetchResponse(link, { responseType: 'blob', headers });
    return videoBlob || '';
  } catch (e) {
    console.error(e);
    return '';
  }
};

const postToDiscord = async ({ webhookUrl, threadId, username, avatar_url, release, options }) => {
  options ??= { includeTrailer: true, includeImages: true, content: '' };
  const { includeTrailer, includeImages, content } = options;

  const toast = showToast({ text: `Posting ${release.id}. This will take some time...`, duration: 0 });
  const url = threadId ? `${webhookUrl}?thread_id=${threadId}` : webhookUrl;

  try {
    const date = new Date(release.date);
    const releaseDateText = `\n**Release date**: ${formatDate(date, "do MMMM yyyy")} (<t:${Math.floor(date.getTime() / 1000)}:R>)`;

    const images = includeImages ? [release.poster, release.cover].map(async url => {
      if (!url) return '';
      try {
        const { response } = await fetchResponse(url, { responseType: 'blob', headers });
        return response;
      } catch {
        return '';
      }
    }) : [null, null];

    const [poster, cover, trailer] = await Promise.all([
      ...images,
      includeTrailer ? getVideoBlobFromDmm(await release.trailerPromise) : null,
    ]);

    const payload = { username, avatar_url, content: content ? options.content : `# [${release.id}](<${release.url}>)${releaseDateText}` };

    if (includeTrailer) {
      if (trailer) {
        const trailerBody = new FormData();
        trailerBody.append('payload_json', JSON.stringify(payload));
        trailerBody.append('files[0]', trailer, 'video.mp4');
        delete payload.content;
        const response = await fetch(url, { method: 'POST', body: trailerBody });
        if (response.ok) console.log(`${release.id} trailer has been posted`);
        else throw(`${release.id} failed to upload`);
      } else if (!includeImages) throw(`${release.id} trailer failed to upload`);
    }

    if (poster && cover && includeImages) {
      const imagesBody = new FormData();
      imagesBody.append('payload_json', JSON.stringify(payload));
      imagesBody.append('files[0]', poster, 'poster.jpg');
      imagesBody.append('files[1]', cover, 'cover.jpg');

      const response = await fetch(url, { method: 'POST', body: imagesBody });
      if (response.ok) console.log(`${release.id} images have been posted`);
      else throw(`${release.id} images failed to upload`);
    }

    showToast({ text: `${release.id} has been posted`, style: { fontFamily: "Open Sans", background: "#06402B" } });
  } catch (error) {
    console.error(error);
    showErrorToast(`Failed to post ${release.id}`);
  } finally {
    toast.hideToast();
  }
};

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  const handleOverlayClick = e => {
    if (e.target.classList.contains('modal-overlay')) onClose();
  };

  return html`
    <${ModalStyle} className="modal-overlay" onClick=${handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h1 className="modal-title">${title}</h1>
          <button className="modal-close" onClick=${onClose}>×</button>
        </div>
        <${Hr} style=${{ margin: '1rem 0' }} />
        <div className="modal-content">${children}</div>
      </div>
    </${ModalStyle}>
  `;
};

const ModalStyle = styled.div`
  font-family: 'Open Sans';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .modal {
    color: #FFFFFF;
    background-color: #485461;
    background-image: linear-gradient(315deg, #485461 0%, #28313b 74%);
    border-radius: 5px;
    max-width: 80%;
    width: 100%;
    position: relative;
    padding: 20px 20px 44px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
  }

  .modal-title {
    font-size: 24px;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #ffffff;
  }

  .modal-content p {
    margin-bottom: 0.5rem;
  }
`;

const Schedule = ({ calendarRef, date, updateSelectedDate }) => {
  const goToDay = day => {
    calendarRef.current.set({ selectedDates: [day] });
    updateSelectedDate(day);
  };

  const getScheduleDaySuffix = tuesday => {
    const tokyoTuesday = convertDatestringToTokyoDate(tuesday);
    if (isSameDay(currentTokyoDateTime, tokyoTuesday)) return ' (today)';
    if (isSameDay(tokyoTuesday, nextTuesday(currentTokyoDateTime))) return ' (upcoming)';
    return '';
  };

  return html`
    <${StyledContainer} className="gradient">
      <${Heading}>Schedule</${Heading}>
      <p>Tuesday announcement days. Clicking on the button will fetch the corresponding Friday (LEFT) or Saturday (RIGHT) release day.</p>
      <${Hr} />
      ${Object.entries(scheduleDates()).map(([, days], index) => html`
        <${Fragment}>
          ${index !== 0 && html`<${Hr} />`}
          <${Heading3}>${days[0].month}</${Heading3}>
          <${Wrap} className="mt-sm">
            ${days.map(day => html`
              <div key=${day.tuesday}>
                <p>${day.tuesdayShortText}${getScheduleDaySuffix(day.tuesday) && html`<strong>${getScheduleDaySuffix(day.tuesday)}</strong>`}</p>
                <${StyledButton} title="Friday" style=${{ width: '195px' }} disabled=${day.friday === date} key=${day.tuesday} onClick=${() => goToDay(day.friday)}>${day.fridayText} (Fri)</${StyledButton}>
                <${StyledButton} title="Saturday" style=${{ width: '195px' }} disabled=${day.saturday === date} key=${day.saturday} onClick=${() => goToDay(day.saturday)}>${day.saturdayText} (Sat)</${StyledButton}>
              </div>
            `)}
          </${Wrap}>
        </${Fragment}>
      `)}
    </${StyledContainer}>
  `;
};

const Settings = (props) => {
  const { is24Hr, changeClockFormat, enableDiscord, changeDiscordState } = props;
  return html`
    <${StyledContainer} className="gradient">
      <${Heading}>Settings</${Heading}>
      <div class="mb">
        <${Switch}
          ref=${null}
          onChange=${e => updateDmmElementVisibility( store.set("isFullScreen", e.target.checked) )}
          defaultChecked=${store.isTrue("isFullScreen")}
          label="Full screen mode"
          tooltip='Hide all dmm related elements from the page. (header, navigation, footer, etc)'
        />
      </div>
      <div class="mb">
        <${Switch}
          ref=${null}
          onChange=${e => store.set("autoTranslate", e.target.checked)}
          defaultChecked=${store.isTrue("autoTranslate")}
          label="Translate unmapped actresses on trailer copy"
          tooltip='Try to translate any unmapped actress names to English using japantube.video. If it fails, it will fallback to the Japanese name'
        />
      </div>
      <div class="mb">
        <${Switch}
          ref=${null}
          onChange=${e => changeClockFormat(e.target.checked)}
          defaultChecked=${is24Hr}
          label="Use worst time format"
          tooltip='Switch to 24-hour clock format'
        />
      </div>
      <div class="mb">
        <${Switch}
          ref=${null}
          onChange=${e => store.set("disableVersionCheck", e.target.checked)}
          defaultChecked=${store.isTrue("disableVersionCheck")}
          label="Disable version check"
          tooltip='Script will not check if there is an updated version on startup. (stops update banner popup)'
        />
      </div>
      <div>
        <${Switch}
          ref=${null}
          onChange=${e => changeDiscordState(e.target.checked)}
          defaultChecked=${enableDiscord}
          label="Show discord post button"
          tooltip='Show discord post button on cards'
        />
      </div>
    </${StyledContainer}>
  `;
};

const createTranslator = translation => {
  const translator = Object.entries(translation)
    .flatMap(([key, value]) => {
      if (!key.includes('（')) return [[key, value]];
      const [firstKey, secondKey] = key.split('（');
      return [[firstKey, value], [secondKey.replace('）', ''), value]];
    })
    .sort((a, b) => b[0].length - a[0].length);

  return str => {
    const { title, actresses } = translator.reduce((acc, [key, value]) => {
      const regex = new RegExp(key, 'g');
      if (acc.title.match(regex)) acc.actresses.add(value);
      acc.title = acc.title.replace(regex, value);
      return acc;
    }, { title: str, actresses: new Set() });

    return { title, actresses: [...actresses] };
  };
};

const getUpcomingReleases = (() => {
  const cache = new Map();
  let translator = null;

  const getTitlesToFetch = (label, codes, maxLookahead = 150, maxMakerLookbehind = 150) => {
    const maxLimit = 999;
    const latest = codes.length > 0 ? Math.max(...codes) : 0;
    const oldest = codes.length > 0 ? Math.min(...codes) : 0;
    const exceedsMax = (latest + maxLookahead) > maxLimit;
    const getFutureNumbers = exceedsMax ? maxLimit : latest + maxLookahead;
    const trueMaxLookahead = exceedsMax ? Math.max(0,(latest + maxLookahead) - maxLimit) : maxLookahead;
    const baseNumbers = Array.from({ length: getFutureNumbers }, (_, idx) => idx + 1);
    return baseNumbers
      .filter(n => !codes.includes(n) && (n > oldest || n <= 120)) // 120 is the dmm page view amount
      .map(id => {
        const paddedId = String(id).padStart(3, '0');
        return {
          label,
          id: paddedId,
          cid: `${label}${paddedId}`,
        };
      })
      .slice(-trueMaxLookahead - maxMakerLookbehind);
  };

  return async label => {
    if (cache.has(label)) return cache.get(label);
    const url = `https://video.dmm.co.jp/av/list/?key=${label}&sort=release_date&limit=120&page=1`;
    const { response } = await fetchResponse(url);
    const results = await getResults('1', response, url);
    const getCid = cid => Number(/\d+$/.exec(cid)).toString().substring(0, 3);
    const codes = results.filter(r => r.label === label).map(r => Number(getCid(r.cid))).toSorted();
    const titlesToFetch = getTitlesToFetch(label, codes);
    const titles = await Promise.all(titlesToFetch.map(async ({ label, id, cid }) => {
      const url = `https://www.dmm.co.jp/mono/dmp/-/productlist/=/pid=${cid}/`;
      const { response, status } = await fetchResponse(url);
      if (status >= 400) return;
      const title = /\[(.+)\]/.exec(response.title)?.[1] || response.title;
      const dateEl = qsa(
        'div',
        qsa('table img', response).filter(a => a.src.includes(cid))[0]?.closest('table'),
      ).filter(div => div.innerText.includes('発売日'))?.[0];
      const date = dateEl ? dateEl.innerText?.split(' ')?.at(-1) : null;
      if (!translator) translator = createTranslator(ACTRESSES);
      const { actresses } = translator(title);
      return {
        title,
        cid,
        label,
        id: getDmmId(cid),
        url,
        date,
        actresses: actresses.map(name => ({ name })),
        poster: `https://awsimgsrc.dmm.com/dig/mono/movie/${cid}/${cid}ps.jpg`
      };
    }));

    const filtered = titles.filter(t => {
      if (!t) return false;
      const [year, day, month] = t.date.split('/');
      if (!year) return true; // ok to keep if there is no date
      return isFuture(new Date(year, day, month))
    });

    cache.set(label, filtered);
    return filtered;
  };
})();

const dates = Object.values(scheduleDates(5)).flat();
const upcomingTuesday = nextTuesday(currentTokyoDateTime);
const pidDay = dates.find(d => d.tuesday === formatDate(upcomingTuesday, 'yyyy-MM-dd'));
let pidCache = new Map(); // [label, releases]
let pidLabels = new Set();

const PidTab = () => {
  const [releasesCache, setReleasesCache] = useState(pidCache);
  const [labels, setLabels] = useState(pidLabels);
  const [isLoading, setIsLoading] = useState(false);
  const [isFindingReleases, setIsFindingReleases] = useState(false);
  const [releases, setReleases] = useState([]);
  const inputRef = useRef(null);
  const cardRefs = useRef([]);
  const spinnerRef = useRef(null);
  const [selectedMaker, setSelectedMaker] = useState({});
  const [selectedLabel, setSelectedLabel] = useState('');
  const [view, setView] = useState(''); // makers or labels
  const makers = useMemo(() => Object.entries(MAKERS).filter(([maker, details]) => details.slots.includes(pidDay?.slot)).map(([maker, details]) => ({ ...details, name: maker })), [MAKERS]);

  // Auto scroll on fetch
  useEffect(() => {
    const opts = { behavior: "smooth", block: "center" };
    if (releases.length && cardRefs.current[0]) cardRefs.current[0].scrollIntoView(opts);
    if (isFindingReleases && spinnerRef.current) spinnerRef.current.scrollIntoView(opts);
  }, [releases, isFindingReleases]);

  // Save existing values to cache
  useEffect(() => {
    return () => {
      pidCache = releasesCache;
      pidLabels = labels;
    };
  }, [releasesCache, labels]);

  const getLabels = async () => {
    try {
      setIsLoading(true);
      const urls = [previousFriday(upcomingTuesday), previousSaturday(upcomingTuesday)].map(date => `https://video.dmm.co.jp/av/list/?date=${formatDate(date, 'yyyy-MM-dd')}&page=1`);
      const promises = urls.map(async url => {
        const { response } = await fetchResponse(url);
        return getResults('1', response, url);
      });
      const releases = (await Promise.all(promises)).flat();
      const newLabels = new Set(releases.filter(r => !r.isVr && !r.label.startsWith('h_') && !r.label[0].match(/^[0-9]/)).map(i => i.label));
      setLabels(newLabels);
    } catch {
      showErrorToast('Loading labels failed. Enter labels manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyUp = e => {
    if (e.key !== 'Enter') return;
    const value = e.target.value;
    const isValid = value.match(/^[0-9a-z]+$/);
    if (!isValid) return showToast('Label pattern is invalid. Should be like sone');
    const updatedLabels = new Set([...labels, value]);
    setLabels(updatedLabels);
    inputRef.current.value = '';
  };

  const findUpcomingReleases = async label => {
    label = label.toLowerCase();
    setReleases([]);
    try {
      setIsFindingReleases(true);
      setSelectedLabel(label);
      const titles = releasesCache.get(label) || await getUpcomingReleases(label);
      setReleasesCache(existing => new Map([...existing, [label, titles]]));
      setReleases(titles);
    } finally {
      setIsFindingReleases(false);
    }
  };

  const changeView = view => {
    setView(view);
    setSelectedLabel('');
    setSelectedMaker({});
    setReleases([]);
    if (view === 'labels' && !labels.size) getLabels();
  };

  return html`
    <${StyledContainer} className="gradient">
      <${Heading}>PID search</${Heading}>
      <${Heading3}>Filter by</${Heading3}>
      <${Wrap} className="mt-sm">
        <${StyledButton} disabled=${isFindingReleases || isLoading || view === 'makers'} onClick=${() => changeView('makers')}>Upcoming Makers</${StyledButton}>
        <${StyledButton} disabled=${isFindingReleases || isLoading || view === 'labels'} onClick=${() => changeView('labels')}>Recent labels</${StyledButton}>
      </${Wrap}>

      ${view === 'makers' && html`
        <${Fragment}>
          <${Hr} />
          <${Heading3}>Makers - ${pidDay.tuesdayText}</${Heading3}>
          <${Wrap} className="mt-sm">
            ${makers.map(m => html`
              <${StyledButton} key=${m.name} disabled=${isFindingReleases || selectedMaker?.name === m.name} onClick=${() => { setSelectedMaker(m); setSelectedLabel('') }}>
                ${m.name}
              </${StyledButton}>
            `)}
          </${Wrap}>

          ${selectedMaker?.name && html`
            <${Fragment}>
              <${Hr} />
              <${Heading3}>Labels</${Heading3}>
              <${Wrap} className="mt-sm">
                ${selectedMaker.labels.map(label => html`
                  <${StyledButton} key=${label} disabled=${isFindingReleases || selectedLabel === label.toLowerCase()} onClick=${() => findUpcomingReleases(label)}>
                    ${label}${releasesCache.has(label.toLowerCase()) ? ` (${releasesCache.get(label.toLowerCase()).length})` : ''}
                  </${StyledButton}>
                `)}
              </${Wrap}>
            </${Fragment}>
          `}
        </${Fragment}>
      `}

      ${view === 'labels' && html`
        <${Fragment}>
          <${Hr} />
          <${Heading3} className="mb-sm">Labels</${Heading3}>

          ${isLoading ? html`<${Spinner} />` : html`
            <${Fragment}>
              <${Wrap} className="mt-sm">
                ${[...labels].map(label => html`
                  <${StyledButton} key=${label} disabled=${isFindingReleases || selectedLabel === label} onClick=${() => findUpcomingReleases(label)}>
                    ${label}${releasesCache.has(label) ? ` (${releasesCache.get(label).length})` : ''}
                  </${StyledButton}>
                `)}
              </${Wrap}>
              <${Input} onKeyUp=${handleKeyUp} ref=${inputRef} type="text" placeholder='Add 1 label (sone) only and then click "Enter"' />
            </${Fragment}>
          `}
       </${Fragment}>
      `}

      ${selectedLabel && html`
        <${Fragment}>
          <${Hr} />
          <${Heading3}>Upcoming releases</${Heading3}>
          <div className="card-container mt-sm">
            ${(isLoading || isFindingReleases) ? html`<${Spinner} ref=${spinnerRef} />` : html`
              ${!releases.length ? html`<p>No releases found.</p>` : html`${releases.map((release, index) => html`
                <${Card} ref=${ref => (cardRefs.current[index] = ref)} key=${release.cid} ...${release}}>
                  <p>${release.title}</p>
                </${Card}>
              `)}`}
            `}
          </div>
        </${Fragment}>
      `}
    </${StyledContainer}>
  `;
};

const MakerNav = ({ makers, selectedMaker, isLoadingLabels, onMakerClick }) => {
  return html`
    <${Wrap}>
      ${makers.map(({ name, hasReleases }) => html`
        <${StyledButton} key=${name} disabled=${isLoadingLabels} className="${selectedMaker === name ? 'selected' : ''}" onClick=${() => onMakerClick(name)}>
          ${name}${hasReleases ? ' ⭐' : ''}
        </${StyledButton}>
      `)}
    </${Wrap}>
  `;
};

const ActionBar = ({ heading, inputText, handleInputChange, placeholder, actions, isDisabled }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const tagify = new Tagify(inputRef.current, {
        originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(','),
      });
      return () => tagify.destroy();
    }
  }, [inputRef]);

  return html`
    <div>
      <${Heading} className='mT-sm'>${heading}</${Heading}>
      <${Input} pattern='^[A-Za-z0-9]{2,}$' onChange=${handleInputChange} ref=${inputRef} value=${inputText} type="text" placeholder=${placeholder} />
      <${Wrap}>
        <${StyledButton} disabled=${isDisabled} onClick=${() => actions('trailers', inputText)}>Copy Trailers</${StyledButton}>
        <${StyledButton} disabled=${isDisabled} onClick=${() => actions('assets', inputText)}>Download Assets</${StyledButton}>
        <${StyledButton} disabled=${isDisabled} onClick=${() => actions('assetsAndDvd', inputText)}>Download Assets (+DVD)</${StyledButton}>
      </${Wrap}>
    </div>
  `;
};

const Card = forwardRef((props, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const actresses = props.actresses.length > 4 ? `${props.actresses.slice(0, 4).map(a => a.name).join(', ')}...` : props.actresses.map(a => a.name).join(', ');

  const loadLightbox = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await props.openLightbox();
    } finally {
      setIsLoading(false);
    }
  };

  return html`
    <${StyledCard}>
      <button ref=${ref} disabled=${!props.openLightbox} onClick=${loadLightbox} className="card-image" data-cid=${props.cid}>
        ${isLoading && html`<${Spinner} className="is-card" />`}
        <img className=${isLoading ? 'is-loading' : ''} src=${props.poster} />
      </button>
      <span className="card-title">
        <h3 className="card-id"><strong><a href=${props.url} target="_blank">${props.id}</a></strong><sub>${props.cid}</sub></h3>
        ${props.actresses.length > 0 && (props.actresses.length > 4 ? html`<p><${Tooltip} data-tooltip=${props.actresses.map(a => a.name).join(', ')}>${actresses}</${Tooltip}></p>` : html`<p>${actresses}</p>`)}
        ${props.children}
      </span>
    </${StyledCard}>
  `;
});

const Select = forwardRef(({ items, onChange, disabled, defaultOption, selected }, ref) => {
  return html`
    <${SelectStyle}>
      <select disabled=${disabled} ref=${ref} onChange=${onChange}>
        <option value="" disabled selected=${!selected}>${defaultOption}</option>
        ${items.map(item => html`<option selected=${selected === item} key=${item} value=${item}>${item}</option>`)}
      </select>
    </${SelectStyle}>
  `;
});

const Clock = ({ is24Hr }) => {
  const [dateString, setDateString] = useState('');
  const [timeString, setTimeString] = useState('');
  const [isLocalTime, setIsLocalTime] = useState(false);
  const [offSetFromLocal, setOffSetFromLocal] = useState('');
  const localTime = Intl.DateTimeFormat().resolvedOptions().timeZone.replace('/', ', ');
  const timezoneName = useMemo(() => isLocalTime ? localTime : 'Tokyo, Japan', [isLocalTime]);

  const getHoursDifferenceFromJST = (date, tzName, isInverse = false) => {
    const diffHours = (date.getTimezoneOffset() - -540) / 60;
    if (diffHours > 0) return `(${diffHours} hours ${isInverse ? 'behind' : 'ahead of'} ${tzName})`;
    else if (diffHours < 0) return `(${Math.abs(diffHours)} hours ${isInverse ? 'ahead of' : 'behind'} ${tzName})`;
    return '';
  };

  useEffect(() => {
    const updateClock = () => {
      const date = isLocalTime ? new Date() : getCurrentTokyoDateTime();
      const hoursDiff = getHoursDifferenceFromJST(new Date(), isLocalTime ? 'Tokyo, Japan' : localTime, isLocalTime);
      setTimeString(formatDate(date, is24Hr ? 'HH:mm:ss' : 'h:mm:ss a'));
      setDateString(formatDate(date, 'EEEE, do MMMM'));
      setOffSetFromLocal(hoursDiff);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, [isLocalTime, timezoneName, is24Hr]);

  if (!dateString || !timeString) return null;

  return html`
    <div style=${{ textAlign: 'right', cursor: 'pointer' }} onClick=${() => setIsLocalTime(prev => !prev)}>
      <p style=${{ marginBottom: '0' }}>Local Time in ${timezoneName}</p>
      <p style=${{ fontSize: '1.75rem', marginBottom: '0', fontWeight: 'bold' }}>${timeString}</p>
      <p style=${{ marginBottom: '0' }}>${dateString}</p>
      ${offSetFromLocal && html`<p style=${{ marginBottom: '0', fontSize: '75%', color: '#b9b9b9', marginTop: '0.3rem' }}>${offSetFromLocal}</p>`}
    </div>
  `;
};

const SelectStyle = styled.label`
  position: relative;
  display: inline-block;
  padding: 0!important;
  margin: 0!important;

  &:before {
    content: '';
    height: 31px;
    position: absolute;
    right: 7px;
    top: 3px;
    width: 22px;
    background: #fff;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    pointer-events: none;
    display: block;
  }

   &:after {
    content: " ";
    position: absolute;
    right: 15px;
    top: 46%;
    z-index: 2;
    pointer-events: none;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6.9px 4px 0 4px;
    border-color: #aaa transparent transparent transparent;
    pointer-events: none;
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0 30px 0 10px;
    margin-bottom: 0!important;
    border: 1px solid #e0e0e0!important;
    border-radius: 3px;
    line-height: 36px;
    background: #fff;
    margin: 0 5px 5px 0;
  }
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastKnownScrollPosition, setLastKnownScrollPosition] = useState(0);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(window.scrollY);
  const [style, setStyle] = useState({});

  const onScroll = () => setLastKnownScrollPosition(window.scrollY);

  useEffect(() => {
    setIsVisible(lastKnownScrollPosition === 0 ? false : lastKnownScrollPosition < previousScrollPosition);
    setPreviousScrollPosition(lastKnownScrollPosition);
  }, [lastKnownScrollPosition]);

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    isVisible ? setStyle({
      position: 'fixed',
      bottom: '2%',
      right: '2%',
      width: '65px',
      fill: '#fff',
      backgroundColor: '#5783db',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      boxShadow: '0 2px 2px 0 #0000001a,0 3px 1px -2px #0000001a,0 1px 5px 0 #0003',
      zIndex: '3',
    }) : setStyle({ display: 'none' });
  }, [isVisible]);

  return html`
    <button style=${style} onClick=${() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <svg height="24" viewBox="0 0 24 24" width="24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M7 14l5-5 5 5z"/>
      </svg>
    </button>
  `;
};

const Tooltip = styled.span`
  font-family: 'Open Sans';

  &[data-tooltip] {
    position: relative;
    border-bottom: 1px dashed #d2d2d2;
    cursor: help
  }

  &[data-tooltip]::after {
    color: #fff;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    content: attr(data-tooltip);
    left: 0;
    top: calc(100% + 10px);
    border-radius: 3px;
    box-shadow: 0 0 5px 2px rgba(100, 100, 100, 0.6);
    background-color: #485461;
    background-image: linear-gradient(315deg, #485461 0%, #28313b 74%);
    z-index: 10;
    padding: 1rem;
    width: 300px;
    transform: translateY(-20px);
    transition: all 150ms cubic-bezier(.25, .8, .25, 1);
  }

  &.light[data-tooltip]::after {
    color: #fff;
    background-color: #484848;
    background-image: none;
    box-shadow: 0 0 5px 2px rgba(55, 55, 55, 0.3);
  }

  &[data-tooltip]:hover::after {
    opacity: 1;
    transform: translateY(0);
    transition-duration: 300ms;
  }
`;

const Caret = () => html`
  <svg width="26px" height="26px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.00003 8.5C6.59557 8.5 6.23093 8.74364 6.07615 9.11732C5.92137 9.49099 6.00692 9.92111 6.29292 10.2071L11.2929 15.2071C11.6834 15.5976 12.3166 15.5976 12.7071 15.2071L17.7071 10.2071C17.9931 9.92111 18.0787 9.49099 17.9239 9.11732C17.7691 8.74364 17.4045 8.5 17 8.5H7.00003Z" fill="#fff"/>
  </svg>
`;

const Refresh = () => html`
  <svg fill="#fff" height="22px" width="22px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 367.136 367.136" xml:space="preserve">
    <path d="M336.554,86.871c-11.975-18.584-27.145-34.707-44.706-47.731L330.801,0H217.436v113.91L270.4,60.691  c40.142,28.131,65.042,74.724,65.042,124.571c0,83.744-68.13,151.874-151.874,151.874S31.694,269.005,31.694,185.262  c0-58.641,32.781-111.009,85.551-136.669l-13.119-26.979C73.885,36.318,48.315,59.1,30.182,87.494  c-18.637,29.184-28.488,62.991-28.488,97.768c0,100.286,81.588,181.874,181.874,181.874s181.874-81.588,181.874-181.874  C365.442,150.223,355.453,116.201,336.554,86.871z"/>
  </svg>
`;

const Spinner = styled.span`
  width: 48px;
  height: 48px;
  border: 5px solid #FFF;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  &.is-card {
    position: absolute;
    left: 40%;
    top: 30%;
    z-index: 5;
  }


  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Hr = styled.hr`
  height: 1px;
  color: #fff;
  background: #6c6c6c;
  font-size: 0;
  border: 0;
  margin: 2rem 0;
`;

const Heading3 = styled.h3`
  font-family: 'Open Sans';
  font-size: 20px;

  &.mb-sm {
    margin-bottom: 1rem;
  }
`;

const Heading = styled.h2`
  font-family: 'Open Sans';
  font-size: 24px;
  margin-bottom: 1.5rem;
  display: inline-block;

  .calendar {
    cursor: pointer;
    border-bottom: 1px solid #fff;
    font-weight: 600;
  }

  &.m-0 {
    margin: 0;
  }

  &.mT-sm {
    margin-top: 1rem;
  }
`;

const Wrap = styled.div`
  font-family: 'Open Sans';
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;

  &.m-0 {
    margin: 0;
  }

  &.mt-sm {
    margin-top: 1rem;
  }

  &.mb-sm {
    margin-bottom: 1rem;
  }
`;

const Input = styled.input`
  font-family: 'Open Sans';
  background: white;
  width: 100%;
  color: #333;
  padding: 0.5rem;
  font-size: 16px;
  border-radius: 0.25rem;
`;

const StyledContainer = styled.div`
  font-family: 'Open Sans';
  background-color: #444;
  padding: 1.5rem;
  margin: 0 0 1rem;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  color: #FFFFFF;
  border-radius: .35rem;

  .mb {
    margin-bottom: 1rem;
  }

  &.gradient {
    background-color: #485461;
    background-image: linear-gradient(315deg, #485461 0%, #28313b 74%);
  }

  .card-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1.5rem;
    row-gap: 1.5rem;
    font-family: 'Open Sans';

    &.mt-sm {
      margin-top: 1rem;
    }
  }

  @media (min-width: 1300px) {
    .card-container { grid-template-columns: repeat(4, 1fr); }
  }

  @media (min-width: 1450px) {
    .card-container { grid-template-columns: repeat(5, 1fr); }
  }

  a {
    text-decoration: underline;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.3;
  }
`;

const StyledButton = styled.button`
  font-family: 'Open Sans';
  margin: 0 1rem 0 0;
  text-decoration: none;
  color: #fff;
  background-color: #5783db;
  text-align: center;
  letter-spacing: .5px;
  transition: background-color .2s ease-out;
  cursor: pointer;
  font-size: 14px;
  outline: 0;
  border: none;
  border-radius: 2px;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  padding: 0 16px;
  text-transform: uppercase;
  vertical-align: middle;
  box-shadow: 0 2px 2px 0 #0000001a,0 3px 1px -2px #0000001a,0 1px 5px 0 #0003;

  &.small {
    font-size: 12px;
    padding: 5px 10px;
    height: auto;
    line-height: 1rem;
    letter-spacing: 0;
  }

  &.selected {
    background-color: grey;
  }

  :disabled {
    background-color: grey;
  }
`;

const S = forwardRef(
  ({ className, label, defaultChecked, onChange, tooltip }, ref) => html`
    <label className=${className}>
      <input className="toggle-checkbox" type="checkbox" onChange=${onChange || (() => {})} defaultChecked=${defaultChecked} ref=${ref} />
      <div className="toggle-switch"></div>
      ${tooltip ? html`<span className="toggle-label"><${Tooltip} className='light' data-tooltip=${tooltip}>${label}</${Tooltip}></span>` : html`<span className="toggle-label">${label}</span>`}
    </label>`
);

const Switch = styled(S)`
  font-family: 'Open Sans';
  margin-top: 0;
  cursor: pointer!important;
  display: inline-block!important;
  padding: 0!important;

  .toggle-switch {
    display: inline-block;
    background: #ccc;
    border-radius: 16px;
    width: 58px;
    height: 32px;
    position: relative;
    vertical-align: middle;
    transition: background 0.25s;
  }

  .toggle-switch:before, .toggle-switch:after {
    content: "";
  }

  .toggle-switch:before {
    display: block;
    background: linear-gradient(to bottom, #fff 0%, #eee 100%);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    width: 24px;
    height: 24px;
    position: absolute;
    top: 4px;
    left: 4px;
    transition: left 0.25s;
  }

  .toggle:hover .toggle-switch:before {
    background: linear-gradient(to bottom, #fff 0%, #fff 100%);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  }

  .toggle-checkbox:checked + .toggle-switch {
    background: #56c080;
  }

  .toggle-checkbox:checked + .toggle-switch:before {
    left: 30px;
  }

  .toggle-checkbox {
    position: absolute;
    visibility: hidden;
  }

  .toggle-label {
    margin-left: 1rem;
    position: relative;
    top: 2px;
    color: #FFF!important;
  }
`;

const StyledCard = styled.div`
  font-family: 'Open Sans';
  width: 100%;
  position: relative;
  margin: 0;
  background-color: #fff;
  -webkit-transition: -webkit-box-shadow 0.25s;
  transition: -webkit-box-shadow 0.25s;
  transition: box-shadow 0.25s;
  transition: box-shadow 0.25s, -webkit-box-shadow 0.25s;
  border-radius: 2px;
  -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);

  .card-id {
    font-size: 16px;
  }

  sub {
    margin-left: 0.25rem;
    color: rgb(185, 185, 185);
    bottom: 0;
  }

  .card-image {
    position: relative;
    display: block;
    width: 100%;
  }

  .card-image img {
    border-style: none;
    display: block;
    border-radius: 2px 2px 0 0;
    position: relative;
    width: 100%;
    object-fit: cover;
    object-position: 50% 0;
    aspect-ratio: 0.701007326;

    &.is-loading {
      filter: brightness(50%);
    }
  }

  .card-title {
    color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100%;
    padding: 1rem;
    background-color: #202020f7;
    font-size: 13px;
    line-height: 1.3;

    p {
      margin: 0.5rem 0 0;
    }
  }

  .card-content {
    padding: 24px;
    border-radius: 0 0 2px 2px;
    word-break: break-word;
  }
`;

const generateUtilityClasses = ['mb', 'mt'].reduce((styles, className) => {
  const sizes = [{ prefix: '0', size: '0' }, { prefix: 'sm', size: '12px' }, { prefix: 'ms', size: '16px' }, { prefix: 'md', size: '24px' }, { prefix: 'lg', size: '32px' }];
  const id = { mb: 'margin-bottom', mt: 'margin-top' };
  const style = sizes.map(s => `.${className}-${s.prefix} { ${id[className]}: ${s.size}!important; }`).join('\n');
  return styles += `${style}\n`;
}, '');

(() => {
  const openSans = GM_getResourceText("OPENSANS_CSS");
  const toast_css = GM_getResourceText("TOAST_CSS");
  const fancybox_css = GM_getResourceText("FANCYBOX_CSS");
  const cal_css = GM_getResourceText("CAL_CSS");
  const tag_css = GM_getResourceText("TAG_CSS");
  GM_addStyle(cal_css);
  GM_addStyle(fancybox_css);
  GM_addStyle(toast_css);
  GM_addStyle(openSans);
  GM_addStyle(tag_css);
  GM_addStyle(generateUtilityClasses);
})();


// Represents which week the tuesday falls under, i.e. T1 is the first Tuesday of the month
const [T1, T2, T3, T4, T5] = [0, 1, 2, 3, 4];

const MAKERS = {
  "S1": {
    id: "3152",
    slots: [T2, T4],
    labels: ["SONE", "SNOS", "OFJE"],
  },
  "IDEA POCKET": {
    id: "1219",
    slots: [T2],
    labels: ["IPZZ", "IPSE", "IDBD"],
  },
  "ATTACKERS": {
    id: "1227",
    slots: [T1],
    labels: ["SAME", "ATID", "RBK", "ADN", "YUJ", "SSPD", "ATAD", "ATKD", "JBD"],
  },
  "BIBIAN": {
    id: "6524",
    slots: [T2],
    labels: ["BBAN", "LLAN", "BBSS"],
  },
  "CHIJO HEAVEN": {
    id: "5552",
    slots: [T4],
    labels: ["CJOD", "CJOB"],
  },
  "DAS": {
    id: "4641",
    slots: [T2, T4],
    labels: ["DASS", "DAZD"],
  },
  "E-BODY": {
    id: "5032",
    slots: [T3],
    labels: ["EBWH", "MKCK", "EYAN"],
  },
  "FITCH": {
    id: "6329",
    slots: [T1, T3],
    labels: ["FPRE", "MEAD", "MANX", "JUNY", "JUFE", "NIMA", "JFB", "DEAB"],
  },
  "HONNAKA": {
    id: "6304",
    slots: [T3, T4],
    labels: ["HMN", "MIH", "HNDS", "HNDB"],
  },
  "KAWAII": {
    id: "4469",
    slots: [T1],
    labels: ["CAWD", "KWBD"],
  },
  "MADONNA": {
    id: "2661",
    slots: [T2, T4],
    labels: ["ROE", "URE", "ACHJ", "JUQ", "JUR", "JUMS", "JQRE"],
  },
  "MOODYZ": {
    id: "1509",
    slots: [T1, T3],
    labels: ["MIDA", "MIDV", "MIAB", "MIFD", "MIMK", "MIKR", "MOER", "MIRD", "MNGS", "MIZD"],
  },
  "MUTEKI": {
    id: "5456",
    slots: [T1],
    labels: ["TEK"],
  },
  "M’S VIDEO GROUP": {
    id: "3784",
    slots: [T3],
    labels: ["MVSD", "MVBD"],
  },
  "OPPAI": {
    id: "5238",
    slots: [T3],
    labels: ["PPPE", "PPBD"],
  },
  "PREMIUM": {
    id: "3890",
    slots: [T3],
    labels: ["PRED", "PRST", "PRWF", "PBD"],
  },
  "ROOKIE": {
    id: "5665",
    slots: [T2],
    labels: ["RKI", "RBB"],
  },
  "SOD": {
    id: "45276",
    slots: [T1, T2, T3, T4, T5],
    labels: ["1START", "1FTAV", "1SDAB", "1SDDE", "1SDMM", "1SDNM", "1SDJS", "1SODS", "1SDAM", "1SENN"],
  },
  "TAMEIKE GORO": {
    id: "45103",
    slots: [T3],
    labels: ["MEYD", "MFYD", "MBYD"],
  },
  "WANZ": {
    id: "40006",
    slots: [T1],
    labels: ["WAAA", "BMW"],
  },
  "FAIR ＆ WAY": {
    id: "308046",
    slots: [T2],
    labels: ["FWAY"],
  },
  "AIRCONTROL": {
    id: "3255",
    slots: [T4],
    labels: ["OAE"],
  },
  "HUNTER": {
    id: "45287",
    slots: [T1, T2, T3, T4],
    labels: ["HUNTC", "HNTRZ", "HBLA", "HUBLK", "HHF", "HHKL", "HNTRS"],
  },
  "ROYAL": {
    id: "6732",
    slots: [T3, T4],
    labels: ["RROY", "ROYD"],
  },
  "BE FREE": {
    id: "5486",
    slots: [T1],
    labels: ["BF"],
  },
  "KIRA☆KIRA": {
    id: "4581",
    slots: [T3],
    labels: ["BLK"],
  },
  "FALENO": {
    id: "40488",
    slots: [],
    labels: ["1FSDSS", "1MGOLD", "1FNS", "1FSFST"],
  },
  "DAHLIA": {
    id: "300586",
    slots: [],
    labels: ["1DLDSS"],
  },
  "KAGUYAHIMEPT/MOUSOUZOKU": {
    id: "6671",
    slots: [T1, T2, T3, T4, T5],
    labels: ["KPIE", "MKON", "MASM", "BABM", "KHIP", "FKRU"],
  },
  "YAMA TO SORA": {
    id: "6492",
    slots: [T1],
    labels: ["SORA", "SOAN", "YMSR"],
  },
  "DEEPS": {
    id: "40003",
    slots: [T1, T3],
    labels: ["DVRT", "DVMM", "DVEH"],
  },
  "TEPPAN": {
    id: "40003",
    slots: [T4],
    labels: ["TPPN"],
  },
  "NANPA JAPAN": {
    id: "6510",
    slots: [T1],
    labels: ["NPJS"],
  },
  "LUNATICS": {
    id: "6759",
    slots: [T1],
    labels: ["LULU"],
  },
  "MOMOTARO EIZO": {
    id: "40016",
    slots: [T1],
    labels: ["YMDD", "YMDS"],
  },
  "CRYSTAL EIZO": {
    id: "40035",
    slots: [T1, T2, T3, T4],
    labels: ["MADV", "MASE", "EKDV", "NITR", "CRNX", "MADM"],
  },
};

// To inline the actresses
// copy(`[\n    ${ACTRESSES_FULL.map(a => JSON.stringify(a).replace(/,/g, ', ').replace(/:/g, ': ').replace(/{"/, '{ "').replace(/"}/, '" }')).join(',\n    ')}\n]`)
const ACTRESSES_FULL = [
  { "jpName": "愛那あい", "name": "Ai Aina" },
  { "jpName": "本郷愛", "name": "Ai Hongo", "threadId": "1197470649749344316" },
  { "jpName": "星奈あい", "name": "Ai Hoshina" },
  { "jpName": "叶愛", "name": "Ai Kano", "threadId": "1198739801336193224" },
  { "jpName": "北岡愛", "name": "Ai Kitaoka" },
  { "jpName": "向井藍", "name": "Ai Mukai", "threadId": "1216671247136456775" },
  { "jpName": "佐山愛", "name": "Ai Sayama", "threadId": "1197565394404257884" },
  { "jpName": "吉野愛衣", "name": "Ai Yoshino" },
  { "jpName": "柚希あい", "name": "Ai Yuuki" },
  { "jpName": "AIKA", "name": "AIKA", "threadId": "1245473408943263844" },
  { "jpName": "夏目藍果", "name": "Aika Natsume" },
  { "jpName": "進藤愛果", "name": "Aika Shindou" },
  { "jpName": "宇佐木あいか", "name": "Aika Usagi" },
  { "jpName": "夢乃あいか", "name": "Aika Yumeno", "threadId": "1217126242890027120" },
  { "jpName": "吉川あいみ", "name": "Aimi Yoshikawa", "threadId": "1208072358821101608" },
  { "jpName": "侑李あいみ", "name": "Aimi Yuuri" },
  { "jpName": "北島愛菜", "name": "Aina Kitajima" },
  { "jpName": "並木あいな", "name": "Aina Namiki" },
  { "jpName": "蒼山愛奈", "name": "Aina Aoyama", "threadId": "1201480212169379850"  },
  { "jpName": "椿あいの", "name": "Aino Tsubaki" },
  { "jpName": "穂花あいり", "name": "Airi Honoka" },
  { "jpName": "市瀬あいり", "name": "Airi Ichise", "threadId": "1429852858056183951" },
  { "jpName": "希島あいり", "name": "Airi Kijima", "threadId": "1198750918821281862" },
  { "jpName": "渚あいり", "name": "Airi Nagisa", "threadId": "1211875343808335913" },
  { "jpName": "さとう愛理", "name": "Airi Satou" },
  { "jpName": "鈴村あいり", "name": "Airi Suzumura", "threadId": "1197471722098659438" },
  { "jpName": "相羽愛沙", "name": "Aisa Aiba" },
  { "jpName": "悠月アイシャ", "name": "Aisha Yuzuki" },
  { "jpName": "美谷朱音（美谷朱里）", "name": "Akane Mitani", "threadId": "1197868762351816754" },
  { "jpName": "東あかり", "name": "Akari Azuma" },
  { "jpName": "花里アカリ", "name": "Akari Hanazato" },
  { "jpName": "松永あかり", "name": "Akari Matsunaga", "threadId": "1356647639776493821" },
  { "jpName": "皆瀬あかり", "name": "Akari Minase", "threadId": "1200937070017908806" },
  { "jpName": "森本あかり", "name": "Akari Morimoto", "threadId": "1214426286777172008" },
  { "jpName": "夏川あかり", "name": "Akari Natsukawa" },
  { "jpName": "根尾あかり", "name": "Akari Neo", "threadId": "1314566659897294889" },
  { "jpName": "新村あかり", "name": "Akari Niimura", "threadId": "1206583222646083655" },
  { "jpName": "Akemi Horiuchi", "name": "堀内秋美" },
  { "jpName": "青木亜樹", "name": "Aki Aoki" },
  { "jpName": "濱松愛季", "name": "Aki Hamamatsu" },
  { "jpName": "森亜秋", "name": "Aki Mori" },
  { "jpName": "佐々木あき", "name": "Aki Sasaki", "threadId": "1329081070213140501" },
  { "jpName": "佐野秋帆", "name": "Akiho Sano" },
  { "jpName": "二瓶明菜", "name": "Akina Nihei" },
  { "jpName": "木村愛心", "name": "Ako Kimura", "threadId": "1363892053762637855" },
  { "jpName": "小倉あこ", "name": "Ako Ogura" },
  { "jpName": "山崎水愛", "name": "Akua Yamazaki" },
  { "jpName": "花アリス", "name": "Alice Hana", "threadId": "1293491808399265883" },
  { "jpName": "希咲アリス", "name": "Alice Kisaki" },
  { "jpName": "七瀬アリス", "name": "Alice Nanase", "threadId": "1206592785218805780" },
  { "jpName": "乙アリス", "name": "Alice Otsu", "threadId": "1197511117229019146" },
  { "jpName": "釈アリス", "name": "Alice Shaku", "threadId": "1263852086257389598" },
  { "jpName": "悠紗ありす", "name": "Alice Yusa", "threadId": "1293491808399265883" },
  { "jpName": "菅野弥", "name": "Amane Sugano" },
  { "jpName": "野々宮あめ", "name": "Ame Nonomiya" },
  { "jpName": "白雲あめ", "name": "Ame Shirakumo", "threadId": "1340644964039921734" },
  { "jpName": "稲森あみ", "name": "Ami Inamori" },
  { "jpName": "柏木あみ", "name": "Ami Kashiwagi" },
  { "jpName": "希代あみ", "name": "Ami Kitai" },
  { "jpName": "夜空あみ", "name": "Ami Yozora" },
  { "jpName": "新名あみん", "name": "Amin Niina" },
  { "jpName": "斎藤あみり", "name": "Amiri Saito", "threadId": "1209055461064577044" },
  { "jpName": "あまつか亜夢", "name": "Amu Amatsuka" },
  { "jpName": "花宮あむ", "name": "Amu Hanamiya" },
  { "jpName": "姫森あむ", "name": "Amu Himemori", "threadId": "1460293170729455788" },
  { "jpName": "庵野杏", "name": "An Anno" },
  { "jpName": "あんづ杏", "name": "An Anzu", "threadId": "1313316011755311216" },
  { "jpName": "伊藤杏", "name": "An Itou" },
  { "jpName": "小松杏", "name": "An Komatsu" },
  { "jpName": "樟葉杏", "name": "An Kuzuha", "threadId": "1209355881150550027" },
  { "jpName": "美織あん", "name": "An Miori", "threadId": "1381664732666265600" },
  { "jpName": "蜜美杏", "name": "An Mitsumi" },
  { "jpName": "野宮あん", "name": "An Nomiya", "threadId": "1290471165319581716" },
  { "jpName": "篠原杏", "name": "An Shinohara" },
  { "jpName": "アンジェ", "name": "Anje" },
  { "jpName": "あかね杏珠", "name": "Anju Akane" },
  { "jpName": "アンナ", "name": "Anna" },
  { "jpName": "花柳杏奈", "name": "Anna Hanayagi" },
  { "jpName": "加美杏奈", "name": "Anna Kami", "threadId": "1209618867538624572" },
  { "jpName": "満島アンナ", "name": "Anna Mitsushima" },
  { "jpName": "山浦杏奈", "name": "Anna Yamaura", "threadId": "1353393115058143382" },
  { "jpName": "実田あのん", "name": "Anon Mita" },
  { "jpName": "並木杏梨", "name": "Anri Namiki" },
  { "jpName": "香川あんず", "name": "Anzu Kagawa", "threadId": "1457759580976320594" },
  { "jpName": "海老咲あお", "name": "Ao Ebisaki", "threadId": "1204462451861495829" },
  { "jpName": "石原青", "name": "Ao Ishihara", "threadId": "1340671321306169404" },
  { "jpName": "川村晴", "name": "Ao Kawamura" },
  { "jpName": "南見蒼", "name": "Ao Minami" },
  { "jpName": "天野碧", "name": "Aoi Amano" },
  { "jpName": "青坂あおい", "name": "Aoi Aosaka" },
  { "jpName": "橋本葵", "name": "Aoi Hashimoto", "threadId": "1261348178326720584" },
  { "jpName": "一乃あおい", "name": "Aoi Ichino", "threadId": "1197562980045426688" },
  { "jpName": "一ノ瀬あおい", "name": "Aoi Ichinose", "threadId": "1247572109555925053" },
  { "jpName": "吉瀬葵", "name": "Aoi Kichise", "threadId": "1343628911522746388" },
  { "jpName": "枢木あおい", "name": "Aoi Kururugi", "threadId": "1370918952997486603" },
  { "jpName": "凪咲あおい", "name": "Aoi Nagisa" },
  { "jpName": "中城葵", "name": "Aoi Nakajou" },
  { "jpName": "翼あおい", "name": "Aoi Tsubasa" },
  { "jpName": "柚葉あおい", "name": "Aoi Yuzuha" },
  { "jpName": "望月あられ", "name": "Arare Mochizuki" },
  { "jpName": "辻芽愛里", "name": "Ari Tsujime" },
  { "jpName": "風美ありあ", "name": "Aria Kazami" },
  { "jpName": "新ありな", "name": "Arina Arata", "threadId": "1198731595289469018" },
  { "jpName": "橋本ありな", "name": "Arina Hashimoto" },
  { "jpName": "国仲ありな", "name": "Arina Kuninaka", "threadId": "1447617372151218266" },
  { "jpName": "羽生アリサ（羽生ありさ）", "name": "Arisa Hanyuu" },
  { "jpName": "糸井ありさ", "name": "Arisa Itoi" },
  { "jpName": "國森ありさ", "name": "Arisa Kunimori", "threadId": "1275293120866685018" },
  { "jpName": "美里有紗", "name": "Arisa Misato", "threadId": "1243998066890117291" },
  { "jpName": "高梨有紗", "name": "Arisa Takanashi" },
  { "jpName": "田崎アリサ", "name": "Arisa Tazaki" },
  { "jpName": "十川ありさ", "name": "Arisa Togawa", "threadId": "1243486634209579078" },
  { "jpName": "富岡ありさ", "name": "Arisa Tomioka" },
  { "jpName": "花芽ありす", "name": "Arisu Haname" },
  { "jpName": "一森ありす", "name": "Arisu Ichimori" },
  { "jpName": "玉森あろ", "name": "Aro Tamamori" },
  { "jpName": "水野朝陽", "name": "Asahi Mizuno", "threadId": "1208270182347186176" },
  { "jpName": "世良あさか", "name": "Asaka Sera" },
  { "jpName": "水端あさみ", "name": "Asami Mizuhata", "threadId": "1212376656766042124" },
  { "jpName": "あいだ飛鳥", "name": "Asuka Aida" },
  { "jpName": "釜谷明日華", "name": "Asuka Kamaya" },
  { "jpName": "桐島明日香", "name": "Asuka Kirishima" },
  { "jpName": "百瀬あすか", "name": "Asuka Momose", "threadId": "1315967539435667526" },
  { "jpName": "岡本彩", "name": "Asuka Okamoto" },
  { "jpName": "澪奈あすみ", "name": "Asumi Miona", "threadId": "1399951100794114088" },
  { "jpName": "星明日菜", "name": "Asuna Hoshi" },
  { "jpName": "河合あすな", "name": "Asuna Kawai", "threadId": "1197555859828514836" },
  { "jpName": "神木彩（月雲よる）", "name": "Aya Kamiki", "threadId": "1204087662554644551" },
  { "jpName": "小那海あや", "name": "Aya Onami", "threadId": "1215867245905842266" },
  { "jpName": "笹倉彩", "name": "Aya Sasakura", "threadId": "1353750714639319190" },
  { "jpName": "塩見彩", "name": "Aya Shiomi", "threadId": "1399882060063047720" },
  { "jpName": "月乃あや", "name": "Aya Tsukino" },
  { "jpName": "上羽絢", "name": "Aya Ueha", "threadId": "1197562767465529384" },
  { "jpName": "三雲彩葉", "name": "Ayaha Mikumo", "threadId": "1461819255262679283" },
  { "jpName": "雨宮あや花", "name": "Ayaka Amamiya" },
  { "jpName": "朝日奈肖", "name": "Ayaka Asahina", "threadId": "1450570198800400642" },
  { "jpName": "双葉あゆか", "name": "Ayaka Futaba" },
  { "jpName": "望月あやか", "name": "Ayaka Mochizuki", "threadId": "1199070573033164901" },
  { "jpName": "武藤あやか", "name": "Ayaka Muto", "threadId": "1197839194127618110" },
  { "jpName": "友田彩也香", "name": "Ayaka Tomoda", "threadId": "1199990412664918097" },
  { "jpName": "山岸あや花（山岸逢花）", "name": "Ayaka Yamagishi", "threadId": "1198477196570927197" },
  { "jpName": "井上綾子", "name": "Ayako Inoue", "threadId": "1436261460115193898" },
  { "jpName": "乃木絢愛", "name": "Ayame Nogi" },
  { "jpName": "高石あやめ", "name": "Ayame Takaishi" },
  { "jpName": "都崎あやめ", "name": "Ayame Tozaki" },
  { "jpName": "池田あやみ", "name": "Ayami Ikeda" },
  { "jpName": "森あやみ", "name": "Ayami Mori", "threadId": "1253410329929453639" },
  { "jpName": "遥あやね", "name": "Ayane Haruka", "threadId": "1241317650223599620" },
  { "jpName": "瀬崎彩音", "name": "Ayane Sezaki" },
  { "jpName": "早瀬文乃", "name": "Ayano Hayase" },
  { "jpName": "加藤あやの", "name": "Ayano Kato", "threadId": "1265180877026230424" },
  { "jpName": "安斉愛結", "name": "Ayu Anzai", "threadId": "1328559261470429194" },
  { "jpName": "加藤あゆ香", "name": "Ayuka Katou" },
  { "jpName": "有原あゆみ", "name": "Ayumi Arihara" },
  { "jpName": "夏川あゆみ", "name": "Ayumi Natsukawa" },
  { "jpName": "篠田あゆみ", "name": "Ayumi Shinoda" },
  { "jpName": "古木薊", "name": "Azami Furuki" },
  { "jpName": "天月あず", "name": "Azu Amatsuki", "threadId": "1295611603097489470" },
  { "jpName": "果波あずさ", "name": "Azusa Kanami", "threadId": "1424783976551420107" },
  { "jpName": "岬あずさ", "name": "Azusa Misaki", "threadId": "1268087359736381480" },
  { "jpName": "東雲あずさ", "name": "Azusa Shinonome", "threadId": "1251944324887744623" },
  { "jpName": "谷あづさ", "name": "Azusa Tani", "threadId": "1198963835688730664" },
  { "jpName": "金沢文子", "name": "Bunko Kanazawa" },
  { "jpName": "ちゃんよた", "name": "Chanyota", "threadId": "1254856818547757076" },
  { "jpName": "三葉ちはる", "name": "Chiharu Mitsuha", "threadId": "1206316392958140416" },
  { "jpName": "宮沢ちはる", "name": "Chiharu Miyazawa" },
  { "jpName": "宮崎千尋", "name": "Chihiro Miyazaki", "threadId": "1224734947403759706" },
  { "jpName": "桃川ちほ", "name": "Chiho Momokawa" },
  { "jpName": "市川ちこ", "name": "Chiko Ichikawa" },
  { "jpName": "桜坂ちむ", "name": "Chimu Sakurazaka" },
  { "jpName": "千咲ちな", "name": "China Chisaki", "threadId": "1407024498510921823" },
  { "jpName": "伊澤知奈", "name": "China Izawa" },
  { "jpName": "水谷千奈", "name": "China Mizutani" },
  { "jpName": "森永千波", "name": "Chinami Morinaga" },
  { "jpName": "那津乃ちなみ", "name": "Chinami Natsuno" },
  { "jpName": "ちなみん", "name": "Chinamin" },
  { "jpName": "水本千夏", "name": "Chinatsu Mizumoto" },
  { "jpName": "新山ちなつ", "name": "Chinatsu Niiyama" },
  { "jpName": "柿沢千智", "name": "Chisato Kakizawa" },
  { "jpName": "翔田千里", "name": "Chisato Shouda" },
  { "jpName": "夕季ちとせ", "name": "Chitose Yuki", "threadId": "1275305396252446793" },
  { "jpName": "杏ここ", "name": "Coco An" },
  { "jpName": "深田えいみ", "name": "Eimi Fukada", "threadId": "1201245890120261752" },
  { "jpName": "千鶴えま", "name": "Ema Chizuru" },
  { "jpName": "二葉エマ", "name": "Ema Futaba", "threadId": "1197895692593668246" },
  { "jpName": "一条えま", "name": "Ema Ichijo" },
  { "jpName": "市川愛茉", "name": "Ema Ichikawa" },
  { "jpName": "河北笑茉", "name": "Ema Kawakita" },
  { "jpName": "来実えま", "name": "Ema Kurumi" },
  { "jpName": "矢埜愛茉", "name": "Ema Yano", "threadId": "1197552831834620024" },
  { "jpName": "西野絵美", "name": "Emi Nishino", "threadId": "1197569349263835266" },
  { "jpName": "佐久間恵美", "name": "Emi Sakuma" },
  { "jpName": "遠田恵未", "name": "Emi Tooda" },
  { "jpName": "白上咲花", "name": "Emika Shirakami", "threadId": "1221846545171877938" },
  { "jpName": "河埜恵美子", "name": "Emiko Kouno" },
  { "jpName": "夕雛エミリ", "name": "Emily Yuhina", "threadId": "1206636138639400970" },
  { "jpName": "星月えむ", "name": "Emu Hoshitsuki" },
  { "jpName": "小梅えな", "name": "Ena Koume", "threadId": "1198622579074801725" },
  { "jpName": "沙月恵奈", "name": "Ena Satsuki", "threadId": "1197516529005236276" },
  { "jpName": "藤咲エレン", "name": "Eren Fujisaki" },
  { "jpName": "えれな", "name": "Erena" },
  { "jpName": "南恵令奈", "name": "Erena Minami", "threadId": "1343257734761418864" },
  { "jpName": "武田エレナ", "name": "Erena Takeda" },
  { "jpName": "晶エリー（新井エリー、大沢佑香）", "name": "Eri Akira" },
  { "jpName": "浅桜エリ", "name": "Eri Asakura" },
  { "jpName": "滝川恵理（有沢実紗）", "name": "Eri Takigawa" },
  { "jpName": "木野々葉えりか", "name": "Erika Kononoba", "threadId": "1209332807457833000" },
  { "jpName": "美澄エリカ", "name": "Erika Misumi" },
  { "jpName": "尾崎えりか", "name": "Erika Ozaki", "threadId": "1198054918624383006" },
  { "jpName": "三浦恵理子", "name": "Eriko Miura" },
  { "jpName": "麻生えりな", "name": "Erina Asou" },
  { "jpName": "橋村依里南", "name": "Erina Hashimoto" },
  { "jpName": "丘えりな", "name": "Erina Oka" },
  { "jpName": "佐藤エル", "name": "Eru Satou" },
  { "jpName": "椎菜える", "name": "Eru Shiina" },
  { "jpName": "楓ふうあ", "name": "Fua Kaede", "threadId": "1197549194358046760" },
  { "jpName": "門脇ふみか", "name": "Fumika Kadowaki" },
  { "jpName": "柏木ふみか", "name": "Fumika Kashiwagi", "threadId": "1361367362325971157" },
  { "jpName": "中山ふみか", "name": "Fumika Nakayama", "threadId": "1197529009987260517" },
  { "jpName": "沙月ふみの", "name": "Fumino Satsuki", "threadId": "1197841000744357939" },
  { "jpName": "大谷双葉", "name": "Futaba Ootani" },
  { "jpName": "渡来ふう", "name": "Fuu Watarai" },
  { "jpName": "東ふうか", "name": "Fuuka Azuma" },
  { "jpName": "南畑颯花", "name": "Fuuka Minahata" },
  { "jpName": "望月ふうか", "name": "Fuuka Mochizuki" },
  { "jpName": "岡元楓莉", "name": "Fuuri Okamoto" },
  { "jpName": "真白ふわり", "name": "Fuwari Mashiro", "threadId": "1325984454442750084" },
  { "jpName": "月乃ふわり", "name": "Fuwari Tsukino" },
  { "jpName": "雪月ふわり", "name": "Fuwari Yukitsuki" },
  { "jpName": "星冬香", "name": "Fuyuka Hoshi", "threadId": "1358871797126135819" },
  { "jpName": "春菜はな", "name": "Hana Haruna", "threadId": "1211984672259842048" },
  { "jpName": "姫咲はな", "name": "Hana Himesaki", "threadId": "1200747780919017503" },
  { "jpName": "平山羽那", "name": "Hana Hirayama" },
  { "jpName": "本城はな", "name": "Hana Honjo", "threadId": "1377812947392270396"  },
  { "jpName": "神納花", "name": "Hana Kano" },
  { "jpName": "茅野華", "name": "Hana Kayano" },
  { "jpName": "琴音華", "name": "Hana Kotone", "threadId": "1399451431743787169" },
  { "jpName": "倉木華", "name": "Hana Kuraki", "threadId": "1227536175724499014" },
  { "jpName": "黒咲華", "name": "Hana Kurosaki", "threadId": "1341555903014633482" },
  { "jpName": "楠木花菜", "name": "Hana Kusunoki" },
  { "jpName": "渋谷華", "name": "Hana Shibuya" },
  { "jpName": "青葉はる", "name": "Haru Aoba", "threadId": "1368975693354111137" },
  { "jpName": "菊池はる", "name": "Haru Kikuchi" },
  { "jpName": "湊波流", "name": "Haru Minato" },
  { "jpName": "みなと羽琉", "name": "Haru Minato" },
  { "jpName": "緒川はる", "name": "Haru Ogawa" },
  { "jpName": "柴崎はる", "name": "Haru Shibasaki", "threadId": "1228253769226260500" },
  { "jpName": "茜はるか", "name": "Haruka Akane" },
  { "jpName": "池内遥", "name": "Haruka Ikeuchi" },
  { "jpName": "北川遥", "name": "Haruka Kitagawa", "threadId": "1419708490401845308" },
  { "jpName": "光島遼花", "name": "Haruka Mitsushima" },
  { "jpName": "宮名遥", "name": "Haruka Miyana" },
  { "jpName": "南波明花", "name": "Haruka Namba", "threadId": "1432390728318976084" },
  { "jpName": "七瀬川遥", "name": "Haruka Nanasegawa", "threadId": "1447609867878797336" }, 
  { "jpName": "莉々はるか", "name": "Haruka Riri", "threadId": "1207163249087352852" },
  { "jpName": "流川はる香", "name": "Haruka Rukawa", "threadId": "1265324507082526750" },
  { "jpName": "玉井晴香", "name": "Haruka Tamai" },
  { "jpName": "常葉遥", "name": "Haruka Tsuneha" },
  { "jpName": "唐登晴海", "name": "Harumi Karato" },
  { "jpName": "河合陽菜", "name": "Haruna Kawai" },
  { "jpName": "安堂はるの", "name": "Haruno Andou" },
  { "jpName": "美月はとり", "name": "Hatori Mizuki" },
  { "jpName": "佐野葉月", "name": "Hazuki Sano" },
  { "jpName": "若宮はずき", "name": "Hazuki Wakamiya", "threadId": "1213278679388393512" },
  { "jpName": "雨宮ひびき", "name": "Hibiki Amamiya", "threadId": "1197552295597060136" },
  { "jpName": "夏目響", "name": "Hibiki Natsume", "threadId": "1197559801631232000" },
  { "jpName": "大槻ひびき", "name": "Hibiki Otsuki", "threadId": "1212528467481071747" },
  { "jpName": "七草ひいろ", "name": "Hiiro Nanakusa" },
  { "jpName": "舞原聖", "name": "Hijiri Maihara" },
  { "jpName": "与田ひかげ", "name": "Hikage Yota" },
  { "jpName": "安西ひかり", "name": "Hikari Anzai" },
  { "jpName": "青空ひかり", "name": "Hikari Aozora", "threadId": "1198290537241903114" },
  { "jpName": "梓ヒカリ", "name": "Hikari Azusa", "threadId": "1197533690692124754" },
  { "jpName": "今田光", "name": "Hikari Imada" },
  { "jpName": "妃ひかり", "name": "Hikari Kisaki", "threadId": "1372007479415804065" },
  { "jpName": "岬ひかり", "name": "Hikari Misaki", "threadId": "1358740979691028490" },
  { "jpName": "三田ひかり", "name": "Hikari Mita" },
  { "jpName": "二宮ひかり", "name": "Hikari Ninomiya", "threadId": "1203764766599020545" },
  { "jpName": "小椋ひかり", "name": "Hikari Ogura", "threadId": "1351219332922867822" },
  { "jpName": "瀬名ひかり", "name": "Hikari Sena", "threadId": "1200336877706809364" },
  { "jpName": "滝冬ひかり", "name": "Hikari Takitou" },
  { "jpName": "巴ひかり", "name": "Hikari Tomoe", "threadId": "1197529141843595404" },
  { "jpName": "吉澤ひかり", "name": "Hikari Yoshizawa" },
  { "jpName": "春風ひかる", "name": "Hikaru Harukaze" },
  { "jpName": "紺野ひかる", "name": "Hikaru Konno" },
  { "jpName": "皆月ひかる", "name": "Hikaru Minazuki", "threadId": "1217457100628951130" },
  { "jpName": "宮西ひかる", "name": "Hikaru Miyanishi", "threadId": "1197728447926108230" },
  { "jpName": "凪ひかる", "name": "Hikaru Nagi", "threadId": "1197545416921718804" },
  { "jpName": "七瀬ひかる", "name": "Hikaru Nanase" },
  { "jpName": "Himari", "name": "Himari", "threadId": "1219311816837169286" },
  { "jpName": "逢月ひまり", "name": "Himari Aizuki", "threadId": "1259100572053671936" },
  { "jpName": "朝田ひまり", "name": "Himari Asada" },
  { "jpName": "木下ひまり（花沢ひまり）", "name": "Himari Kinoshita", "threadId": "1197796232052097105" },
  { "jpName": "小坂ひまり", "name": "Himari Kosaka" },
  { "jpName": "桃瀬ひまり", "name": "Himari Momose", "threadId": "1280325947156856892" },
  { "jpName": "早坂ひめ", "name": "Hime Hayasaka", "threadId": "1197554412739104818" },
  { "jpName": "庵ひめか", "name": "Himeka Iori", "threadId": "1197532956806348801" },
  { "jpName": "茉莉ひめか", "name": "Himeka Matsuri", "threadId": "1450146519624847433" },
  { "jpName": "越智姫華", "name": "Himeka Ochi" },
  { "jpName": "浅倉媛乃", "name": "Himeno Asakura" },
  { "jpName": "葉月ひな", "name": "Hina Hazuki" },
  { "jpName": "似鳥日菜", "name": "Hina Nitori", "threadId": "1197554431105970236" },
  { "jpName": "たちばな日菜", "name": "Hina Tachibana" },
  { "jpName": "月乃ひな", "name": "Hina Tsukino" },
  { "jpName": "柳井ひな", "name": "Hina Yanai" },
  { "jpName": "由衣陽菜", "name": "Hina Yui", "threadId": "1299396579026800640" },
  { "jpName": "松井日奈子", "name": "Hinako Matsui", "threadId": "1224558330458931321" },
  { "jpName": "森日向子", "name": "Hinako Mori", "threadId": "1197971697312207008" },
  { "jpName": "瀬戸ひなこ", "name": "Hinako Seto" },
  { "jpName": "藤森ひなみ", "name": "Hinami Fujimori" },
  { "jpName": "石川陽波", "name": "Hinami Ishikawa" },
  { "jpName": "目黒ひな実", "name": "Hinami Meguro" },
  { "jpName": "成澤ひなみ", "name": "Hinami Narusawa" },
  { "jpName": "原陽菜乃", "name": "Hinano Hara" },
  { "jpName": "伊織ひなの", "name": "Hinano Iori", "threadId": "1216684153169383474" },
  { "jpName": "九野ひなの", "name": "Hinano Kuno", "threadId": "1197486760180060220" },
  { "jpName": "美木ひなの", "name": "Hinano Miki", "threadId": "1262606789661429790" },
  { "jpName": "南日菜乃", "name": "Hinano Minami" },
  { "jpName": "白雪ひなの", "name": "Hinano Shirayuki" },
  { "jpName": "橘ひなの", "name": "Hinano Tachibana" },
  { "jpName": "愛野ひなた", "name": "Hinata Aino" },
  { "jpName": "橘内ひなた", "name": "Hinata Tachibana" },
  { "jpName": "結城日向多", "name": "Hinata Yuuki" },
  { "jpName": "浦上ひのり", "name": "Hinori Uragami", "threadId": "1308230473167933602" },
  { "jpName": "Hitomi（田中瞳）", "name": "Hitomi" },
  { "jpName": "円城ひとみ", "name": "Hitomi Enjou" },
  { "jpName": "本田瞳", "name": "Hitomi Honda" },
  { "jpName": "望月瞳", "name": "Hitomi Mochizuki" },
  { "jpName": "逢坂瞳", "name": "Hitomi Ousaka" },
  { "jpName": "竹内瞳", "name": "Hitomi Takeuchi" },
  { "jpName": "伊達燈和", "name": "Hiyori Date" },
  { "jpName": "乃坂ひより", "name": "Hiyori Nozaka", "threadId": "1272715480410357834" },
  { "jpName": "吉岡ひより", "name": "Hiyori Yoshioka" },
  { "jpName": "結川ひより", "name": "Hiyori Yuikawa" },
  { "jpName": "葉月保奈美", "name": "Honami Hazuki", "threadId": "1340679176427929640" },
  { "jpName": "向井保奈美", "name": "Honami Mukai" },
  { "jpName": "高橋ほなみ", "name": "Honami Takahashi", "threadId": "1219533514454728725" },
  { "jpName": "わか菜ほの", "name": "Hono Wakana", "threadId": "1255140952855805993" },
  { "jpName": "渡部ほの", "name": "Hono Watanabe", "threadId": "1414633799467405443" },
  { "jpName": "芦名ほのか", "name": "Honoka Ashina", "threadId": "1296101666122240012" },
  { "jpName": "古川ほのか", "name": "Honoka Furukawa", "threadId": "1197551508531716236" },
  { "jpName": "七瀬ほのか", "name": "Honoka Nanase" },
  { "jpName": "斉藤帆夏", "name": "Honoka Saito", "threadId": "1231680006317539489" },
  { "jpName": "辻井ほのか", "name": "Honoka Tsujii", "threadId": "1202566023644188732" },
  { "jpName": "夢川ほの香", "name": "Honoka Yumekawa" },
  { "jpName": "森ほたる", "name": "Hotaru Mori" },
  { "jpName": "乃木蛍", "name": "Hotaru Nogi" },
  { "jpName": "葵いぶき", "name": "Ibuki Aoi", "threadId": "1197469617979920394" },
  { "jpName": "いち花", "name": "Ichika", "threadId": "1460293910843883705" },
  { "jpName": "天海一華", "name": "Ichika Amami" },
  { "jpName": "星宮一花", "name": "Ichika Hoshimiya", "threadId": "1219104768665063475" },
  { "jpName": "笠木いちか", "name": "Ichika Kasagi" },
  { "jpName": "黒川一花", "name": "Ichika Kurokawa" },
  { "jpName": "松本いちか", "name": "Ichika Matsumoto", "threadId": "1197579098332090439" },
  { "jpName": "南条いちか", "name": "Ichika Nanjo" },
  { "jpName": "瀬田一花", "name": "Ichika Seta", "threadId": "1275313261516165120" },
  { "jpName": "鳥羽いく", "name": "Iku Toba" },
  { "jpName": "白峰郁美", "name": "Ikumi Shiramine", "threadId": "1340685907690262589" },
  { "jpName": "海野いくら", "name": "Ikura Unno" },
  { "jpName": "深沢いのり", "name": "Inori Fukazawa" },
  { "jpName": "真北祈", "name": "Inori Makita" },
  { "jpName": "真野祈", "name": "Inori Mano" },
  { "jpName": "真野祈（真北祈）", "name": "Inori Mano" },
  { "jpName": "有栖いおり", "name": "Iori Arisu" },
  { "jpName": "七瀬いおり", "name": "Iori Nanase" },
  { "jpName": "佐藤衣栞", "name": "Iori Satou", "threadId": "1402182684859699280" },
  { "jpName": "橘いおり", "name": "Iori Tachibana" },
  { "jpName": "月見伊織", "name": "Iori Tsukimi" },
  { "jpName": "盛永いろは", "name": "Iroha Morinaga", "threadId": "1343627756436590592" },
  { "jpName": "夏目彩春", "name": "Iroha Natsume", "threadId": "1198737027764605069" },
  { "jpName": "若槻いろは", "name": "Iroha Wakatsuki" },
  { "jpName": "吉井彩葉", "name": "Iroha Yoshii" },
  { "jpName": "赤名いと", "name": "Ito Akana", "threadId": "1384974485421297734" },
  { "jpName": "朝陽いと", "name": "Ito Asahi", "threadId": "1275315823661027369" },
  { "jpName": "五芭", "name": "Itsuha", "threadId": "1197567259992936508" },
  { "jpName": "齋齋いつき", "name": "Itsuki Saisai", "threadId": "1403055438856982588" },
  { "jpName": "幸村泉希", "name": "Itsuki Yukimura", "threadId": "1402186115284209664" },
  { "jpName": "篠原いよ", "name": "Iyo Shinohara", "threadId": "1310987432027750411" },
  { "jpName": "藤井いよな", "name": "Iyona Fujii", "threadId": "1356331320023974059" },
  { "jpName": "水谷いずみ", "name": "Izumi Mizutani" },
  { "jpName": "槙いずな", "name": "Izuna Maki", "threadId": "1359166570470965308" },
  { "jpName": "花園ジャスミン", "name": "Jasmine Hanazono" },
  { "jpName": "希崎ジェシカ", "name": "Jessica Kizaki", "threadId": "1213315376738340885" },
  { "jpName": "JULIA", "name": "JULIA", "threadId": "1197539925399175269" },
  { "jpName": "春明潤", "name": "Jun Harumi" },
  { "jpName": "香水じゅん", "name": "Jun Kasui", "threadId": "1197694534625271979" },
  { "jpName": "女神ジュン", "name": "Jun Megami", "threadId": "1279283295330369536" },
  { "jpName": "水川潤", "name": "Jun Mizukawa", "threadId": "1204902755198566551" },
  { "jpName": "末広純", "name": "Jun Suehiro", "threadId": "1198348320918220880" },
  { "jpName": "北原樹里", "name": "Juri Kitahara" },
  { "jpName": "日向かえで", "name": "Kaede Hinata" },
  { "jpName": "小泉楓", "name": "Kaede Koizumi", "threadId": "1457760052697104525" },
  { "jpName": "佐久間楓", "name": "Kaede Sakuma" },
  { "jpName": "相沢夏帆", "name": "Kaho Aizawa" },
  { "jpName": "浜辺栞帆", "name": "Kaho Hamabe", "threadId": "1197560997192417280" },
  { "jpName": "花守夏歩", "name": "Kaho Hanamori", "threadId": "1340645601599164459" },
  { "jpName": "佐竹夏帆", "name": "Kaho Satake" },
  { "jpName": "白浜果歩", "name": "Kaho Shirahama", "threadId": "1407029103760117800" },
  { "jpName": "玉城夏帆", "name": "Kaho Tamashiro" },
  { "jpName": "雪代一鳳", "name": "Kaho Yukishiro", "threadId": "1252465102758871051" },
  { "jpName": "青葉香奈", "name": "Kana Aoba", "threadId": "1429854243405168681"  },
  { "jpName": "柊かな", "name": "Kana Hiiragi" },
  { "jpName": "日下部加奈", "name": "Kana Kusakabe", "threadId": "1204176658890756116" },
  { "jpName": "水戸かな", "name": "Kana Mito", "threadId": "1213122181958074409" },
  { "jpName": "宮下華奈", "name": "Kana Miyashita", "threadId": "1340663230283911258" },
  { "jpName": "桃乃木かな", "name": "Kana Momonogi", "threadId": "1197573056093229076" },
  { "jpName": "森沢かな（飯岡かなこ）", "name": "Kana Morisawa", "threadId": "1211987537267269662" },
  { "jpName": "成瀬花奈", "name": "Kana Naruse" },
  { "jpName": "奥乃美加奈", "name": "Kana Okunomi" },
  { "jpName": "佐々木夏菜", "name": "Kana Sasaki" },
  { "jpName": "田村香奈", "name": "Kana Tamura" },
  { "jpName": "鶴田かな", "name": "Kana Tsuruta", "threadId": "1213312443875590224" },
  { "jpName": "四ッ葉かな", "name": "Kana Yotsuha" },
  { "jpName": "由愛可奈", "name": "Kana Yume" },
  { "jpName": "由良かな", "name": "Kana Yura", "threadId": "1311382811562737686" },
  { "jpName": "兵頭加奈恵", "name": "Kanae Hyoudou" },
  { "jpName": "深月香苗", "name": "Kanae Mitsuki" },
  { "jpName": "望実かなえ", "name": "Kanae Nozomi" },
  { "jpName": "夢実かなえ", "name": "Kanae Yumemi", "threadId": "1201364468983136266" },
  { "jpName": "凰かなめ", "name": "Kaname Ootori", "threadId": "1413112978731176098" },
  { "jpName": "天宮花南", "name": "Kanan Amamiya", "threadId": "1197560401483796481" },
  { "jpName": "透美かなた", "name": "Kanata Toumi" },
  { "jpName": "有栖かなう", "name": "Kanau Arisa" },
  { "jpName": "天音かんな", "name": "Kanna Amane", "threadId": "1336374159084884062" },
  { "jpName": "藤かんな", "name": "Kanna Fuji", "threadId": "1199161245262159972" },
  { "jpName": "平井栞奈", "name": "Kanna Hirai" },
  { "jpName": "今井栞菜", "name": "Kanna Imai", "threadId": "1340677075719426059" },
  { "jpName": "九重かんな", "name": "Kanna Kokonoe" },
  { "jpName": "小坂環奈", "name": "Kanna Kosaka" },
  { "jpName": "美咲かんな", "name": "Kanna Misaki", "threadId": "1304663901056532560" },
  { "jpName": "三ツ木柑奈", "name": "Kanna Mizuki" },
  { "jpName": "三木環奈", "name": "Kanna Sannoki", "threadId": "1308231405330890882" },
  { "jpName": "瀬戸環奈", "name": "Kanna Seto", "threadId": "1320427788200575006" },
  { "jpName": "篠崎かんな", "name": "Kanna Shinozaki" },
  { "jpName": "香椎花乃", "name": "Kano Kashii" },
  { "jpName": "賀川かのこ", "name": "Kanoko Kagawa" },
  { "jpName": "羽月果音", "name": "Kanon Hazuki" },
  { "jpName": "姫川かのん", "name": "Kanon Himekawa" },
  { "jpName": "ひなの花音", "name": "Kanon Hinano", "threadId": "1268845663890833449" },
  { "jpName": "市川花音", "name": "Kanon Ichikawa" },
  { "jpName": "奏音かのん", "name": "Kanon Kanade" },
  { "jpName": "真城かのん", "name": "Kanon Mashiro" },
  { "jpName": "美月香織", "name": "Kaori Mitsuki" },
  { "jpName": "森かおり", "name": "Kaori Mori", "threadId": "1432268633630965911" },
  { "jpName": "小宮かおる", "name": "Kaoru Komiya" },
  { "jpName": "安位薫", "name": "Kaoru Yasui", "threadId": "1197551614878298224" },
  { "jpName": "安位カヲル", "name": "Kaoru Yasui", "threadId": "1197551614878298224" },
  { "jpName": "朝日奈かれん", "name": "Karen Asahina" },
  { "jpName": "響かれん", "name": "Karen Hibiki" },
  { "jpName": "石田佳蓮", "name": "Karen Ishida", "threadId": "1270185742177402990" },
  { "jpName": "純真かれん", "name": "Karen Junshin" },
  { "jpName": "楓カレン", "name": "Karen Kaede", "threadId": "1197520809539948565" },
  { "jpName": "湊音かれん", "name": "Karen Minato", "threadId": "1450155895534129303" },
  { "jpName": "永瀬かれん", "name": "Karen Nagase" },
  { "jpName": "鳳カレン", "name": "Karen Otori", "threadId": "1197708023599214662" },
  { "jpName": "兎美かれん", "name": "Karen Usami" },
  { "jpName": "八神カレン", "name": "Karen Yagami" },
  { "jpName": "楪カレン", "name": "Karen Yuzuriha", "threadId": "1198742623255527434" },
  { "jpName": "北岡果林", "name": "Karin Kitaoka", "threadId": "1336198561104269312" },
  { "jpName": "前野伽鈴", "name": "Karin Maeno" },
  { "jpName": "塔乃花鈴", "name": "Karin Touno", "threadId": "1252297268246216876" },
  { "jpName": "西田カリナ", "name": "Karina Nishida" },
  { "jpName": "谷田かりな", "name": "Karina Tanida" },
  { "jpName": "斎藤かさね", "name": "Kasane Saitō" },
  { "jpName": "天宮かすみ", "name": "Kasumi Amamiya", "threadId": "1228298726519472169" },
  { "jpName": "吉瀬かすみ", "name": "Kasumi Kichise" },
  { "jpName": "松丸香澄", "name": "Kasumi Matsumaru" },
  { "jpName": "斎木香住", "name": "Kasumi Saiki", "threadId": "1347139408687665182" },
  { "jpName": "白河花清", "name": "Kasumi Shirakawa" },
  { "jpName": "月野かすみ", "name": "Kasumi Tsukino", "threadId": "1211704950124445746" },
  { "jpName": "高嶋和", "name": "Kazu Takashima" },
  { "jpName": "小倉かずは", "name": "Kazuha Ogura" },
  { "jpName": "伊勢谷景", "name": "Kei Iseya" },
  { "jpName": "南見京", "name": "Kei Minami" },
  { "jpName": "岡本ケイ", "name": "Kei Okamoto" },
  { "jpName": "保科希帆", "name": "Kiho Hoshina", "threadId": "1421495950345506926" },
  { "jpName": "金松季歩", "name": "Kiho Kanematsu", "threadId": "1214227938090680410" },
  { "jpName": "逢坂希穂", "name": "Kiho Ousaka" },
  { "jpName": "幸村紀那", "name": "Kina Yukimura" },
  { "jpName": "輝星きら", "name": "Kira Kira", "threadId": "1303157459950505994" },
  { "jpName": "明日花キララ", "name": "Kirara Asuka", "threadId": "1213320385873977354" },
  { "jpName": "安藤季世", "name": "Kise Andou" },
  { "jpName": "祈里きすみ", "name": "Kisumi Inori" },
  { "jpName": "北山憂", "name": "Kitayama Yu" },
  { "jpName": "五十嵐清華", "name": "Kiyoka Igarashi" },
  { "jpName": "加賀谷恋白", "name": "Kohaku Kaguya" },
  { "jpName": "遠藤こはる", "name": "Koharu Endo" },
  { "jpName": "三池小春", "name": "Koharu Miike", "threadId": "1329730416105619516" },
  { "jpName": "咲乃小春", "name": "Koharu Sakuno" },
  { "jpName": "椎名心春", "name": "Koharu Shiina", "threadId": "1211189213110734908" },
  { "jpName": "雫月心桜", "name": "Koharu Shizuki" },
  { "jpName": "鈴木心春", "name": "Koharu Suzuki", "threadId": "1212875565921603655" },
  { "jpName": "渚恋生", "name": "Koiki Nagisa", "threadId": "1197561223198289920" },
  { "jpName": "夕木こいろ", "name": "Koiro Yuki", "threadId": "1341074822570049547" },
  { "jpName": "真白ここ", "name": "Koko Mashiro" },
  { "jpName": "愛須心亜", "name": "Kokoa Aisu" },
  { "jpName": "浅野心愛", "name": "Kokoa Asano", "threadId": "1374426801064902816"  },
  { "jpName": "星仲ここみ", "name": "Kokomi Hoshinaka" },
  { "jpName": "桜ここみ", "name": "Kokomi Sakura" },
  { "jpName": "朝倉ここな", "name": "Kokona Asakura", "threadId": "1198351544341516429" },
  { "jpName": "中森心々奈", "name": "Kokona Nakamori", "threadId": "1206629807950135336" },
  { "jpName": "夏向ここの（寺田ここの）", "name": "Kokono Kanata" },
  { "jpName": "浅野こころ", "name": "Kokoro Asano", "threadId": "1197548973645381742" },
  { "jpName": "綾瀬こころ", "name": "Kokoro Ayase", "threadId": "1197554884828987432" },
  { "jpName": "中村心", "name": "Kokoro Nakamura" },
  { "jpName": "雫こころ", "name": "Kokoro Shizuku" },
  { "jpName": "歌野こころ", "name": "Kokoro Utano" },
  { "jpName": "恋川こもも", "name": "Komomo Koikawa", "threadId": "1462829315803582547" },
  { "jpName": "小宵こなん", "name": "Konan Koyoi", "threadId": "1197502839702954015" },
  { "jpName": "柏木こなつ", "name": "Konatsu Kashiwagi", "threadId": "1308333682573967433" },
  { "jpName": "清水こなつ", "name": "Konatsu Shimizu", "threadId": "1356300845645299932" },
  { "jpName": "新田好実", "name": "Konomi Nitta", "threadId": "1461821875448713278" },
  { "jpName": "綾瀬ことは", "name": "Kotoha Ayase" },
  { "jpName": "姫野ことめ", "name": "Kotome Himeno" },
  { "jpName": "綾瀬ことね", "name": "Kotone Ayase", "threadId": "1434937933508378777" },
  { "jpName": "藤咲琴音", "name": "Kotone Fujisaki" },
  { "jpName": "宮園ことね", "name": "Kotone Miyazono" },
  { "jpName": "冬愛ことね", "name": "Kotone Toa", "threadId": "1311376704794660915" },
  { "jpName": "山本ことね", "name": "Kotone Yamamoto" },
  { "jpName": "森下ことの", "name": "Kotono Morishita" },
  { "jpName": "浜辺ことり", "name": "Kotori Hamabe" },
  { "jpName": "港こう", "name": "Kou Minato" },
  { "jpName": "諸岡小詠", "name": "Koyomi Morooka" },
  { "jpName": "藤田こずえ", "name": "Kozue Fujita" },
  { "jpName": "美波こづえ", "name": "Kozue Minami", "threadId": "1323882063337754666" },
  { "jpName": "仲野梢", "name": "Kozue Nakano" },
  { "jpName": "小泉玖美", "name": "Kumi Koizumi" },
  { "jpName": "蓮実クレア", "name": "Kurea Hasumi", "threadId": "1323540764466216962" },
  { "jpName": "一ノ瀬クレハ", "name": "Kureha Ichinose" },
  { "jpName": "月丘紅羽", "name": "Kureha Tsukioka" },
  { "jpName": "双葉くるみ", "name": "Kurumi Futaba" },
  { "jpName": "春野くるみ", "name": "Kurumi Haruno" },
  { "jpName": "雛形くるみ", "name": "Kurumi Hinagata" },
  { "jpName": "桃瀬くるみ", "name": "Kurumi Momose" },
  { "jpName": "百田くるみ", "name": "Kurumi Momota", "threadId": "1404854559272206446" },
  { "jpName": "大和田来望", "name": "Kurumi Oowada" },
  { "jpName": "白森くるみ", "name": "Kurumi Shiramori", "threadId": "1373048670932435057" },
  { "jpName": "瀧本くるみ", "name": "Kurumi Takimoto", "threadId": "1431116050065522789"  },
  { "jpName": "玉木くるみ", "name": "Kurumi Tamaki" },
  { "jpName": "朱莉きょうこ", "name": "Kyoko Akari" },
  { "jpName": "真木今日子", "name": "Kyoko Maki", "threadId": "1271093504927334561" },
  { "jpName": "鈴音杏夏", "name": "Kyouka Suzune" },
  { "jpName": "有沢涼子", "name": "Kyouko Arisawa" },
  { "jpName": "リリー・ハート", "name": "Lily Heart" },
  { "jpName": "宝生リリー", "name": "Lily Houshou" },
  { "jpName": "夢見るぅ", "name": "Lu Yumemi" },
  { "jpName": "入田真綾", "name": "Maaya Irita", "threadId": "1197558068712570940" },
  { "jpName": "幾野まち", "name": "Machi Ikuno" },
  { "jpName": "幾田まち", "name": "Machi Ikuta" },
  { "jpName": "倉田まどか", "name": "Madoka Kurata" },
  { "jpName": "望月円", "name": "Madoka Mochizuki", "threadId": "1450143179448914012" },
  { "jpName": "雪奈真冬", "name": "Mafuyu Yukina" },
  { "jpName": "天音まひな", "name": "Mahina Amane", "threadId": "1198103541814939739" },
  { "jpName": "市来まひろ", "name": "Mahiro Ichiki", "threadId": "1277953937390964868" },
  { "jpName": "唯井まひろ", "name": "Mahiro Tadai", "threadId": "1197798331070562354" },
  { "jpName": "内山真宙", "name": "Mahiro Uchiyama" },
  { "jpName": "櫻茉日", "name": "Mahiru Sakura", "threadId": "1276469447472971856" },
  { "jpName": "有栖舞衣", "name": "Mai Arisu", "threadId": "1197749619233394740" },
  { "jpName": "藤咲舞", "name": "Mai Fujisaki", "threadId": "1305753573782589490" },
  { "jpName": "藤咲まい（藤咲舞）", "name": "Mai Fujisaki", "threadId": "1305753573782589490" },
  { "jpName": "藤咲まい", "name": "Mai Fujisaki", "threadId": "1305753573782589490" },
  { "jpName": "花狩まい", "name": "Mai Kagari", "threadId": "1206585351464951878" },
  { "jpName": "神菜美まい", "name": "Mai Kanami", "threadId": "1257319733674639430" },
  { "jpName": "奏海麻衣", "name": "Mai Kanami", "threadId": "1457754110039429294" },
  { "jpName": "河北麻衣", "name": "Mai Kawakita" },
  { "jpName": "小森まい", "name": "Mai Komori" },
  { "jpName": "ななせ麻衣", "name": "Mai Nanase" },
  { "jpName": "七嶋舞", "name": "Mai Nanashima", "threadId": "1197556686706188301" },
  { "jpName": "小野寺舞", "name": "Mai Onodera" },
  { "jpName": "潮美舞", "name": "Mai Shiomi" },
  { "jpName": "つばさ舞", "name": "Mai Tsubasa", "threadId": "1197546682963984496" },
  { "jpName": "日泉舞香", "name": "Maika Hiizumi" },
  { "jpName": "三好舞花", "name": "Maika Miyoshi", "threadId": "1421495338740744222" },
  { "jpName": "小谷舞花", "name": "Maika Kotani", "threadId": "1340690548922646538" },
  { "jpName": "綾瀬麻衣子（沢口まりあ）", "name": "Maiko Ayase" },
  { "jpName": "綾瀬舞菜（あやせ舞菜）", "name": "Maina Ayase", "threadId": "1200459901965717644" },
  { "jpName": "白羽舞菜", "name": "Maina Shiraha", "threadId": "1462828714772402218" },
  { "jpName": "優梨まいな", "name": "Maina Yuri" },
  { "jpName": "北条麻妃", "name": "Maki Hojo", "threadId": "1218827467117039727" },
  { "jpName": "小清水真紀", "name": "Maki Koshimizu" },
  { "jpName": "武井麻希", "name": "Maki Takei" },
  { "jpName": "友田真希", "name": "Maki Tomoda", "threadId": "1309726692612505721" },
  { "jpName": "伊賀まこ", "name": "Mako Iga" },
  { "jpName": "夏目まこ", "name": "Mako Natsume" },
  { "jpName": "織田真子", "name": "Mako Oda", "threadId": "1207927560369864764" },
  { "jpName": "白石真琴", "name": "Makoto Shiraishi" },
  { "jpName": "金子茉珠", "name": "Mami Kaneko" },
  { "jpName": "長瀬麻美", "name": "Mami Nagase", "threadId": "1373872151865856110" },
  { "jpName": "七美まみ", "name": "Mami Nanami" },
  { "jpName": "櫻井まみ", "name": "Mami Sakurai" },
  { "jpName": "善場まみ（茉城まみ）", "name": "Mami Zenba", "threadId": "1197531890429730866" },
  { "jpName": "向後満美子", "name": "Mamiko Kougo" },
  { "jpName": "紗倉まな", "name": "Mana Sakura", "threadId": "1197559637168369736" },
  { "jpName": "川村まなみ", "name": "Manami Kawamura" },
  { "jpName": "工藤まなみ", "name": "Manami Kudo" },
  { "jpName": "大浦真奈美", "name": "Manami Ooura" },
  { "jpName": "藤村麻央", "name": "Mao Fujimura" },
  { "jpName": "浜崎真緒", "name": "Mao Hamasaki", "threadId": "1341095151472345159" },
  { "jpName": "堀田真央", "name": "Mao Hotta", "threadId": "1247788198290259970" },
  { "jpName": "倉多まお", "name": "Mao Kurata", "threadId": "1267518639687340075" },
  { "jpName": "黒木麻央", "name": "Mao Kuruki" },
  { "jpName": "真白真緒", "name": "Mao Mashiro" },
  { "jpName": "澪真央", "name": "Mao Mio" },
  { "jpName": "諏訪珠生", "name": "Mao Suwata" },
  { "jpName": "高梨真緒", "name": "Mao Takanashi", "threadId": "1282872937728311308" },
  { "jpName": "渡辺まお", "name": "Mao Watanabe" },
  { "jpName": "高杉麻里", "name": "Mari Takasugi" },
  { "jpName": "上戸まり", "name": "Mari Ueto" },
  { "jpName": "綾瀬まりあ", "name": "Maria Ayase", "threadId": "1462827058580422708" },
  { "jpName": "逢沢まりあ", "name": "Maria Aizawa" },
  { "jpName": "永井マリア", "name": "Maria Nagai", "threadId": "1211128619993141289" },
  { "jpName": "渡辺まりか", "name": "Marika Watanabe" },
  { "jpName": "古東まりこ", "name": "Mariko Koto", "threadId": "1340691045897207940" },
  { "jpName": "佐田茉莉子", "name": "Mariko Sata", "threadId": "1340666094691549224" },
  { "jpName": "新垣まりん", "name": "Marin Aragaki" },
  { "jpName": "ひなたまりん", "name": "Marin Hinata" },
  { "jpName": "三田真鈴", "name": "Marin Mita", "threadId": "1197739670973468783" },
  { "jpName": "池田マリナ", "name": "Marina Ikeda **newhalf**" },
  { "jpName": "ももの真利奈", "name": "Marina Momono", "threadId": "1381664319246303363" },
  { "jpName": "西尾まりな", "name": "Marina Nishio" },
  { "jpName": "白石茉莉奈", "name": "Marina Shiraishi", "threadId": "1212349603882471444" },
  { "jpName": "役野満里奈", "name": "Marina Yakuno", "threadId": "1227095827181207563" },
  { "jpName": "夏希まろん", "name": "Maron Natsuki", "threadId": "1238372319492182056" },
  { "jpName": "橘メアリー", "name": "Mary Tachibana", "threadId": "1204055852995055667" },
  { "jpName": "伊藤優希", "name": "Masaki Itou" },
  { "jpName": "保田真咲", "name": "Masaki Yasuda" },
  { "jpName": "高野正成", "name": "Masanari Takano" },
  { "jpName": "桐谷まつり", "name": "Matsuri Kiritani", "threadId": "1200324363535274024" },
  { "jpName": "菊池まや", "name": "Maya Kikuchi" },
  { "jpName": "関口万葉", "name": "Mayo Sekiguchi" },
  { "jpName": "葉月まゆ", "name": "Mayu Hazuki", "threadId": "1314520203031482409"  },
  { "jpName": "堀沢茉由", "name": "Mayu Horisawa" },
  { "jpName": "小美川まゆ", "name": "Mayu Komikawa" },
  { "jpName": "篠真有", "name": "Mayu Shino", "threadId": "1282865472634617939" },
  { "jpName": "白川まゆ", "name": "Mayu Shirakawa", "threadId": "1275121164431392850" },
  { "jpName": "鈴木真夕", "name": "Mayu Suzuki", "threadId": "1260611036180910080" },
  { "jpName": "鈴音まゆ", "name": "Mayu Suzune", "threadId": "1197936058302730270" },
  { "jpName": "瑶真由香", "name": "Mayuka Haru", "threadId": "1340686618083983471" },
  { "jpName": "伊藤舞雪", "name": "Mayuki Ito", "threadId": "1197572200643952670" },
  { "jpName": "天美めあ", "name": "Mea Amami" },
  { "jpName": "三尾めぐ", "name": "Megu Mio" },
  { "jpName": "宮澤めぐ", "name": "Megu Miyazawa" },
  { "jpName": "目黒めぐみ", "name": "Megumi Meguro" },
  { "jpName": "鈴河めぐみ", "name": "Megumi Suzukawa", "threadId": "1340685445130092575" },
  { "jpName": "鳥井恵", "name": "Megumi Torii" },
  { "jpName": "めぐり（藤浦めぐ）", "name": "Meguri", "threadId": "1223793165459263529" },
  { "jpName": "美ノ嶋めぐり", "name": "Meguri Minoshima", "threadId": "1197557612334551091" },
  { "jpName": "林芽依", "name": "Mei Hayashi", "threadId": "1447610872049434875" },
  { "jpName": "五日市芽依", "name": "Mei Itsukaichi", "threadId": "1207519668462559262" },
  { "jpName": "上坂めい", "name": "Mei Kamisaka" },
  { "jpName": "愛瀬めい", "name": "Mei Manase" },
  { "jpName": "宮島めい", "name": "Mei Miyajima", "threadId": "1197917978361077860" },
  { "jpName": "深月めい", "name": "Mei Mizuki", "threadId": "1259103125940338788"  },
  { "jpName": "さつき芽衣", "name": "Mei Satsuki", "threadId": "1197580622210814062" },
  { "jpName": "九十九メイ", "name": "Mei Tsukumo" },
  { "jpName": "鷲尾めい", "name": "Mei Washio", "threadId": "1197545192757145671" },
  { "jpName": "川北メイサ", "name": "Meisa Kawakita" },
  { "jpName": "西元めいさ", "name": "Meisa Nishimoto", "threadId": "1396922787758604409" },
  { "jpName": "メロディー・雛・マークス", "name": "Melody Marks", "threadId": "1296148861902917787" },
  { "jpName": "神楽坂める", "name": "Meru Kagurasaka" },
  { "jpName": "佐藤愛瑠", "name": "Meru Satou", "threadId": "1206629807950135336" },
  { "jpName": "神喜ミア", "name": "Mia Kouki", "threadId": "1434578487242653867" },
  { "jpName": "益坂美亜", "name": "Mia Masuzaka" },
  { "jpName": "七沢みあ", "name": "Mia Nanasawa", "threadId": "1215509738201288704" },
  { "jpName": "天音ミシェル", "name": "Michelle Amane", "threadId": "1394032257022296075" },
  { "jpName": "北村海智", "name": "Michi Kitamura" },
  { "jpName": "澄河美花", "name": "Mihana Sumikawa", "threadId": "1340670172901408849" },
  { "jpName": "遠藤未晴", "name": "Miharu Endou" },
  { "jpName": "羽咲みはる", "name": "Miharu Usa", "threadId": "1223938059603804231" },
  { "jpName": "みひな （あずみひな、永井みひな）", "name": "Mihina" },
  { "jpName": "あべみほ", "name": "Miho Abe" },
  { "jpName": "通野未帆", "name": "Miho Tono", "threadId": "1291741616641544255" },
  { "jpName": "雪代美鳳", "name": "Miho Yukishiro", "threadId": "1252465102758871051" },
  { "jpName": "美雛みい", "name": "Mii Mihina" },
  { "jpName": "若月みいな", "name": "Miina Wakatsuki" },
  { "jpName": "弥みいさ", "name": "Miisa Amane", "threadId": "1461624195124560116" },
  { "jpName": "東実果", "name": "Mika Azuma", "threadId": "1386126204737818755" },
  { "jpName": "知良みか", "name": "Mika Chira", "threadId": "1386121615535902731" },
  { "jpName": "御子柴美花", "name": "Mika Mikoshiba" },
  { "jpName": "夏色みか", "name": "Mika Natsuiro", "threadId": "1394340391343493120" },
  { "jpName": "あべみかこ", "name": "Mikako Abe" },
  { "jpName": "堀内未果子", "name": "Mikako Horiuchi" },
  { "jpName": "小鈴みかん", "name": "Mikan Kosuzu", "threadId": "1331225822203347005" },
  { "jpName": "枢木みかん", "name": "Mikan Kururugi" },
  { "jpName": "山城三日月", "name": "Mikazuki Yamashiro" },
  { "jpName": "猫宮みけ", "name": "Mike Nekomiya" },
  { "jpName": "赤井美希", "name": "Miki Akai", "threadId": "1340684572962066442" },
  { "jpName": "実浜みき", "name": "Miki Mihama", "threadId": "1206900174694391828" },
  { "jpName": "白石みき", "name": "Miki Shiraishi" },
  { "jpName": "春原未来", "name": "Miki Sunohara", "threadId": "1357494127557607454" },
  { "jpName": "山瀬美紀", "name": "Miki Yamase" },
  { "jpName": "よしい美希（伊沢涼子、吉井美希）", "name": "Miki Yoshii" },
  { "jpName": "松田美子", "name": "Miko Matsuda" },
  { "jpName": "百恵みこと", "name": "Mikoto Momoe" },
  { "jpName": "吉岡美琴", "name": "Mikoto Yoshioka" },
  { "jpName": "あかり美来", "name": "Miku Akari" },
  { "jpName": "有馬美玖", "name": "Miku Arima", "threadId": "1317640875500634172" },
  { "jpName": "生田みく", "name": "Miku Ikuta" },
  { "jpName": "石田美久", "name": "Miku Ishida" },
  { "jpName": "門倉美玖", "name": "Miku Kadoku" },
  { "jpName": "舞奈みく", "name": "Miku Maina" },
  { "jpName": "桃みく", "name": "Miku Momo" },
  { "jpName": "雛形みくる", "name": "Mikuru Hinagata", "threadId": "1460291607319281970" },
  { "jpName": "堀北実来（櫻茉日）", "name": "Mikuru Horikita" },
  { "jpName": "真白みくる", "name": "Mikuru Mashiro" },
  { "jpName": "中丸未来", "name": "Mikuru Nakamaru" },
  { "jpName": "早乙女美々", "name": "Mimi Saotome" },
  { "jpName": "藍瀬ミナ", "name": "Mina Aise" },
  { "jpName": "福原みな", "name": "Mina Fukuhara", "threadId": "1363143628314382489" },
  { "jpName": "北野未奈", "name": "Mina Kitano", "threadId": "1198746535085756556" },
  { "jpName": "指原美奈", "name": "Mina Sashihara" },
  { "jpName": "有賀みなほ", "name": "Minaho Ariga", "threadId": "1206856508948746330" },
  { "jpName": "小向美奈子", "name": "Minako Komukai", "threadId": "1409086568739901441" },
  { "jpName": "相沢みなみ", "name": "Minami Aizawa", "threadId": "1197914416763641867" },
  { "jpName": "みなみ羽琉（みなと羽琉）", "name": "Minami Haru", "threadId": "1198496220423917668" },
  { "jpName": "初川みなみ", "name": "Minami Hatsukawa" },
  { "jpName": "広仲みなみ", "name": "Minami Hironaka" },
  { "jpName": "香住みなみ", "name": "Minami Kasumi" },
  { "jpName": "小島みなみ", "name": "Minami Kojima", "threadId": "1197547738880028802" },
  { "jpName": "前田美波", "name": "Minami Maeda", "threadId": "1197570762979156018" },
  { "jpName": "沢北みなみ", "name": "Minami Sawakita" },
  { "jpName": "白川みなみ", "name": "Minami Shirakawa" },
  { "jpName": "白百合みなみ", "name": "Minami Shirayuri" },
  { "jpName": "戸川なみ", "name": "Minami Togawa" },
  { "jpName": "梅田みなみ", "name": "Minami Umeda" },
  { "jpName": "安みなみ", "name": "Minami Yasu" },
  { "jpName": "MINAMO", "name": "MINAMO", "threadId": "1197559965028712478" },
  { "jpName": "湖高湊", "name": "Minato Kadaka" },
  { "jpName": "舞羽美翔", "name": "Minato Maiha" },
  { "jpName": "櫻木みなと", "name": "Minato Sakuragi", "threadId": "1400045032299429888" },
  { "jpName": "初音みのり", "name": "Minori Hatsune", "threadId": "1213327396418359316" },
  { "jpName": "真白みのり", "name": "Minori Mashiro", "threadId": "1315393166911995954" },
  { "jpName": "尾崎みのり", "name": "Minori Ozaki" },
  { "jpName": "足立美緒", "name": "Mio Adachi" },
  { "jpName": "愛上みお", "name": "Mio Aiue" },
  { "jpName": "朝日奈みお", "name": "Mio Asahina" },
  { "jpName": "藤子みお", "name": "Mio Fujiko" },
  { "jpName": "花咲澪", "name": "Mio Hanasaki", "threadId": "1461820884682670111" },
  { "jpName": "雛鶴みお", "name": "Mio Hinazuru" },
  { "jpName": "一条みお", "name": "Mio Ichijo", "threadId": "1309531023624765523" },
  { "jpName": "石川澪", "name": "Mio Ishikawa", "threadId": "1197472636113010698" },
  { "jpName": "君島みお", "name": "Mio Kimijima", "threadId": "1210862484110712882" },
  { "jpName": "野咲美桜", "name": "Mio Nozaki" },
  { "jpName": "桜みお", "name": "Mio Sakura", "threadId": "1432453915903000750" },
  { "jpName": "四季島澪", "name": "Mio Shikishima" },
  { "jpName": "小栗操", "name": "Misao Oguri", "threadId": "1315967539435667526" },
  { "jpName": "坂井美桜", "name": "Mio Sakai", "threadId": "1427314262422065162" },
  { "jpName": "土屋美桜", "name": "Mio Tsuchiyami" },
  { "jpName": "魅音", "name": "Mion", "threadId": "1252440705427701822" },
  { "jpName": "西野心音", "name": "Mion Nishino" },
  { "jpName": "桜木美音", "name": "Mion Sakuragi" },
  { "jpName": "園田みおん", "name": "Mion Sonoda", "threadId": "1203906694141317131" },
  { "jpName": "原美織", "name": "Miori Hara" },
  { "jpName": "柊みおり", "name": "Miori Hiiragi" },
  { "jpName": "松岡美桜", "name": "Miou Matsuoka" },
  { "jpName": "喜多川みら", "name": "Mira Kitagawa" },
  { "jpName": "明日見未来", "name": "Mirai Asumi", "threadId": "1203044509785657344" },
  { "jpName": "東雲みれい", "name": "Mirei Shinonome" },
  { "jpName": "宇野みれい", "name": "Mirei Uno", "threadId": "1197548364439490610" },
  { "jpName": "岸永みりな", "name": "Mirina Kishinaga" },
  { "jpName": "miru", "name": "miru", "threadId": "1197575710387212339" },
  { "jpName": "飯豊みる", "name": "Miru Iitoyo" },
  { "jpName": "加ノ崎みる", "name": "Miru Kanosaki" },
  { "jpName": "坂道みる", "name": "Miru Sakamichi" },
  { "jpName": "片瀬みさ", "name": "Misa Katase" },
  { "jpName": "杉崎美紗", "name": "Misa Sagisaki" },
  { "jpName": "美咲そのか", "name": "Misaki Sonoka", "threadId": "1406836083613761647" },
  { "jpName": "相葉美沙子", "name": "Misako Aiba", "threadId": "1374242747392987137" },
  { "jpName": "水原みその", "name": "Misono Mizuhara", "threadId": "1380261068437454958" },
  { "jpName": "川嶋望空", "name": "Misora Kawashima" },
  { "jpName": "三舩みすず", "name": "Misuzu Mifune" },
  { "jpName": "高岡美鈴", "name": "Misuzu Takaoka" },
  { "jpName": "和久井美兎", "name": "Mito Wakui" },
  { "jpName": "安藤みつ", "name": "Mitsu Andou" },
  { "jpName": "前原みつの", "name": "Mitsuno Maehara" },
  { "jpName": "明日葉みつは", "name": "Mitsuha Ashitaba", "threadId": "1197546228393705472" },
  { "jpName": "樋口みつは", "name": "Mitsuha Higuchi" },
  { "jpName": "広瀬みつき", "name": "Mitsuki Hirose" },
  { "jpName": "伊澄みつき", "name": "Mitsuki Isumi" },
  { "jpName": "牧田充希", "name": "Mitsuki Makita" },
  { "jpName": "百田光稀（百田光希）", "name": "Mitsuki Momota", "threadId": "1197543710460755999" },
  { "jpName": "渚みつき", "name": "Mitsuki Nagisa", "threadId": "1404311080741900348"  },
  { "jpName": "沖奈ミツキ", "name": "Mitsuki Okina" },
  { "jpName": "白雪美月", "name": "Mitsuki Shirayuki", "threadId": "1264583771592593458" },
  { "jpName": "唯奈みつき", "name": "Mitsuki Yuina" },
  { "jpName": "長浜みつり", "name": "Mitsuri Nagahama", "threadId": "1197470242310463579" },
  { "jpName": "天音美羽", "name": "Miu Amane" },
  { "jpName": "有岡みう", "name": "Miu Arioka", "threadId": "1274920983446425620" },
  { "jpName": "仲村みう", "name": "Miu Nakamura", "threadId": "1211140134737543188" },
  { "jpName": "白浜美羽", "name": "Miu Shirahama" },
  { "jpName": "白峰ミウ", "name": "Miu Shiromine", "threadId": "1197921273410486343" },
  { "jpName": "内海みう", "name": "Miu Uchimi" },
  { "jpName": "海乃みう", "name": "Miu Umino" },
  { "jpName": "須崎美羽", "name": "Miwa Suzaki" },
  { "jpName": "山本美和子", "name": "Miwako Yamamoto" },
  { "jpName": "春風みやび", "name": "Miyabi Harukaze" },
  { "jpName": "紫月みやび", "name": "Miyabi Shiduki", "threadId": "1447609221964107796" },
  { "jpName": "逢沢みゆ", "name": "Miyu Aizawa", "threadId": "1197570876397334650" },
  { "jpName": "広瀬美結", "name": "Miyu Hirose", "threadId": "1197558455368679526" },
  { "jpName": "今井美優", "name": "Miyu Imai", "threadId": "1351217712663101621" },
  { "jpName": "稲森美憂", "name": "Miyu Inamori" },
  { "jpName": "兼咲みゆ（愛乃零、浅見せな）", "name": "Miyu Kanesaki", "threadId": "1228272093079011360" },
  { "jpName": "小日向みゆう（清原みゆう）", "name": "Miyu Kohinata", "threadId": "1197544278449209404" },
  { "jpName": "小栗みゆ", "name": "Miyu Oguri", "threadId": "1197567021240557679" },
  { "jpName": "鳳みゆ", "name": "Miyu Otori", "threadId": "1209807876697235497"  },
  { "jpName": "桜華みゆ", "name": "Miyu Ouka" },
  { "jpName": "有坂深雪", "name": "Miyuki Arisaka" },
  { "jpName": "永瀬みゆう", "name": "Miyuu Nagase" },
  { "jpName": "三咲美憂", "name": "Miyuu Misaki" },
  { "jpName": "葵井みずほ", "name": "Mizuho Aoi" },
  { "jpName": "藍芽みずき", "name": "Mizuki Aiga", "threadId": "1198520519557906545" },
  { "jpName": "天然美月（天然かのん）", "name": "Mizuki Amane" },
  { "jpName": "蒼乃美月", "name": "Mizuki Aono", "threadId": "1197832558470238219" },
  { "jpName": "羽生みずき", "name": "Mizuki Hanyuu" },
  { "jpName": "早川瑞希", "name": "Mizuki Hayakawa" },
  { "jpName": "中山みずき", "name": "Mizuki Nakayama", "threadId": "1417170643471831050" },
  { "jpName": "咲野瑞希", "name": "Mizuki Sakino" },
  { "jpName": "弥生みづき", "name": "Mizuki Yayoi", "threadId": "1265970957466472538" },
  { "jpName": "絵里奈モア", "name": "Moa Erina" },
  { "jpName": "堀北桃愛", "name": "Moa Horikita", "threadId": "1414637203644088411"  },
  { "jpName": "最上もあ", "name": "Moa Mogami" },
  { "jpName": "若月もあ", "name": "Moa Wakatsuki" },
  { "jpName": "天使もえ", "name": "Moe Amatsuka", "threadId": "1197525644649713705" },
  { "jpName": "菱沼萌咲", "name": "Moe Hishinuma" },
  { "jpName": "京花萌", "name": "Moe Kyouka" },
  { "jpName": "榊原萌", "name": "Moe Sakakibara", "threadId": "1277826757013278720" },
  { "jpName": "桜井もえ", "name": "Moe Sakurai" },
  { "jpName": "月奈もえ", "name": "Moe Tsukina" },
  { "jpName": "円井萌華", "name": "Moeka Marui", "threadId": "1202708128551010345" },
  { "jpName": "野村萌香", "name": "Moeka Nomura" },
  { "jpName": "綾瀬もか", "name": "Moka Ayase", "threadId": "1224880051753979904" },
  { "jpName": "春陽モカ", "name": "Moka Haruhi", "threadId": "1214235204873355304" },
  { "jpName": "桜もこ", "name": "Moko Sakura", "threadId": "1213326890723450931" },
  { "jpName": "あきばもも", "name": "Momo Akiba" },
  { "jpName": "本田もも", "name": "Momo Honda", "threadId": "1307816499561500734" },
  { "jpName": "星宮もも", "name": "Momo Hoshimiya" },
  { "jpName": "井上もも", "name": "Momo Inoue", "threadId": "1445079322003116225" },
  { "jpName": "美波もも", "name": "Momo Minami" },
  { "jpName": "御園もも", "name": "Momo Misono", "threadId": "1202327644071272549" },
  { "jpName": "二宮もも", "name": "Momo Ninomiya" },
  { "jpName": "音井もも", "name": "Momo Otoi" },
  { "jpName": "桜空もも", "name": "Momo Sakura", "threadId": "1197534048248135770" },
  { "jpName": "桜野桃", "name": "Momo Sakurano" },
  { "jpName": "早乙女もも", "name": "Momo Saotome **newhalf**" },
  { "jpName": "白石もも", "name": "Momo Shiraishi", "threadId": "1235787196590723142" },
  { "jpName": "小鳥遊ももえ", "name": "Momoe Takanashi" },
  { "jpName": "泉ももか", "name": "Momoka Izumi", "threadId": "1270216476103540830" },
  { "jpName": "神楽ももか", "name": "Momoka Kagura", "threadId": "1201187997379481681" },
  { "jpName": "一色桃子", "name": "Momoko Isshiki", "threadId": "1199507879800082562" },
  { "jpName": "恋渕ももな", "name": "Momona Koibuchi", "threadId": "1197560701233934346" },
  { "jpName": "櫻ももな", "name": "Momona Sakura" },
  { "jpName": "桜庭ももな", "name": "Momona Sakuraba", "threadId": "1407026277025710080" },
  { "jpName": "城ヶ崎百瀬", "name": "Momose Jōgasaki", "threadId": "1353801594021609603" },
  { "jpName": "江戸川もなか", "name": "Monaka Edogawa" },
  { "jpName": "千石もなか", "name": "Monaka Sengoku" },
  { "jpName": "鬼塚もなみ", "name": "Monami Onitsuka" },
  { "jpName": "宝田もなみ", "name": "Monami Takarada", "threadId": "1266926824118681603" },
  { "jpName": "香乃萌音", "name": "Mone Kouno" },
  { "jpName": "小松本果", "name": "Motoka Komatsu" },
  { "jpName": "藍色なぎ", "name": "Nagi Aiiro" },
  { "jpName": "保坂南葵", "name": "Nagi Hosaka" },
  { "jpName": "八坂凪", "name": "Nagi Yasaka", "threadId": "1389263848833290393" },
  { "jpName": "朝海凪咲", "name": "Nagisa Asami" },
  { "jpName": "綾瀬凪", "name": "Nagisa Ayase" },
  { "jpName": "小泉なぎさ", "name": "Nagisa Koizumi", "threadId": "1340667379453263902" },
  { "jpName": "四季島渚", "name": "Nagisa Shikishima" },
  { "jpName": "白石なぎさ", "name": "Nagisa Shiraishi" },
  { "jpName": "高星なぎさ", "name": "Nagisa Takahoshi" },
  { "jpName": "谷村凪咲", "name": "Nagisa Tanimura", "threadId": "1412097548344098826"  },
  { "jpName": "小沢菜穂", "name": "Naho Ozawa", "threadId": "1263387521258098708" },
  { "jpName": "角奈保", "name": "Naho Sumi", "threadId": "1340647527019712594" },
  { "jpName": "津村奈瑚", "name": "Nako Tsumura" },
  { "jpName": "星野ナミ", "name": "Nami Hoshino", "threadId": "1213324621059989564" },
  { "jpName": "星乃マミ", "name": "Nami Hoshino", "threadId": "1213324621059989564" },
  { "jpName": "黒木奈美", "name": "Nami Kuroki", "threadId": "1225511070156853258" },
  { "jpName": "七海那美", "name": "Nami Nami", "threadId": "1229593535507071047" },
  { "jpName": "沖宮那美", "name": "Nami Okimiya", "threadId": "1199505131629187133" },
  { "jpName": "白石なみ", "name": "Nami Shiraishi" },
  { "jpName": "涼菜波美", "name": "Nami Suzuna", "threadId": "1432452787840618596" },
  { "jpName": "渡会菜未", "name": "Nami Watarai" },
  { "jpName": "千早菜奈", "name": "Nana Chihaya" },
  { "jpName": "深田ナナ", "name": "Nana Fukada" },
  { "jpName": "早見なな", "name": "Nana Hayami" },
  { "jpName": "希咲那奈", "name": "Nana Kisaki", "threadId": "1198475510083227819" },
  { "jpName": "前乃菜々", "name": "Nana Maeno" },
  { "jpName": "未歩なな", "name": "Nana Miho", "threadId": "1216528098451914782" },
  { "jpName": "三崎なな", "name": "Nana Misaki" },
  { "jpName": "岡田奈々", "name": "Nana Okada" },
  { "jpName": "坂井なな", "name": "Nana Sakai" },
  { "jpName": "宇佐美なな", "name": "Nana Usami" },
  { "jpName": "八木奈々", "name": "Nana Yagi", "threadId": "1197472874466922496" },
  { "jpName": "久宝ななえ", "name": "Nanae Kubou" },
  { "jpName": "菜々葉", "name": "Nanaha" },
  { "jpName": "沙優七羽", "name": "Nanaha Sayuu" },
  { "jpName": "加瀬ななほ", "name": "Nanaho Kase" },
  { "jpName": "小坂七香", "name": "Nanaka Kosaka", "threadId": "1199025187719495811" },
  { "jpName": "吉瀬菜々子", "name": "Nanako Kichise" },
  { "jpName": "宮村ななこ", "name": "Nanako Miyamura" },
  { "jpName": "蒼羽ななみ", "name": "Nanami Aoba" },
  { "jpName": "青山七海", "name": "Nanami Aoyama", "threadId": "1340668625211887746" },
  { "jpName": "朝倉七海", "name": "Nanami Asaukura" },
  { "jpName": "川上奈々美", "name": "Nanami Kawakami" },
  { "jpName": "兒玉七海", "name": "Nanami Kodama", "threadId": "1198101878039380060" },
  { "jpName": "松本菜奈実", "name": "Nanami Matsumoto", "threadId": "1200788480222036110" },
  { "jpName": "中森ななみ", "name": "Nanami Nakamori", "threadId": "1322069597071081472" },
  { "jpName": "小倉七海", "name": "Nanami Ogura" },
  { "jpName": "椎名ななみ", "name": "Nanami Shiina", "threadId": "1351228246506606772" },
  { "jpName": "横宮七海", "name": "Nanami Yokomiya" },
  { "jpName": "葵ななせ", "name": "Nanase Aoi" },
  { "jpName": "朝比奈ななせ", "name": "Nanase Asahina" },
  { "jpName": "小笠原菜乃", "name": "Nano Ogasawara", "threadId": "1407413531581743244" },
  { "jpName": "矢澤なの", "name": "Nano Yazawa", "threadId": "1197556226616197311" },
  { "jpName": "桐生七乃葉", "name": "Nanoha Kiryuu" },
  { "jpName": "水乃なのは", "name": "Nanoha Mizuno", "threadId": "1254997520925458557" },
  { "jpName": "初美なのか", "name": "Nanoka Hatsumi", "threadId": "1404487461656203314" },
  { "jpName": "桜庭菜乃花", "name": "Nanoka Sakuraba" },
  { "jpName": "岬ななみ", "name": "Nanami Misaki", "threadId": "1201264272005677166" },
  { "jpName": "相月菜緒", "name": "Nao Aizuki" },
  { "jpName": "神宮寺ナオ", "name": "Nao Jinguji", "threadId": "1197477927349145646" },
  { "jpName": "真咲南朋（楓モモ、安藤なつ妃）", "name": "Nao Masaki" },
  { "jpName": "桐谷なお", "name": "Nao Kiritani" },
  { "jpName": "彩月七緒", "name": "Nao Satsuki", "threadId": "1212339858740092978" },
  { "jpName": "有季なお", "name": "Nao Yuuki" },
  { "jpName": "優里なお", "name": "Nao Yuuri" },
  { "jpName": "坂井なるは", "name": "Naruha Sakai" },
  { "jpName": "花渕なつ", "name": "Natsu Hanabuchi" },
  { "jpName": "日向なつ", "name": "Natsu Hinata", "threadId": "1216748718506905640" },
  { "jpName": "ひなたなつ（日向なつ）", "name": "Natsu Hinata", "threadId": "1216748718506905640" },
  { "jpName": "夏生なつ", "name": "Natsu Natsuki", "threadId": "1440163815298695278" },
  { "jpName": "梨杏なつ", "name": "Natsu Rian" },
  { "jpName": "佐野なつ", "name": "Natsu Sano" },
  { "jpName": "渋谷なつ", "name": "Natsu Shibuya" },
  { "jpName": "東條なつ", "name": "Natsu Tojo", "threadId": "1198159690186620949" },
  { "jpName": "篠崎菜都香", "name": "Natsuka Shinozaki" },
  { "jpName": "星乃夏月", "name": "Natsuki Hoshino" },
  { "jpName": "如月夏希", "name": "Natsuki Kisaragi" },
  { "jpName": "水川菜月", "name": "Natsuki Mizukawa", "threadId": "1447618207601918116" },
  { "jpName": "竹内夏希", "name": "Natsuki Takeuchi" },
  { "jpName": "和香なつき", "name": "Natsuki Waka", "threadId": "1331061619492651061" },
  { "jpName": "碓氷なつめ", "name": "Natsume Usui" },
  { "jpName": "星野ねね", "name": "Nene Hoshino", "threadId": "1428410527343710248" },
  { "jpName": "三澄寧々", "name": "Nene Misumi", "threadId": "1404492194408169503" },
  { "jpName": "篠宮ねね", "name": "Nene Shionmiya" },
  { "jpName": "田中ねね", "name": "Nene Tanaka", "threadId": "1211094141585588364" },
  { "jpName": "吉高寧々", "name": "Nene Yoshitaka", "threadId": "1201893195185926184" },
  { "jpName": "初愛ねんね", "name": "Nenne Ui" },
  { "jpName": "Nia（伊東める）", "name": "Nia" },
  { "jpName": "二代目乱田舞", "name": "Nidaime Randa Mai" },
  { "jpName": "川越にこ", "name": "Niko Kawagoe", "threadId": "1197549563502931978" },
  { "jpName": "西村ニーナ", "name": "Nina Nishimura", "threadId": "1213305836848287764" },
  { "jpName": "天晴乃愛", "name": "Noa Amaharu" },
  { "jpName": "天乃のあ", "name": "Noa Amano" },
  { "jpName": "新木希空", "name": "Noa Araki", "threadId": "1343620238914228224" },
  { "jpName": "芦田希空", "name": "Noa Ashida", "threadId": "1448622218711007273" },
  { "jpName": "栄川乃亜", "name": "Noa Eikawa", "threadId": "1216567312816148510" },
  { "jpName": "羽月乃蒼", "name": "Noa Haruna", "threadId": "1249129238683193417" },
  { "jpName": "八神のえみ", "name": "Noemi Yagami" },
  { "jpName": "本田のえる", "name": "Noeru Honda" },
  { "jpName": "雪乃える", "name": "Noeru Yukino" },
  { "jpName": "藤川乃風", "name": "Nokaze Fujikawa" },
  { "jpName": "日菜々はのん", "name": "Non Hinanaha" },
  { "jpName": "野々浦暖", "name": "Non Nonoura", "threadId": "1197577512318947358" },
  { "jpName": "小花のん", "name": "Non Ohana", "threadId": "1210977084885700708" },
  { "jpName": "結城のの", "name": "Nono Yuuki" },
  { "jpName": "有加里ののか", "name": "Nonoka Akari", "threadId": "1200147026558603355" },
  { "jpName": "川口乃々花", "name": "Nonoka Kawaguchi" },
  { "jpName": "川口乃々華", "name": "Nonoka Kawaguchi" },
  { "jpName": "佐藤ののか（加藤ももか）", "name": "Nonoka Sato" },
  { "jpName": "有村のぞみ", "name": "Nozomi Arimura", "threadId": "1270272104012709939" },
  { "jpName": "石原希望", "name": "Nozomi Ishihara", "threadId": "1197543560262717450" },
  { "jpName": "白浜のぞみ", "name": "Nozomi Shirahama", "threadId": "1197533350248861727" },
  { "jpName": "須原のぞみ", "name": "Nozomi Sugihara" },
  { "jpName": "美咲音", "name": "Oto Misaki" },
  { "jpName": "池上乙葉", "name": "Otoha Ikegami" },
  { "jpName": "乙葉らぶ", "name": "Rabu Otoha" },
  { "jpName": "一ノ瀬ラム", "name": "Ram Ichinose **newhalf**" },
  { "jpName": "姫野らん", "name": "Ran Himeno" },
  { "jpName": "神木蘭", "name": "Ran Kamiki", "threadId": "1313167104014417921" },
  { "jpName": "菊乃らん", "name": "Ran Kikuno", "threadId": "1355955322425966745" },
  { "jpName": "松野蘭", "name": "Ran Matsuno", "threadId": "1255372009773338715" },
  { "jpName": "皆川らん", "name": "Ran Minagawa" },
  { "jpName": "詩音乃らん", "name": "Ran Shiono" },
  { "jpName": "朝宮ラナ", "name": "Rana Asamiya", "threadId": "1249925709871321192" },
  { "jpName": "蘭華", "name": "Ranka", "threadId": "1233719124127912027" },
  { "jpName": "RARA", "name": "RARA", "threadId": "1216875347547652226"  },
  { "jpName": "安齋らら", "name": "Rara Anzai", "threadId": "1197768078512099440" },
  { "jpName": "工藤ララ", "name": "Rara Kudo" },
  { "jpName": "篠咲らら", "name": "Rara Shinozaki" },
  { "jpName": "丸石レア", "name": "Rea Maruishi", "threadId": "1216771553509769217"  },
  { "jpName": "丸最レア", "name": "Rea Marumo", "threadId": "1216771553509769217"  },
  { "jpName": "桜井れあ", "name": "Rea Sakurai", "threadId": "1440003005650047048" },
  { "jpName": "二見れい", "name": "Rei Futami" },
  { "jpName": "市原玲", "name": "Rei Ichihara" },
  { "jpName": "神木麗", "name": "Rei Kamiki", "threadId": "1197470698118053918" },
  { "jpName": "木村玲衣", "name": "Rei Kimura", "threadId": "1280712988000518204" },
  { "jpName": "黒島玲衣", "name": "Rei Kuroshima", "threadId": "1198730293054550106" },
  { "jpName": "久留木玲", "name": "Rei Kuruki", "threadId": "1198526433396543559" },
  { "jpName": "美澄玲衣", "name": "Rei Misumi", "threadId": "1261648661302083665" },
  { "jpName": "白鳥怜", "name": "Rei Shiratori" },
  { "jpName": "川上れいあ", "name": "Reia Kawakami" },
  { "jpName": "川上れいあ", "name": "Reia Kawakami" },
  { "jpName": "夏目玲香", "name": "Reika Natsume", "threadId": "1410381501111210177" },
  { "jpName": "重盛れいか", "name": "Reika Shigemori", "threadId": "1457759054670594089" },
  { "jpName": "武田怜香", "name": "Reika Takeda", "threadId": "1247470562016755733" },
  { "jpName": "豊田怜花", "name": "Reika Toyota", "threadId": "1461820179041484820" },
  { "jpName": "若菜れいか", "name": "Reika Wakana" },
  { "jpName": "小早川怜子", "name": "Reiko Kobayakawa", "threadId": "1211168714183934004" },
  { "jpName": "峰玲子", "name": "Reiko Mine", "threadId": "1340672923433697363" },
  { "jpName": "澤村レイコ（高坂保奈美、高坂ますみ）", "name": "Reiko Sawamura" },
  { "jpName": "瀬尾礼子", "name": "Reiko Seo", "threadId": "1340683899768016906" },
  { "jpName": "長谷川れいみ", "name": "Reimi Hasegawa" },
  { "jpName": "壇玲奈", "name": "Reina Dan", "threadId": "1462830365529084037" },
  { "jpName": "黒木れいな", "name": "Reina Kuroki" },
  { "jpName": "桜樹玲奈", "name": "Reina Sakuragi" },
  { "jpName": "藤井レイラ", "name": "Reira Fujii" },
  { "jpName": "赤目レイラン", "name": "Reiran Akame", "threadId": "1315958451729465415" },
  { "jpName": "佐久間れみ", "name": "Remi Sakuma" },
  { "jpName": "涼森れむ", "name": "Remu Suzumori", "threadId": "1197535257927368754" },
  { "jpName": "綾波れん", "name": "Ren Ayanami" },
  { "jpName": "五条恋", "name": "Ren Gojo", "threadId": "1197545501004923044" },
  { "jpName": "響蓮", "name": "Ren Hibiki", "threadId": "1197553340305920121" },
  { "jpName": "溝端恋", "name": "Ren Mizohata" },
  { "jpName": "芹沢恋", "name": "Ren Serizawa" },
  { "jpName": "あおいれな", "name": "Rena Aoi" },
  { "jpName": "吹石れな", "name": "Rena Fukiishi", "threadId": "1340687616747507835" },
  { "jpName": "双葉れぇな", "name": "Rena Futaba", "threadId": "1268896330562928810" },
  { "jpName": "児玉れな", "name": "Rena Kodama" },
  { "jpName": "牧野怜奈", "name": "Rena Makino" },
  { "jpName": "宮下玲奈", "name": "Rena Miyashita", "threadId": "1197544000182308995" },
  { "jpName": "桃園怜奈", "name": "Rena Momozono", "threadId": "1197554261161156628" },
  { "jpName": "石井恋花", "name": "Renka Ishii", "threadId": "1434934716733325422" },
  { "jpName": "佐伯れんか", "name": "Renka Saeki" },
  { "jpName": "柚木れんか", "name": "Renka Yuuki **newhalf**" },
  { "jpName": "清巳れの", "name": "Reno Kiyomi", "threadId": "1273177786047271006" },
  { "jpName": "紫城れの", "name": "Reno Shijou" },
  { "jpName": "藤咲れおな", "name": "Reona Fujisaki" },
  { "jpName": "藤沢麗央", "name": "Reona Fujisawa" },
  { "jpName": "霧島レオナ", "name": "Reona Kirishima" },
  { "jpName": "冨永れおな", "name": "Reona Tominaga" },
  { "jpName": "冨安れおな", "name": "Reona Tomiyasu" },
  { "jpName": "愛才りあ", "name": "Ria Aise", "threadId": "1315704481702350898" },
  { "jpName": "山手梨愛", "name": "Ria Yamate", "threadId": "1197545762981158963" },
  { "jpName": "吉沢梨亜", "name": "Ria Yoshizawa", "threadId": "1202278811497140244" },
  { "jpName": "夢川りあ", "name": "Ria Yumekawa" },
  { "jpName": "結月りあ", "name": "Ria Yuzuki", "threadId": "1197483487406600242" },
  { "jpName": "宮城りえ", "name": "Rie Miyagi", "threadId": "1197490735600115823" },
  { "jpName": "平岡里枝子", "name": "Rieko Hiraoka" },
  { "jpName": "渋沢りえる", "name": "Rieru Shibusawa" },
  { "jpName": "藤森里穂", "name": "Riho Fujimori", "threadId": "1211146379121139733" },
  { "jpName": "長谷川リホ", "name": "Riho Hasegawa" },
  { "jpName": "松本梨穂", "name": "Riho Matsumoto", "threadId": "1197554784752893963" },
  { "jpName": "宍戸里帆", "name": "Riho Shishido", "threadId": "1197529262706659449" },
  { "jpName": "白橋りほ", "name": "Riho Sirahashi", "threadId": "1343875651580465254" },
  { "jpName": "高橋りほ", "name": "Riho Takahashi" },
  { "jpName": "飛鳥りいな", "name": "Riina Asuka" },
  { "jpName": "如月りいさ", "name": "Riisa Kisaragi", "threadId": "1214425449631977522" },
  { "jpName": "逢見リカ", "name": "Rika Aimi", "threadId": "1398316354112716952" },
  { "jpName": "麻里梨夏", "name": "Rika Mari" },
  { "jpName": "夏空りか", "name": "Rika Natsuzora", "threadId": "1293017936902098994" },
  { "jpName": "佐野りか", "name": "Rika Sano" },
  { "jpName": "椿りか", "name": "Rika Tsubaki", "threadId": "1205713139652370482" },
  { "jpName": "臼井リカ", "name": "Rika Usui", "threadId": "1340675121513496709" },
  { "jpName": "ゆめ莉りか", "name": "Rika Yumeri", "threadId": "1335040365480116355" },
  { "jpName": "小野六花", "name": "Rikka Ono", "threadId": "1202520242933465158" },
  { "jpName": "星乃莉子", "name": "Riko Hoshino", "threadId": "1197546955581169755" },
  { "jpName": "香澄りこ", "name": "Riko Kasumi" },
  { "jpName": "百瀬りこ", "name": "Riko Momose" },
  { "jpName": "小野崎りこ", "name": "Riko Onozaki" },
  { "jpName": "佐藤りこ", "name": "Riko Sato" },
  { "jpName": "白葉りこ", "name": "Riko Shiroha" },
  { "jpName": "遥香りく", "name": "Riku Haruka" },
  { "jpName": "市川りく", "name": "Riku Ichikawa" },
  { "jpName": "芹奈りく", "name": "Riku Serina" },
  { "jpName": "新井リマ", "name": "Rima Arai", "threadId": "1197895099456180224" },
  { "jpName": "真白りま", "name": "Rima Mashiro" },
  { "jpName": "桃野りみ", "name": "Rimi Momono" },
  { "jpName": "弓乃りむ", "name": "Rimu Yumino", "threadId": "1332599080077230080" },
  { "jpName": "天沢りん", "name": "Rin Amasawa", "threadId": "1255177272315346996" },
  { "jpName": "朝日りん", "name": "Rin Asahi" },
  { "jpName": "東凛", "name": "Rin Azuma" },
  { "jpName": "八蜜凛", "name": "Rin Hachimitsu", "threadId": "1197527219526959165"  },
  { "jpName": "本田凛", "name": "Rin Honda" },
  { "jpName": "吉良りん", "name": "Rin Kira" },
  { "jpName": "宮崎リン", "name": "Rin Miyazaki" },
  { "jpName": "夏木りん", "name": "Rin Natsuki", "threadId": "1204458227215900732" },
  { "jpName": "岡江凛", "name": "Rin Okae", "threadId": "1340689399205331164" },
  { "jpName": "凰華りん", "name": "Rin Ouka", "threadId": "1204458227215900732" },
  { "jpName": "咲々原リン", "name": "Rin Sasahara" },
  { "jpName": "瀬緒凛", "name": "Rin Seo", "threadId": "1247092084905869323" },
  { "jpName": "鈴の家りん", "name": "Rin Suzunoya", "threadId": "1197833116585308201" },
  { "jpName": "卯佐美りん", "name": "Rin Usami" },
  { "jpName": "与田りん", "name": "Rin Yoda", "threadId": "1259348612148625489" },
  { "jpName": "伊藤りな", "name": "Rina Itou" },
  { "jpName": "岩瀬りな", "name": "Rina Iwase" },
  { "jpName": "雅子りな", "name": "Rina Kago", "threadId": "1277975488194805952" },
  { "jpName": "風間リナ", "name": "Rina Kazama" },
  { "jpName": "高瀬りな", "name": "Rina Takase", "threadId": "1209883555463962664" },
  { "jpName": "小野りんか", "name": "Rinka Ono", "threadId": "1340685004560269423" },
  { "jpName": "望月りんね", "name": "Rinne Mitsuki", "threadId": "1371520811638194277" },
  { "jpName": "満島りの", "name": "Rino Mitsushima" },
  { "jpName": "中条りの", "name": "Rino Nakajou" },
  { "jpName": "酒井莉乃", "name": "Rino Sakai", "threadId": "1237580789361676413" },
  { "jpName": "桜乃りの", "name": "Rino Sakurano", "threadId": "1338565944644997273" },
  { "jpName": "矢嶋希里乃", "name": "Rino Yajimaki" },
  { "jpName": "結城りの", "name": "Rino Yuki", "threadId": "1197522146134605824" },
  { "jpName": "RINOA", "name": "RINOA", "threadId": "1460297580213964934" },
  { "jpName": "朝妃りお（朝日りお）", "name": "Rio Asahi", "threadId": "1199256467442774116" },
  { "jpName": "春澤りお", "name": "Rio Harusawa" },
  { "jpName": "栗山莉緒", "name": "Rio Kuriyama", "threadId": "1197494913563099186" },
  { "jpName": "宮地莉央", "name": "Rio Miyachi", "threadId": "1346138955959242752" },
  { "jpName": "水城リオ", "name": "Rio Mizuki" },
  { "jpName": "緒川りお", "name": "Rio Ogawa" },
  { "jpName": "流川莉央", "name": "Rio Rukawa", "threadId": "1343613722693861487" },
  { "jpName": "坂本りお", "name": "Rio Sakamoto" },
  { "jpName": "泉りおん", "name": "Rion Izumi" },
  { "jpName": "桜井リオン", "name": "Rion Sakurai" },
  { "jpName": "白咲璃音", "name": "Rion Shirosaki" },
  { "jpName": "広瀬りおな", "name": "Riona Hirose", "threadId": "1461825595959939164"  },
  { "jpName": "真奈りおな", "name": "Riona Mana" },
  { "jpName": "愛葉りり", "name": "Riri Aiba" },
  { "jpName": "愛望莉里", "name": "Riri Aimochi" },
  { "jpName": "七ツ森りり", "name": "Riri Nanatsumori", "threadId": "1197547333584424970" },
  { "jpName": "岡本莉里", "name": "Riri Okamoto" },
  { "jpName": "氷堂りりあ", "name": "Riria Byoudou" },
  { "jpName": "梨々花", "name": "Ririka" },
  { "jpName": "天羽りりか", "name": "Ririka Amau", "threadId": "1303159088926163064" },
  { "jpName": "江崎リリカ", "name": "Ririka Ezaki" },
  { "jpName": "鬼頭りりか", "name": "Ririka Kitou" },
  { "jpName": "松本莉々加", "name": "Ririka Matsumoto" },
  { "jpName": "月城りり香", "name": "Ririka Tsukishiro", "threadId": "1371517029525491843" },
  { "jpName": "ゆめ莉りか", "name": "Ririka Yume" },
  { "jpName": "木下凛々子", "name": "Ririko Kinoshita", "threadId": "1199416956059656213" },
  { "jpName": "朝野りる", "name": "Riru Asano" },
  { "jpName": "壇凛沙", "name": "Risa Dan" },
  { "jpName": "森沢リサ", "name": "Risa Morisawa" },
  { "jpName": "佐藤里釆", "name": "Rito Satou" },
  { "jpName": "長澤りつ", "name": "Ritsu Nagase" },
  { "jpName": "花柳里葎子", "name": "Ritsuko Hanayagi" },
  { "jpName": "長谷川律子", "name": "Ritsuko Hasegawa" },
  { "jpName": "永田莉雨", "name": "Riu Nagata" },
  { "jpName": "柊るい", "name": "Rui Hiiragi" },
  { "jpName": "妃月るい", "name": "Rui Hizuki" },
  { "jpName": "一宮るい", "name": "Rui Ichimiya", "threadId": "1346140693101547530" },
  { "jpName": "宮本留衣", "name": "Rui Miyamoto", "threadId": "1255553994521313372" },
  { "jpName": "望乃るい", "name": "Rui Mochino", "threadId": "1358854168449646755" },
  { "jpName": "七瀬るい", "name": "Rui Nanase" },
  { "jpName": "菜月るい", "name": "Rui Natsuki" },
  { "jpName": "音琴るい", "name": "Rui Negoto" },
  { "jpName": "瀬下るい", "name": "Rui Seshita" },
  { "jpName": "紫堂るい", "name": "Rui Shido", "threadId": "1367670094745960549" },
  { "jpName": "篠宮るい", "name": "Rui Shinomiya", "threadId": "1428950906128437298" },
  { "jpName": "涼音るい", "name": "Rui Suzune", "threadId": "1368976644303360021" },
  { "jpName": "都月るいさ", "name": "Ruisa Totsuki", "threadId": "1200793365021741167" },
  { "jpName": "愛田るか", "name": "Ruka Aida", "threadId": "1363947489660502026" },
  { "jpName": "愛瀬るか", "name": "Ruka Aise" },
  { "jpName": "稲場るか", "name": "Ruka Inaba" },
  { "jpName": "糸井瑠花", "name": "Ruka Itoi", "threadId": "1305693807714762752" },
  { "jpName": "宮瀬るか", "name": "Ruka Miyase", "threadId": "1303157752331505684" },
  { "jpName": "水崎瑠華", "name": "Ruka Mizusaki" },
  { "jpName": "吉岡ルミカ", "name": "Rumika Yoshioka" },
  { "jpName": "天音るな", "name": "Runa Amane" },
  { "jpName": "心実るな", "name": "Runa Kokomi" },
  { "jpName": "月乃ルナ", "name": "Runa Tsukino" },
  { "jpName": "月城るな", "name": "Runa Tsukishiro" },
  { "jpName": "小鳩るり", "name": "Ruri Kobato" },
  { "jpName": "西條るり", "name": "Ruri Saijo", "threadId": "1214234281774161940" },
  { "jpName": "有栖るる", "name": "Ruru Arisu" },
  { "jpName": "春乃るる", "name": "Ruru Haruno" },
  { "jpName": "羽川るる", "name": "Ruru Ukawa", "threadId": "1440001238694629439" },
  { "jpName": "十束るう", "name": "Ruu Totsuka", "threadId": "1200504449181949952" },
  { "jpName": "桜りょうか", "name": "Ryoka Sakura", "threadId": "1371800548906631288" },
  { "jpName": "りょう", "name": "Ryou" },
  { "jpName": "愛弓りょう", "name": "Ryou Ayumi", "threadId": "1198471611272151131" },
  { "jpName": "百合良", "name": "Ryou Yuri" },
  { "jpName": "秋元さちか", "name": "Sachika Akimoto" },
  { "jpName": "佐知子", "name": "Sachiko", "threadId": "1216289750865149963" },
  { "jpName": "椿紗枝", "name": "Sae Tsubaki" },
  { "jpName": "矢野沙衣", "name": "Sae Yano" },
  { "jpName": "五味紗瑛子", "name": "Saeko Gomi" },
  { "jpName": "河北彩伽（河北彩花）", "name": "Saika Kawakita", "threadId": "1197552291134312508" },
  { "jpName": "相河沙季", "name": "Saki Aikawa" },
  { "jpName": "三上咲", "name": "Saki Mikami", "threadId": "1401995417721507892" },
  { "jpName": "美泉咲", "name": "Saki Mizumi" },
  { "jpName": "夏芽さき", "name": "Saki Natsume" },
  { "jpName": "大石紗季", "name": "Saki Oishi", "threadId": "1340689946335383584" },
  { "jpName": "奥田咲", "name": "Saki Okuda", "threadId": "1197531916564447242" },
  { "jpName": "佐久良咲希", "name": "Saki Sakura" },
  { "jpName": "佐々木さき", "name": "Saki Sasaki", "threadId": "1197570780167417998" },
  { "jpName": "清野咲", "name": "Saki Seino", "threadId": "1412100949098365050" },
  { "jpName": "楪さき", "name": "Saki Yuzuriha" },
  { "jpName": "伊織さくら", "name": "Sakura Iori" },
  { "jpName": "川口桜", "name": "Sakura Kawaguchi", "threadId": "1401953614796161065" },
  { "jpName": "胡桃さくら", "name": "Sakura Kurumi", "threadId": "1213459855017386024" },
  { "jpName": "岬さくら", "name": "Sakura Misaki", "threadId": "1357492952838180974"  },
  { "jpName": "三田サクラ", "name": "Sakura Mita" },
  { "jpName": "水卜さくら", "name": "Sakura Miura", "threadId": "1197528764041666623" },
  { "jpName": "紗月さくら", "name": "Sakura Satsuki", "threadId": "1421496512969441280" },
  { "jpName": "辻さくら", "name": "Sakura Tsuji" },
  { "jpName": "与田さくら", "name": "Sakura Yoda" },
  { "jpName": "馬場紗奈", "name": "Sana Baba" },
  { "jpName": "生田さな", "name": "Sana Ikuta", "threadId": "1444716037093326948" },
  { "jpName": "純白彩永", "name": "Sana Mashiro", "threadId": "1379113244848947250" },
  { "jpName": "松永さな", "name": "Sana Matsunaga" },
  { "jpName": "海月さな", "name": "Sana Mitsuki" },
  { "jpName": "上田紗奈", "name": "Sana Ueda", "threadId": "1280947333470879896" },
  { "jpName": "栗原早苗", "name": "Sanae Kurihara" },
  { "jpName": "金城さおり", "name": "Saori Kinjou" },
  { "jpName": "愛沢さら", "name": "Sara Aizawa" },
  { "jpName": "天川そら", "name": "Sara Amakawa" },
  { "jpName": "二羽紗愛", "name": "Sara Futaba", "threadId": "1214242286527848508" },
  { "jpName": "一色さら", "name": "Sara Isshiki", "threadId": "1197529481515106314" },
  { "jpName": "伊東沙蘭", "name": "Sara Itou" },
  { "jpName": "桐谷紗蘭", "name": "Sara Kiritani" },
  { "jpName": "真白さら", "name": "Sara Mashiro" },
  { "jpName": "當真さら", "name": "Sara Touma" },
  { "jpName": "月妃さら", "name": "Sara Tsukihi" },
  { "jpName": "宇流木さらら", "name": "Sarara Uruki", "threadId": "1217122345701998612" },
  { "jpName": "香坂紗梨", "name": "Sari Kousaka" },
  { "jpName": "東畑さりな", "name": "Sarina Higashihata" },
  { "jpName": "百永さりな", "name": "Sarina Momonaga", "threadId": "1213464695680278559" },
  { "jpName": "美丘さとみ", "name": "Satomi Mioka", "threadId": "1330740298615361576" },
  { "jpName": "宮本聡美", "name": "Satomi Miyamoto", "threadId": "1204262127662137405" },
  { "jpName": "神村さつき", "name": "Satsuki Kamimura" },
  { "jpName": "桐岡さつき", "name": "Satsuki Kirioka", "threadId": "1340678588663337032" },
  { "jpName": "豊岡さつき", "name": "Satsuki Toyooka" },
  { "jpName": "山下紗和", "name": "Sawa Yamashita", "threadId": "1285933791130685440" },
  { "jpName": "塚本さや", "name": "Saya Tsukamoto", "threadId": "1401951987464929291" },
  { "jpName": "紗弥佳", "name": "Sayaka", "threadId": "1340639429525508138" },
  { "jpName": "藤之木さやか", "name": "Sayaka Fujinoki **AI**" },
  { "jpName": "美ノ辺さやか", "name": "Sayaka Minobe", "threadId": "1340687065389596813" },
  { "jpName": "雅さやか", "name": "Sayaka Miyabi" },
  { "jpName": "南條彩", "name": "Sayaka Nanjo", "threadId": "1252460376834965615" },
  { "jpName": "仁藤さや香", "name": "Sayaka Nito" },
  { "jpName": "乙白さやか", "name": "Sayaka Otoshiro", "threadId": "1357619746388049953" },
  { "jpName": "寺門沙耶香", "name": "Sayaka Terakado" },
  { "jpName": "七原さゆ", "name": "Sayu Nanahara", "threadId": "1231537979839873074" },
  { "jpName": "葉山さゆり", "name": "Sayuri Hayama", "threadId": "1206968450925469696" },
  { "jpName": "佐伯紗優梨", "name": "Sayuri Saeki" },
  { "jpName": "佐野星彩", "name": "Seia Sano" },
  { "jpName": "能城星華", "name": "Seika Noujou" },
  { "jpName": "金森聖良", "name": "Seira Kanamori" },
  { "jpName": "華月星那", "name": "Seina Katsuki", "threadId": "1351227889965727815" },
  { "jpName": "久和原せいら", "name": "Seira Kuwahara" },
  { "jpName": "香澄せな", "name": "Sena Kasumi", "threadId": "1355912252280148078" },
  { "jpName": "瀬那ルミナ", "name": "Sena Rumina" },
  { "jpName": "倖月セラ", "name": "Sera Kozuki", "threadId": "1340668068489072684" },
  { "jpName": "新セリナ", "name": "Serina Arata" },
  { "jpName": "堤セリナ", "name": "Serina Tsutsumi" },
  { "jpName": "臼井瀬理奈", "name": "Serina Usui" },
  { "jpName": "花咲しほ", "name": "Shiho Hanasaki", "threadId": "1461625917683273860" },
  { "jpName": "森下志歩", "name": "Shiho Morishita" },
  { "jpName": "平手志帆梨", "name": "Shihori Hirate" },
  { "jpName": "佐藤しお", "name": "Shio Sato" },
  { "jpName": "知花しおん", "name": "Shion Chika" },
  { "jpName": "南紫音", "name": "Shion Minami" },
  { "jpName": "夕美しおん", "name": "Shion Yumi", "threadId": "1211981146418708520" },
  { "jpName": "香澄しおり", "name": "Shiori Kasumi" },
  { "jpName": "倉木しおり", "name": "Shiori Kuraki", "threadId": "1411381886990946496" },
  { "jpName": "京香栞", "name": "Shiori Kyouka", "threadId": "1376871083189207061" },
  { "jpName": "美波汐里", "name": "Shiori Minami", "threadId": "1201524700610830428" },
  { "jpName": "七瀬栞", "name": "Shiori Nanase" },
  { "jpName": "野上しおり", "name": "Shiori Nogami" },
  { "jpName": "塚田しおり", "name": "Shiori Tsukada", "threadId": "1211281720440258591" },
  { "jpName": "塚田詩織", "name": "Shiori Tsukada", "threadId": "1211281720440258591" },
  { "jpName": "依本しおり", "name": "Shiori Yorimoto", "threadId": "1298082521241751562" },
  { "jpName": "汐世（有栖花あか）", "name": "Shiose", "threadId": "1197545416921718804" },
  { "jpName": "しらこ", "name": "Shirako" },
  { "jpName": "しらたま", "name": "Shiratama", "threadId": "1462828024528502805" },
  { "jpName": "瀧本雫葉", "name": "Shizuha Takimoto", "threadId": "1197558784860622991" },
  { "jpName": "静河", "name": "Shizuka", "threadId": "1355094828345462845" },
  { "jpName": "碧波しずく", "name": "Shizuku Aonami" },
  { "jpName": "朝日しずく", "name": "Shizuku Asahi" },
  { "jpName": "川上しずく", "name": "Shizuku Kawakami", "threadId": "1340671832738627634" },
  { "jpName": "結城雫", "name": "Shizuku Yuuki" },
  { "jpName": "松本翔子", "name": "Shoko Matsumoto", "threadId": "1340682544655368323" },
  { "jpName": "高橋しょう子", "name": "Shoko Takahashi", "threadId": "1197879253170147349" },
  { "jpName": "赤瀬尚子", "name": "Shouko Akase" },
  { "jpName": "秋山祥子", "name": "Shouko Akiyama" },
  { "jpName": "飯塚寿維", "name": "Shui Iizuka" },
  { "jpName": "あやみ旬果", "name": "Shunka Ayami", "threadId": "1210588195214073927" },
  { "jpName": "宮ノ木しゅんか", "name": "Shunka Miyanoki" },
  { "jpName": "跡美しゅり", "name": "Shuri Atomi", "threadId": "1359423621575217152" },
  { "jpName": "光森珠理", "name": "Shuri Mitsumori" },
  { "jpName": "山口珠理", "name": "Shuri Yamaguchi" },
  { "jpName": "片寄しゅうか", "name": "Shuuka Katayose" },
  { "jpName": "Soa", "name": "Soa", "threadId": "1428919236109140068" },
  { "jpName": "新川空", "name": "Sora Arakawa", "threadId": "1397471399530205338" },
  { "jpName": "絵恋空", "name": "Sora Eren", "threadId": "1198854564246470667" },
  { "jpName": "本多そら", "name": "Sora Honda" },
  { "jpName": "南乃そら", "name": "Sora Minamino" },
  { "jpName": "仲川そら", "name": "Sora Nakagawa" },
  { "jpName": "七瀬そら", "name": "Sora Nanase" },
  { "jpName": "椎名そら", "name": "Sora Shiina", "threadId": "1247926517707702354" },
  { "jpName": "宇佐美すい", "name": "Sui Usami" },
  { "jpName": "月野江すい", "name": "Sui Tsukinoe", "threadId": "1274196693637922847" },
  { "jpName": "早瀬すみれ", "name": "Sumire Hayase" },
  { "jpName": "一ノ瀬菫", "name": "Sumire Ichinose" },
  { "jpName": "倉本すみれ", "name": "Sumire Kuramoto", "threadId": "1197935503270481960" },
  { "jpName": "黒川すみれ", "name": "Sumire Kurokawa", "threadId": "1207517925150294148" },
  { "jpName": "水川スミレ", "name": "Sumire Mizukawa", "threadId": "1199111642957500426"  },
  { "jpName": "鷲見すみれ", "name": "Sumire Sumi" },
  { "jpName": "滝川すみれ", "name": "Sumire Takikawa", "threadId": "1348696675228586025" },
  { "jpName": "九井スナオ", "name": "Sunao Kokonoi", "threadId": "1317549869505839175" },
  { "jpName": "愛川すず", "name": "Suzu Aikawa" },
  { "jpName": "愛宝すず", "name": "Suzu Akane", "threadId": "1197555106737037443" },
  { "jpName": "天宮すず", "name": "Suzu Amamiya", "threadId": "1374053348294131763" },
  { "jpName": "あずま鈴", "name": "Suzu Azuma" },
  { "jpName": "本庄鈴", "name": "Suzu Honjo", "threadId": "1197476597926735902" },
  { "jpName": "井手茉涼", "name": "Suzu Idema" },
  { "jpName": "松岡すず", "name": "Suzu Matsuoka", "threadId": "1206494123507322880" },
  { "jpName": "NAO（美竹すず）", "name": "Suzu Mitake" },
  { "jpName": "源すず（月奈リカ、綾瀬ゆうか、北島りな、三須みずほ）", "name": "Suzu Miyamoto" },
  { "jpName": "もなみ鈴", "name": "Suzu Monami", "threadId": "1281045271714729984" },
  { "jpName": "永野鈴", "name": "Suzu Nagano", "threadId": "1197527699841884271" },
  { "jpName": "井手茉涼", "name": "Suzu Otohami" },
  { "jpName": "音無鈴", "name": "Suzu Otonashi", "threadId": "1395084537389912180"  },
  { "jpName": "美乃すずめ", "name": "Suzume Mino", "threadId": "1197557605183279195"  },
  { "jpName": "山田鈴奈", "name": "Suzuna Yamada", "threadId": "1381665897155920034" },
  { "jpName": "桐谷すずね", "name": "Suzune Kiritani", "threadId": "1320885871859466240" },
  { "jpName": "綾瀬天", "name": "Ten Ayase", "threadId": "1199279905234497638" },
  { "jpName": "蓮見天", "name": "Ten Hasumi" },
  { "jpName": "森田哲矢", "name": "Tetsuya Morita" },
  { "jpName": "ティア", "name": "Tia", "threadId": "1215848534109323475" },
  { "jpName": "七海ティナ", "name": "Tina Nanami", "threadId": "1201898195387416578" },
  { "jpName": "聖璃とあ", "name": "Toa Hijiri" },
  { "jpName": "清宮仁愛", "name": "Toa Kiyomiya", "threadId": "1213500326984941598" },
  { "jpName": "優木とあ", "name": "Toa Yuki", "threadId": "1242314965227143179" },
  { "jpName": "白岩冬萌", "name": "Tomo Shiraiwa", "threadId": "1285448998194511945" },
  { "jpName": "神坂朋子", "name": "Tomoko Kamisaka" },
  { "jpName": "岡西友美", "name": "Tomomi Okanishi", "threadId": "1216855753311129701" },
  { "jpName": "谷口柊樺", "name": "Touka Taniguchi" },
  { "jpName": "並木塔子", "name": "Touko Namiki" },
  { "jpName": "吉永塔子", "name": "Touko Yoshinaga", "threadId": "1340688241191419986" },
  { "jpName": "槇原とわ", "name": "Towa Makihara" },
  { "jpName": "千川とわ", "name": "Towa Sengawa", "threadId": "1238006428577562645" },
  { "jpName": "酒巻十和美", "name": "Towami Sakamaki" },
  { "jpName": "花衣つばき", "name": "Tsubaki Hanai", "threadId": "1444390598403555510"  },
  { "jpName": "加藤ツバキ（夏樹カオル）", "name": "Tsubaki Kato" },
  { "jpName": "三宮つばき", "name": "Tsubaki Sannomiya", "threadId": "1197568006985887916" },
  { "jpName": "東雲つばき", "name": "Tsubaki Shinonome" },
  { "jpName": "白石椿", "name": "Tsubaki Shiraishi" },
  { "jpName": "天海つばさ", "name": "Tsubasa Amami", "threadId": "1203967246221840475" },
  { "jpName": "八乃つばさ", "name": "Tsubasa Hachino" },
  { "jpName": "つぼみ", "name": "Tsubomi", "threadId": "1213323774741712897" },
  { "jpName": "望月つぼみ", "name": "Tsubomi Mochizuki", "threadId": "1270338133430374410" },
  { "jpName": "相田つぐみ", "name": "Tsugumi Aida" },
  { "jpName": "堀川緒美", "name": "Tsugumi Horikawa" },
  { "jpName": "葵つかさ", "name": "Tsukasa Aoi", "threadId": "1197546287663423549" },
  { "jpName": "蒲生司紗", "name": "Tsukasa Gamou" },
  { "jpName": "響つかさ", "name": "Tsukasa Hibiki", "threadId": "1198465489068883988" },
  { "jpName": "野々宮つかさ", "name": "Tsukasa Nonomiya" },
  { "jpName": "斉藤月乃", "name": "Tsukino Saitou" },
  { "jpName": "水樹つくし", "name": "Tsukushi Mizuki" },
  { "jpName": "明里つむぎ", "name": "Tsumugi Akari", "threadId": "1198733071260856381" },
  { "jpName": "成田つむぎ", "name": "Tsumugi Narita" },
  { "jpName": "下川紬", "name": "Tsumugi Shimokawa" },
  { "jpName": "佐久間つな", "name": "Tsuna Sakuma" },
  { "jpName": "天神羽衣", "name": "Ui Amagami", "threadId": "1358871550463447211" },
  { "jpName": "涼風うい", "name": "Ui Suzukaze", "threadId": "1331062412496994304" },
  { "jpName": "のあういか", "name": "Uika Noa" },
  { "jpName": "倉持侑未", "name": "Umi Kuramochi" },
  { "jpName": "夏川うみ", "name": "Umi Natsukawa" },
  { "jpName": "及川うみ", "name": "Umi Oikawa", "threadId": "1312576454608814081" },
  { "jpName": "八掛うみ", "name": "Umi Yatsugake", "threadId": "1197535864499208212" },
  { "jpName": "南沢海香", "name": "Umika Minamisawa", "threadId": "1328523458535096391" },
  { "jpName": "しおかわ雲丹", "name": "Uni Shiokawa" },
  { "jpName": "うんぱい", "name": "Unpai", "threadId": "1197563911566807100" },
  { "jpName": "あかね麗", "name": "Urara Akane", "threadId": "1230193188975804507" },
  { "jpName": "花音うらら", "name": "Urara Kanon", "threadId": "1214314066626089082" },
  { "jpName": "二階堂麗", "name": "Urara Nikaido", "threadId": "1230193188975804507" },
  { "jpName": "咲うらら", "name": "Urara Saku" },
  { "jpName": "百合咲うるみ", "name": "Urumi Yurisaki" },
  { "jpName": "潤うるる", "name": "Ururu Jun" },
  { "jpName": "橋下詩", "name": "Uta Hashimoto" },
  { "jpName": "響乃うた", "name": "Uta Hibino", "threadId": "1358481442560151682" },
  { "jpName": "三佳詩", "name": "Uta Miyoshi", "threadId": "1421075031231828068" },
  { "jpName": "鈴乃ウト", "name": "Uto Suzuno" },
  { "jpName": "潤うるる", "name": "Ururu Jun", "threadId": "1416091624693563462" },
  { "jpName": "梶尾羽歌", "name": "Waka Kajio" },
  { "jpName": "美園和花", "name": "Waka Misono", "threadId": "1212639234612011029" },
  { "jpName": "二宮和香", "name": "Waka Ninomiya" },
  { "jpName": "月見若葉", "name": "Wakaba Tsukimi", "threadId": "1208610316896960552" },
  { "jpName": "さくらわかな", "name": "Wakana Sakura", "threadId": "1340643951467692126" },
  { "jpName": "浦川紗凪", "name": "Wakana Urakawa" },
  { "jpName": "八森わか菜", "name": "Wakana Yamori", "threadId": "1197836532468437033" },
  { "jpName": "水原わこ", "name": "Wako Mizuhara", "threadId": "1381670377713045634" },
  { "jpName": "堀北わん", "name": "Wan Horikita" },
  { "jpName": "及川莉央", "name": "Wario Oikawa" },
  { "jpName": "わさび", "name": "Wasabi" },
  { "jpName": "浜辺やよい", "name": "Yayoi Hamabe", "threadId": "1341245061429723187" },
  { "jpName": "三葉やよい", "name": "Yayoi Mitsuha", "threadId": "1303157976672239626" },
  { "jpName": "柳田やよい", "name": "Yayoi Yanagida" },
  { "jpName": "守屋よしの", "name": "Yoshino Moriya", "threadId": "1374085933091262535" },
  { "jpName": "月雲よる", "name": "Yoru Tsukumo", "threadId": "1204087662554644551" },
  { "jpName": "小湊よつ葉", "name": "Yotsuha Kominato", "threadId": "1198741451270541435" },
  { "jpName": "水本葉", "name": "You Mitsumoto" },
  { "jpName": "川上ゆう（森野雫）", "name": "Yu Kawakami", "threadId": "1296766489629687830" },
  { "jpName": "流川夕", "name": "Yu Rukawa", "threadId": "1197846670524829776" },
  { "jpName": "篠田ゆう", "name": "Yu Shinoda" },
  { "jpName": "田野憂", "name": "Yu Tano", "threadId": "1236899188575572079" },
  { "jpName": "安心院結愛", "name": "Yua Anshinin" },
  { "jpName": "荒木ゆあ", "name": "Yua Araki **newhalf**" },
  { "jpName": "麻倉ゆあ", "name": "Yua Asakura" },
  { "jpName": "福田ゆあ", "name": "Yua Fukuda", "threadId": "1434888604886499409" },
  { "jpName": "今井ゆあ", "name": "Yua Imai" },
  { "jpName": "倉持結愛", "name": "Yua Kuramochi" },
  { "jpName": "三上悠亜", "name": "Yua Mikami", "threadId": "1197544687490301992" },
  { "jpName": "桃木結愛", "name": "Yua Momoki", "threadId": "1346182866437935125" },
  { "jpName": "七藤優亜", "name": "Yua Nanafuji" },
  { "jpName": "岡田優愛", "name": "Yua Okada", "threadId": "1351214627895382087" },
  { "jpName": "小野寺ゆあ", "name": "Yua Onodera" },
  { "jpName": "山口由愛", "name": "Yua Yamaguchi" },
  { "jpName": "甘夏联", "name": "Yui Amanatsu", "threadId": "1458497004559925313" },
  { "jpName": "浅風ゆい", "name": "Yui Asakaze", "threadId": "1385506025741746276" },
  { "jpName": "波多野結衣", "name": "Yui Hatano", "threadId": "1216602804559413330" },
  { "jpName": "柊優衣", "name": "Yui Hiiragi" },
  { "jpName": "神田ゆい", "name": "Yui Kanda" },
  { "jpName": "河合ゆい", "name": "Yui Kawai" },
  { "jpName": "木村結依", "name": "Yui Kimura" },
  { "jpName": "三浜唯", "name": "Yui Mihama", "threadId": "1223603813316038727" },
  { "jpName": "永瀬ゆい", "name": "Yui Nagase", "threadId": "1357986966968336607" },
  { "jpName": "佐山由依", "name": "Yui Sayama", "threadId": "1285437171280646225" },
  { "jpName": "白坂有以", "name": "Yui Shirasaka" },
  { "jpName": "辰巳ゆい", "name": "Yui Tatsumi", "threadId": "1330831609502629993" },
  { "jpName": "天馬ゆい", "name": "Yui Tenma", "threadId": "1311380303540912138" },
  { "jpName": "辻野ゆい", "name": "Yui Tsujino", "threadId": "1386121049652990082" },
  { "jpName": "若月由衣", "name": "Yui Wakatsuki" },
  { "jpName": "小野坂ゆいか", "name": "Yuika Onosaka", "threadId": "1239778924209242213" },
  { "jpName": "滝ゆいな", "name": "Yuina Taki", "threadId": "1269275633096196187" },
  { "jpName": "時藤ゆいな", "name": "Yuina Tokitō", "threadId": "1356294007990521966" },
  { "jpName": "岡部侑衣乃", "name": "Yuino Okabe" },
  { "jpName": "天ヶ瀬ゆか", "name": "Yuka Amagase", "threadId": "1340664975529607238" },
  { "jpName": "市井結夏", "name": "Yuka Ichii" },
  { "jpName": "三好佑香", "name": "Yuka Miyoshi", "threadId": "1361667825298706552" },
  { "jpName": "水野優香", "name": "Yuka Mizuno", "threadId": "1328121342339321948" },
  { "jpName": "村上悠華", "name": "Yuka Murakami", "threadId": "1197568766498836562" },
  { "jpName": "新妻ゆうか", "name": "Yuka Niizuma", "threadId": "1340641468456632320" },
  { "jpName": "大島優香", "name": "Yuka Oshima", "threadId": "1340664115927973929" },
  { "jpName": "多田有花", "name": "Yuka Tada", "threadId": "1311888301396856912" },
  { "jpName": "藤咲紫", "name": "Yukari Fujisaki" },
  { "jpName": "青山由希", "name": "Yuki Aoyama" },
  { "jpName": "柊ゆうき", "name": "Yuki Hiiragi" },
  { "jpName": "ひめ乃雪", "name": "Yuki Himeno" },
  { "jpName": "結城花乃羽", "name": "Yuki Kanoha", "threadId": "1442535006139322388" },
  { "jpName": "牧村柚希", "name": "Yuki Makimura" },
  { "jpName": "新田雪", "name": "Yuki Nitta", "threadId": "1208392761414258728" },
  { "jpName": "竹内有紀", "name": "Yuki Takeuchi", "threadId": "1216755364687777964" },
  { "jpName": "吉澤友貴", "name": "Yuki Yoshizawa", "threadId": "1260630216561131653" },
  { "jpName": "志田雪奈", "name": "Yukina Shida" },
  { "jpName": "那賀崎ゆきね", "name": "Yukine Nakasaki" },
  { "jpName": "松ゆきの", "name": "Yukino Matsu" },
  { "jpName": "凪宮ゆきの", "name": "Yukino Nagimiya" },
  { "jpName": "凪沙ゆきの", "name": "Yukino Nagisa" },
  { "jpName": "白木優子", "name": "Yuko Shiraki" },
  { "jpName": "麻美ゆま", "name": "Yuma Asami", "threadId": "1197556915165741176" },
  { "jpName": "神崎ゆま", "name": "Yuma Kanzaki" },
  { "jpName": "佐野ゆま", "name": "Yuma Sano", "threadId": "1206527940645625866" },
  { "jpName": "浅羽ゆめ", "name": "Yume Asaha" },
  { "jpName": "美音ゆめ", "name": "Yume Mion" },
  { "jpName": "西宮ゆめ", "name": "Yume Nishimiya", "threadId": "1197571469283180575" },
  { "jpName": "佐々木ゆめ", "name": "Yume Sasaki" },
  { "jpName": "安野由美", "name": "Yumi Anno" },
  { "jpName": "今村由美", "name": "Yumi Imamura" },
  { "jpName": "風間ゆみ", "name": "Yumi Kazama", "threadId": "1199398684497031300" },
  { "jpName": "虹村ゆみ", "name": "Yumi Nijimura", "threadId": "1257532235599450183" },
  { "jpName": "佐伯由美香", "name": "Yumika Saeki" },
  { "jpName": "杉本ゆみか", "name": "Yumika Sugimoto" },
  { "jpName": "出口結絆", "name": "Yuna Deguchi" },
  { "jpName": "長谷川夕奈", "name": "Yuna Hasegawa" },
  { "jpName": "日向由奈", "name": "Yuna Hinata", "threadId": "1293019152264728576" },
  { "jpName": "雛乃ゆな", "name": "Yuna Hinano", "threadId": "1224191393858322463" },
  { "jpName": "彩葉ゆな", "name": "Yuna Iroha" },
  { "jpName": "石川祐奈", "name": "Yuna Ishikawa", "threadId": "1445053074166255697" },
  { "jpName": "北乃ゆな", "name": "Yuna Kitano" },
  { "jpName": "三岳ゆうな", "name": "Yuna Mitake", "threadId": "1396924711119880214" },
  { "jpName": "小倉由菜", "name": "Yuna Ogura", "threadId": "1198164916633346139" },
  { "jpName": "沙月由奈", "name": "Yuna Satsuki" },
  { "jpName": "椎名ゆな", "name": "Yuna Shiina", "threadId": "1198747983655731371" },
  { "jpName": "春川ゆの", "name": "Yuno Harukawa", "threadId": "1462831056221900821" },
  { "jpName": "ほむら優音", "name": "Yuno Homura" },
  { "jpName": "一色ゆの", "name": "Yuno Isshiki" },
  { "jpName": "如月ゆの", "name": "Yuno Kisaragi" },
  { "jpName": "熊宮由乃", "name": "Yuno Kumamiya" },
  { "jpName": "大川釉埜", "name": "Yuno Ookawa" },
  { "jpName": "桜ゆの", "name": "Yuno Sakura", "threadId": "1318324466912202813" },
  { "jpName": "架乃ゆら", "name": "Yura Kano", "threadId": "1197548780824842292" },
  { "jpName": "工藤ゆら", "name": "Yura Kudo", "threadId": "1197568549099667537" },
  { "jpName": "すずめゆら", "name": "Yura Suzume" },
  { "jpName": "足立友梨", "name": "Yuri Adachi" },
  { "jpName": "安達夕莉", "name": "Yuri Adachi", "threadId": "1197548192322027600" },
  { "jpName": "広瀬ゆり", "name": "Yuri Hirose", "threadId": "1205720300260560976" },
  { "jpName": "本真ゆり", "name": "Yuri Honma", "threadId": "1311671998082060349" },
  { "jpName": "片平友理", "name": "Yuri Katahira", "threadId": "1381669475245621279" },
  { "jpName": "工藤ゆり", "name": "Yuri Kudo", "threadId": "1303735518038851595" },
  { "jpName": "推川ゆうり", "name": "Yuri Oshikawa", "threadId": "1211126109534687262" },
  { "jpName": "佐伯祐里", "name": "Yuri Saeki" },
  { "jpName": "紗々原ゆり", "name": "Yuri Sasahara" },
  { "jpName": "田所百合", "name": "Yuri Tadokoro" },
  { "jpName": "叶ユリア", "name": "Yuria Kanae" },
  { "jpName": "七宮ゆりあ", "name": "Yuria Nanamiya" },
  { "jpName": "大原ゆりあ", "name": "Yuria Ohara" },
  { "jpName": "吉根ゆりあ", "name": "Yuria Yoshine", "threadId": "1211272279481385041" },
  { "jpName": "葵百合香", "name": "Yurika Aoi" },
  { "jpName": "桧山ゆりか", "name": "Yurika Hiyama" },
  { "jpName": "相澤ゆりな", "name": "Yurina Aizawa" },
  { "jpName": "古泉優璃音", "name": "Yurine Koizumi" },
  { "jpName": "月野ゆりね", "name": "Yurine Tsukino", "threadId": "1340683325995745280" },
  { "jpName": "夕月ゆる", "name": "Yuru Yutsuki", "threadId": "1361364928933662771" },
  { "jpName": "麻倉憂", "name": "Yuu Asakura", "threadId": "1209116958486831145" },
  { "jpName": "未春ゆう", "name": "Yuu Mihara" },
  { "jpName": "笹本ゆう", "name": "Yuu Sasamoto", "threadId": "1252454507766480937" },
  { "jpName": "篠崎ゆう", "name": "Yuu Shinozaki" },
  { "jpName": "設楽ゆうひ", "name": "Yuuhi Shitara", "threadId": "1197554076842467368" },
  { "jpName": "新井優香", "name": "Yuuka Arai" },
  { "jpName": "千葉優花", "name": "Yuuka Chiba", "threadId": "1417167857552330782" },
  { "jpName": "舞岡結希", "name": "Yuuki Maioka" },
  { "jpName": "若葉結希", "name": "Yuuki Wakaba" },
  { "jpName": "姫川ゆうな（月城らん）", "name": "Yuuna Himekawa" },
  { "jpName": "白星優菜", "name": "Yuuna Shirahoshi" },
  { "jpName": "深田結梨", "name": "Yuuri Fukada" },
  { "jpName": "姫野ゆうり", "name": "Yuuri Himeno" },
  { "jpName": "生田優梨", "name": "Yuuri Ikuta" },
  { "jpName": "愛瀬ゆうり", "name": "Yuuri Manase" },
  { "jpName": "美咲ゆうり", "name": "Yuuri Misaki" },
  { "jpName": "菅原ゆうり", "name": "Yuuri Sugawara" },
  { "jpName": "桐香ゆうり", "name": "Yuuri Touka" },
  { "jpName": "一二三ゆぅり", "name": "Yuuri Utakane" },
  { "jpName": "藤田ゆず", "name": "Yuzu Fujita", "threadId": "1198052129915539496" },
  { "jpName": "皇ゆず", "name": "Yuzu Hoshi" },
  { "jpName": "芹沢ゆず", "name": "Yuzu Serizawa" },
  { "jpName": "新川ゆず", "name": "Yuzu Shinkawa" },
  { "jpName": "白川ゆず", "name": "Yuzu Shirakawa" },
  { "jpName": "桐島ゆず香", "name": "Yuzuka Kirishima" },
  { "jpName": "桃井ゆづき", "name": "Yuzuki Momoi" }
];

const ACTRESSES = ACTRESSES_FULL.reduce((acc, { jpName, name }) => {
  acc[jpName] = name;
  return acc;
}, {});

const THREAD_IDS = ACTRESSES_FULL.filter(act => act.threadId).map(({ name, threadId }) => ({ name, id: threadId }));

const getKey = (salt, keyMaterial) => crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"],
);

async function encryptMessage(password, message) {
  const encoder = new TextEncoder();
  const [ivArr, saltArr] = [crypto.getRandomValues(new Uint8Array(12)), crypto.getRandomValues(new Uint8Array(16))];
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
  const key = await getKey(saltArr, keyMaterial);
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv: ivArr }, key, encoder.encode(message));
  return JSON.stringify({ iv: Array.from(ivArr), salt: Array.from(saltArr), data: Array.from(new Uint8Array(data)) });
}

async function decryptMessage(password, encryptedDataString) {
  const { iv, salt, data } = JSON.parse(encryptedDataString);
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
  const key = await getKey(new Uint8Array(salt), keyMaterial);
  const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(iv) }, key, new Uint8Array(data));
  return decoder.decode(decryptedData);
}

// const pw = '';
// const a = await encryptMessage(pw, JSON.stringify({
//   "webhookUrlJav": "",
//   "webhookUrlChannel": "",
//   "webhookUrlForum": ""
// }));

// const b = await decryptMessage(pw, a);

// console.log(a, b);
