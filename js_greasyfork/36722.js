// ==UserScript==
// @name           tab scholar & Vimeo
// @namespace      https://google.com/
// @version        1.1
// @description    ajout tab scholar & Vimeo
// @homepage       
// @homepageURL    https://gist.github.com/Okaido53/9171656fa72cf20206f1809c2219e6f7
// @supportURL     https://productforums.google.com/forum/#!home
// @contributionURL https://www.paypal.com/
// @icon           https://icons.duckduckgo.com/ip2/google.com.ico
// @copyright      Okaïdo53
// @author         Okaïdo53
// @secure         Okaïdo53
// @license        GPL v3
// @compatible     firefox
// @compatible     chrome
// @compatible     opera
// @compatible     Safari
// @match          http://*/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @homepage        https://github.com/jmlntw/google-search-region
// @supportURL      https://github.com/jmlntw/google-search-region/issues
// @include        http://www.google.com/search?*q=*
// @include        https://www.google.com/search?*q=*
// @include        http*://google.*
// @include        http*://www.google.*
// @include        https://encrypted.google.*
// @include         https://www.google.*/search?*
// @include         https://www.google.*/webhp?*
// @include         https://encrypted.google.com/search?*
// @include         https://encrypted.google.com/webhp?*
// @grant          none
// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @noframes
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/36722/tab%20scholar%20%20Vimeo.user.js
// @updateURL https://update.greasyfork.org/scripts/36722/tab%20scholar%20%20Vimeo.meta.js
// ==/UserScript==

(function () {
    var videosLink = document.querySelector('#hdtb-msb .hdtb-mitem a[href*="&tbm=vid"]'),
        intv;

    function changeLink() {
        if (videosLink.firstChild.data === 'Vimeo' && videosLink.href.indexOf('Vimeo.com') !== -1) {
            return window.clearInterval(intv);
        }

        // change the link's text
        videosLink.firstChild.data = 'Vimeo';

        // change the link's url
        videosLink.href = 'https://www.Vimeo.com/results?search_query=' + location.href.match(/[?&]?q=([^&]*)/)[1];
    }

    // make sure the page is not in a frame
    // and if there is a "Videos" link
    if (window.frameElement || window !== window.top || !videosLink) { return; }

    // change the link's text
    // keep changing it until it actually changes... sometimes it doesn't work right away

    intv =  window.setInterval(changeLink, 0);
}());

var scholarUrl = 'https://scholar.google.com/scholar?q=';
var scholarEleId = 'hdtb-us-scholar';
var appendEleId = 'hdtb-msb-vis';

var createScholarElement = function() {
    var wrapper = document.createElement('div');
    wrapper.id = scholarEleId;
    wrapper.classList.add('hdtb-mitem');
    wrapper.classList.add('hdtb-imb');

    var anchor = document.createElement('a');
    var anchorClasses = anchor.classList;
    anchorClasses.add('q');
    anchorClasses.add('qs');
    anchor.textContent = 'Scholar';

    wrapper.appendChild(anchor);
    return wrapper;
};

var getSearchQuery = function(href) {
    var results = /[\\?&]q=([^&#]*)/.exec(href);
    return (results) ? results[1] : '';
};

var updateScholarHref = function(wrapper, scholorEle) {
    var otherHref = wrapper.querySelector('a').getAttribute('href');
    var query = getSearchQuery(otherHref);
    var anchor = scholorEle.firstChild;
    anchor.setAttribute('href', scholarUrl + query);
};

var addScholarLink = function() {
    var wrapper = document.getElementById(appendEleId);
    if (wrapper) {
        var scholarEle = createScholarElement();
        updateScholarHref(wrapper, scholarEle);
        wrapper.appendChild(scholarEle);
    }
};

var watchScholarLink = function() {
    // Whenever the query changes without changing the window href, our node
    // is removed, so use a MutationObserver to update and put us back.
    new MutationObserver(function(mutations) {
        var len = mutations.length;
        for (var i = 0; i < len; i++) {
            // Normally the link bar is removed then added, along
            // with search results, so just check additions.
            if (mutations[i].addedNodes) {
                if (!document.getElementById(scholarEleId)) {
                    addScholarLink();
                }
                break;
            }
        }
    }).observe(document.body, {'childList': true, 'subtree': true});
};

addScholarLink();
watchScholarLink();

// =============================================================================
// Add compatibility between the Greasemonkey 4 APIs and existing/legacy APIs.
// =============================================================================

if (typeof GM === 'undefined') {
  // eslint-disable-next-line no-global-assign
  GM = {
    getValue: (...args) => Promise.resolve(GM_getValue.apply(this, args)),
    setValue: (...args) => Promise.resolve(GM_setValue.apply(this, args))
  }
}

// eslint-disable-next-line camelcase
function GM_addStyle (css) {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.textContent = css
  document.head.appendChild(style)
  return style
}
// eslint-disable-next-line camelcase
GM.addStyle = GM_addStyle

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * @param {string} selector
 * @param {Element} [context]
 * @return {Element}
 */
function $ (selector, context) {
  return (context || document).querySelector(selector)
}

/**
 * @param {string} selector
 * @param {Element} [context]
 * @return {NodeListOf<Element>}
 */
function $$ (selector, context) {
  return (context || document).querySelectorAll(selector)
}

/**
 * @param {Element} target
 * @param {string} type
 * @param {EventListener} callback
 * @param {boolean} [useCapture]
 */
function $on (target, type, callback, useCapture) {
  target.addEventListener(type, callback, !!useCapture)
}

/**
 * @param {Element} target
 * @param {string} selector
 * @param {string} type
 * @param {EventListener} callback
 */
function $delegate (target, selector, type, callback) {
  const useCapture = (type === 'blur') || (type === 'focus')
  const dispatchEvent = function dispatchEvent (event) {
    if (event.target.matches(selector)) { callback.call(event.target, event) }
  }

  $on(target, type, dispatchEvent, useCapture)
}

if (window.NodeList && !window.NodeList.prototype.forEach) {
  window.NodeList.prototype.forEach = Array.prototype.forEach
}

// =============================================================================
// Template Engine
// =============================================================================

/**
 * @param {string} text
 * @param {Object} data
 * @return {string}
 */
function renderTemplate (text, data) {
  const matcher = /<%-([\s\S]+?)%>|<%=([\s\S]+?)%>|<%([\s\S]+?)%>|$/g
  const escapeChar = function escapeChar (text) {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
  }
  const escape = function escape (text) {
    return ('' + text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/`/g, '&#x60;')
  }

  let index = 0
  let source = "__p += '"

  text.replace(matcher, (match, escape, interpolate, evaluate, offset) => {
    source += escapeChar(text.slice(index, offset))
    index = offset + match.length
    if (escape) {
      source += `' + ((__t = (${escape})) == null ? '' : escape(__t)) + '`
    } else if (interpolate) {
      source += `' + ((__t = (${interpolate})) == null ? '' : __t) + '`
    } else if (evaluate) {
      source += `'; ${evaluate} __p += '`
    }
    return match
  })

  source += "';"
  source = `
    let __t, __p = '';
    const __j = Array.prototype.join;
    const print = function print () { __p += __j.call(arguments, ''); };
    with (data || {}) { ${source} }
    return __p;
  `

  try {
    // eslint-disable-next-line no-new-func
    return new Function('data', 'escape', source).call(this, data, escape)
  } catch (err) {
    err.source = source
    throw err
  }
}

// =============================================================================
// User Script Configuration
// =============================================================================

/**
 * @typedef {Object} Config
 * @property {boolean} setTLD
 * @property {boolean} setHl
 * @property {boolean} setGl
 * @property {boolean} setCr
 * @property {boolean} setLr
 * @property {boolean} showFlags
 * @property {Array<string>} userRegions
 */

/**
 * @type {Config}
 */
const config = Object.seal({
  setTLD: true,
  setHl: true,
  setGl: true,
  setCr: false,
  setLr: false,
  showFlags: true,
  userRegions: ['wt-wt', 'jp-ja', 'tw-zh', 'us-en']
})

/**
 * @return {Promise<Config>}
 */
function loadConfig () {
  return GM.getValue('config')
    .then(value => {
      try { return JSON.parse(value) } catch (err) { return {} }
    })
    .then(value => {
      return Object.assign(config, value)
    })
}

/**
 * @return {Promise<Config>}
 */
function saveConfig () {
  return GM.setValue('config', JSON.stringify(config))
}

// =============================================================================
// Search Regions
// =============================================================================

/**
 * @typedef {Object} Region
 * @property {string} id
 * @property {string} name
 * @property {string} [tld]
 * @property {string} [country]
 * @property {string} [lang]
 */

/**
 * @type {ReadonlyArray<Region>}
 */
const regions = Object.freeze([
  {id: 'wt-wt', name: 'All Regions', tld: 'com'},
  {id: 'ar-es', name: 'Argentina', tld: 'com.ar', country: 'ar', lang: 'es'},
  {id: 'au-en', name: 'Australia', tld: 'com.au', country: 'au', lang: 'en'},
  {id: 'at-de', name: 'Austria', tld: 'at', country: 'at', lang: 'de'},
  {id: 'be-fr', name: 'Belgium (fr)', tld: 'be', country: 'be', lang: 'fr'},
  {id: 'be-nl', name: 'Belgium (nl)', tld: 'be', country: 'be', lang: 'nl'},
  {id: 'br-pt', name: 'Brazil', tld: 'com.br', country: 'br', lang: 'pt'},
  {id: 'bg-bg', name: 'Bulgaria', tld: 'bg', country: 'bg', lang: 'bg'},
  {id: 'ca-en', name: 'Canada', tld: 'ca', country: 'ca', lang: 'en'},
  {id: 'ca-fr', name: 'Canada (fr)', tld: 'ca', country: 'ca', lang: 'fr'},
  {id: 'ct-ca', name: 'Catalonia', tld: 'cat', country: 'ct', lang: 'ca'},
  {id: 'cl-es', name: 'Chile', tld: 'cl', country: 'cl', lang: 'es'},
  {id: 'cn-zh', name: 'China', tld: 'com.hk', country: 'cn', lang: 'zh-cn'},
  {id: 'co-es', name: 'Colombia', tld: 'com.co', country: 'co', lang: 'es'},
  {id: 'hr-hr', name: 'Croatia', tld: 'hr', country: 'hr', lang: 'hr'},
  {id: 'cz-cs', name: 'Czech Republic', tld: 'cz', country: 'cz', lang: 'cs'},
  {id: 'dk-da', name: 'Denmark', tld: 'dk', country: 'dk', lang: 'da'},
  {id: 'ee-et', name: 'Estonia', tld: 'ee', country: 'ee', lang: 'et'},
  {id: 'fi-fi', name: 'Finland', tld: 'fi', country: 'fi', lang: 'fi'},
  {id: 'fr-fr', name: 'France', tld: 'fr', country: 'fr', lang: 'fr'},
  {id: 'de-de', name: 'Germany', tld: 'de', country: 'de', lang: 'de'},
  {id: 'gr-el', name: 'Greece', tld: 'gr', country: 'gr', lang: 'el'},
  {id: 'hk-zh', name: 'Hong Kong', tld: 'com.hk', country: 'hk', lang: 'zh-hk'},
  {id: 'hu-hu', name: 'Hungary', tld: 'hu', country: 'hu', lang: 'hu'},
  {id: 'in-en', name: 'India', tld: 'co.in', country: 'in', lang: 'en'},
  {id: 'id-id', name: 'Indonesia', tld: 'co.id', country: 'id', lang: 'id'},
  {id: 'id-en', name: 'Indonesia (en)', tld: 'co.id', country: 'id', lang: 'en'},
  {id: 'ie-en', name: 'Ireland', tld: 'ie', country: 'ie', lang: 'en'},
  {id: 'il-he', name: 'Israel', tld: 'co.il', country: 'il', lang: 'he'},
  {id: 'it-it', name: 'Italy', tld: 'it', country: 'it', lang: 'it'},
  {id: 'jp-ja', name: 'Japan', tld: 'co.jp', country: 'jp', lang: 'ja'},
  {id: 'kr-ko', name: 'Korea', tld: 'co.kr', country: 'kr', lang: 'ko'},
  {id: 'lv-lv', name: 'Latvia', tld: 'lv', country: 'lv', lang: 'lv'},
  {id: 'lt-lt', name: 'Lithuania', tld: 'lt', country: 'lt', lang: 'lt'},
  {id: 'my-ms', name: 'Malaysia', tld: 'com.my', country: 'my', lang: 'ms'},
  {id: 'my-en', name: 'Malaysia (en)', tld: 'com.my', country: 'my', lang: 'en'},
  {id: 'mx-es', name: 'Mexico', tld: 'mx', country: 'mx', lang: 'es'},
  {id: 'nl-nl', name: 'Netherlands', tld: 'nl', country: 'nl', lang: 'nl'},
  {id: 'nz-en', name: 'New Zealand', tld: 'co.nz', country: 'nz', lang: 'en'},
  {id: 'no-no', name: 'Norway', tld: 'no', country: 'no', lang: 'no'},
  {id: 'pe-es', name: 'Peru', tld: 'com.pe', country: 'pe', lang: 'es'},
  {id: 'ph-en', name: 'Philippines', tld: 'com.ph', country: 'ph', lang: 'en'},
  {id: 'ph-tl', name: 'Philippines (tl)', tld: 'com.ph', country: 'ph', lang: 'tl'},
  {id: 'pl-pl', name: 'Poland', tld: 'pl', country: 'pl', lang: 'pl'},
  {id: 'pt-pt', name: 'Portugal', tld: 'pt', country: 'pt', lang: 'pt'},
  {id: 'ro-ro', name: 'Romania', tld: 'ro', country: 'ro', lang: 'ro'},
  {id: 'ru-ru', name: 'Russia', tld: 'ru', country: 'ru', lang: 'ru'},
  {id: 'sa-ar', name: 'Saudi Arabia', tld: 'com.sa', country: 'sa', lang: 'ar'},
  {id: 'sg-en', name: 'Singapore', tld: 'com.sg', country: 'sg', lang: 'en'},
  {id: 'sk-sk', name: 'Slovakia', tld: 'sk', country: 'sk', lang: 'sk'},
  {id: 'sl-sl', name: 'Slovenia', tld: 'si', country: 'sl', lang: 'sl'},
  {id: 'za-en', name: 'South Africa', tld: 'co.za', country: 'za', lang: 'en'},
  {id: 'es-es', name: 'Spain', tld: 'es', country: 'es', lang: 'es'},
  {id: 'es-ca', name: 'Spain (ca)', tld: 'es', country: 'es', lang: 'ca'},
  {id: 'se-sv', name: 'Sweden', tld: 'se', country: 'se', lang: 'sv'},
  {id: 'ch-de', name: 'Switzerland (de)', tld: 'ch', country: 'ch', lang: 'de'},
  {id: 'ch-fr', name: 'Switzerland (fr)', tld: 'ch', country: 'ch', lang: 'fr'},
  {id: 'ch-it', name: 'Switzerland (it)', tld: 'ch', country: 'ch', lang: 'it'},
  {id: 'tw-zh', name: 'Taiwan', tld: 'com.tw', country: 'tw', lang: 'zh-tw'},
  {id: 'th-th', name: 'Thailand', tld: 'co.th', country: 'th', lang: 'th'},
  {id: 'tr-tr', name: 'Turkey', tld: 'com.tr', country: 'tr', lang: 'tr'},
  {id: 'gb-en', name: 'United Kingdom', tld: 'co.uk', country: 'gb', lang: 'en'},
  {id: 'us-en', name: 'United States', tld: 'com', country: 'us', lang: 'en'},
  {id: 'us-es', name: 'United States (es)', tld: 'com', country: 'us', lang: 'es'},
  {id: 'vn-vi', name: 'Vietnam', tld: 'com.vn', country: 'vn', lang: 'vi'}
])

/**
 * @param {Object} predicate
 * @return {Region}
 */
function findRegion (predicate) {
  return regions.find(region => {
    return Object.keys(predicate).every(key => {
      return predicate[key] === region[key]
    })
  })
}

/**
 * @param {string} regionID
 * @return {Region}
 */
function getRegionByID (regionID) {
  return findRegion({ id: regionID })
}

const urlRegExp = Object.freeze({
  tld: /^www\.google\.([\w.]+)$/i,
  cr: /^country(\w+)$/i,
  lr: /^lang_([\w-]+)$/i,
  lang: /-\w+$/i
})

/**
 * @return {Region}
 */
function getCurrentRegion () {
  const { hostname, searchParams } = new window.URL(window.location.href)
  const { setTLD, setHl, setGl, setCr, setLr } = config
  const predicate = {}

  if (setTLD && urlRegExp.tld.test(hostname)) {
    predicate.tld = hostname.replace(urlRegExp.tld, '$1')
  }
  if (setHl && searchParams.has('hl')) {
    predicate.lang = searchParams.get('hl')
  }
  if (setGl && searchParams.has('gl')) {
    predicate.country = searchParams.get('gl')
  }
  if (setCr && searchParams.has('cr')) {
    predicate.country = searchParams.get('cr').replace(urlRegExp.cr, '$1')
  }
  if (setLr && searchParams.has('lr')) {
    predicate.lang = searchParams.get('lr').replace(urlRegExp.lr, '$1')
  }

  for (let prop in predicate) {
    predicate[prop] = predicate[prop].toLowerCase()
  }

  return findRegion(predicate)
}

/**
 * @type {ReadonlyArray<string>}
 */
const delParams = Object.freeze([
  'aqs',
  'bav',
  'bih',
  'biw',
  'bvm',
  'client',
  'cp',
  'dcr',
  'dpr',
  'dq',
  'ech',
  'ei',
  'gfe_rd',
  'gs_gbg',
  'gs_l',
  'gs_mss',
  'gs_rn',
  'gws_rd',
  'oq',
  'pbx',
  'pf',
  'pq',
  'prds',
  'psi',
  'sa',
  'safe',
  'sclient',
  'source',
  'stick',
  'ved'
])

/**
 * @param {Region} region
 * @return {string}
 */
function getSearchURL (region) {
  const url = new window.URL(window.location.href)
  const { hostname, searchParams } = url
  const { setTLD, setHl, setGl, setCr, setLr } = config
  const { tld, country, lang } = region

  if (setTLD && tld) {
    url.hostname = hostname.replace(urlRegExp.tld, `www.google.${tld}`)
  } else if (urlRegExp.tld.test(url.hostname)) {
    url.hostname = 'www.google.com'
  }
  if (setHl && lang) {
    searchParams.set('hl', lang)
  } else {
    searchParams.delete('hl')
  }
  if (setGl && country) {
    searchParams.set('gl', country)
  } else {
    searchParams.delete('gl')
  }
  if (setCr && country) {
    searchParams.set('cr', `country${country.toUpperCase()}`)
  } else {
    searchParams.delete('cr')
  }
  if (setLr && lang) {
    const lr = `lang_${lang.replace(urlRegExp.lang, m => m.toUpperCase())}`
    searchParams.set('lr', lr)
  } else {
    searchParams.delete('lr')
  }

  delParams.forEach(param => {
    searchParams.delete(param)
  })

  return url.toString()
}

// =============================================================================
// User Interface
// =============================================================================

/**
 * @param {Element} target
 */
function createMenu (target) {
  const currentRegion = getCurrentRegion()
  const data = { config, regions, getRegionByID, getSearchURL, currentRegion }
  const template = `
    <% const { showFlags, userRegions } = config; %>

    <!-- Menu Dropdown Toggle -->
    <div class="hdtb-mn-hd gsr-menu-toggle <%- currentRegion ? 'hdtb-sel' : '' %>" role="button">
      <div class="mn-hd-txt">
        <% if (currentRegion) { %>
          <% let { name, country } = currentRegion; %>
          <% if (country && showFlags) { %> <span class="flag flag-<%- country %>"></span> <% } %>
          <%- name %>
        <% } else { %>
          Regions
        <% } %>
      </div>
      <span class="mn-dwn-arw"></span>
    </div>

    <!-- Menu Dropdown -->
    <ul class="hdtbU hdtb-mn-c gsr-menu-dropdown">
      <!-- User Regions List -->
      <% userRegions.map(getRegionByID).forEach(region => { %>
        <% if (!region) { return; } %>
        <% let { id, name, country } = region; %>
        <% let isCurrent = currentRegion && currentRegion.id === id; %>
        <% let url = getSearchURL(region); %>
        <li class="hdtbItm <%- isCurrent ? 'hdtbSel' : '' %>">
          <a class="q qs" href="<%- url %>">
            <% if (country && showFlags) { %> <span class="flag flag-<%- country %>"></span> <% } %>
            <%- name %>
          </a>
        </li>
      <% }); %>

      <!-- Configuration Modal Toggle -->
      <li class="hdtbItm">
        <div class="cdr_sep"></div>
        <a class="q qs gsr-menu-config" data-gsr-onclick="showModal" title="Google Search Region">...</a>
      </li>
    </ul>
  `
  const html = renderTemplate(template, data)

  target.insertAdjacentHTML('afterend', html)
}

/**
 * @param {Element} target
 */
function createModal (target) {
  const data = { config, regions }
  const template = `
    <% const { setTLD, setHl, setGl, setCr, setLr, showFlags, userRegions } = config; %>

    <!-- Configuration Modal -->
    <div class="gsr-modal" data-gsr-onclick="hideModal">
      <!-- Modal Dialog -->
      <div class="gsr-modal-dialog">
        <!-- Modal Header -->
        <div class="gsr-modal-header">
          <div class="gsr-modal-title">Google Search Region</div>
          <div class="gsr-modal-close" role="button" aria-label="Close" data-gsr-onclick="hideModal"></div>
        </div>

        <!-- Modal Body -->
        <div class="gsr-modal-body">
          <!-- Menu Configuration -->
          <div class="gsr-modal-subtitle">Menu</div>
          <!-- config.showFlags -->
          <label class="gsr-control">
            <input class="gsr-control-input" type="checkbox" data-gsr-config="showFlags" <%- showFlags ? 'checked' : '' %>>
            <span class="gsr-control-indicator"></span>
            <span class="gsr-control-description">Show country flags</span>
          </label>

          <!-- URL Configuration -->
          <div class="gsr-modal-subtitle">URL</div>
          <!-- config.setTLD -->
          <label class="gsr-control">
            <input class="gsr-control-input" type="checkbox" data-gsr-config="setTLD" <%- setTLD ? 'checked' : '' %>>
            <span class="gsr-control-indicator"></span>
            <span class="gsr-control-description">Set top level domain</span>
          </label>
          <!-- config.setHl -->
          <label class="gsr-control">
            <input class="gsr-control-input" type="checkbox" data-gsr-config="setHl" <%- setHl ? 'checked' : '' %>>
            <span class="gsr-control-indicator"></span>
            <span class="gsr-control-description">Set host language (hl)</span>
          </label>
          <!-- config.setGl -->
          <label class="gsr-control">
            <input class="gsr-control-input" type="checkbox" data-gsr-config="setGl" <%- setGl ? 'checked' : '' %>>
            <span class="gsr-control-indicator"></span>
            <span class="gsr-control-description">Set region (gl)</span>
          </label>
          <!-- config.setCr -->
          <label class="gsr-control">
            <input class="gsr-control-input" type="checkbox" data-gsr-config="setCr" <%- setCr ? 'checked' : '' %>>
            <span class="gsr-control-indicator"></span>
            <span class="gsr-control-description">Set country filter (cr)</span>
          </label>
          <!-- config.setLr -->
          <label class="gsr-control">
            <input class="gsr-control-input" type="checkbox" data-gsr-config="setLr" <%- setLr ? 'checked' : '' %>>
            <span class="gsr-control-indicator"></span>
            <span class="gsr-control-description">Set language filter (lr)</span>
          </label>

          <!-- Regions Configuration -->
          <div class="gsr-modal-subtitle">Regions</div>
          <div class="gsr-columns">
            <!-- config.userRegions -->
            <% regions.forEach(region => { %>
              <% let { id, name, country } = region; %>
              <% let isChecked = userRegions.includes(id); %>
              <label class="gsr-control" title="<%- name %>">
                <input class="gsr-control-input" type="checkbox"
                       data-gsr-config="userRegions:<%- id %>" <%- isChecked ? 'checked' : '' %>>
                <span class="gsr-control-indicator"></span>
                <span class="gsr-control-description">
                  <% if (country) { %> <span class="flag flag-<%- country %>"></span> <% } %>
                  <%- name %>
                </span>
              </label>
            <% }); %>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="gsr-modal-footer">
          <button class="gsr-btn gsr-btn-primary" data-gsr-onclick="save">Save</button>
          <button class="gsr-btn gsr-btn-default" data-gsr-onclick="hideModal">Cancel</button>
        </div>
      </div>
    </div>
  `
  const html = renderTemplate(template, data)

  target.insertAdjacentHTML('beforeend', html)
}

/**
 * @return {Promise<void>}
 */
function delegateEvents () {
  const body = document.body
  const events = {}

  events.showModal = function showModal (event) {
    const modal = $('.gsr-modal')
    if (modal) { modal.style.display = null } else { createModal(body) }
  }

  events.hideModal = function hideModal (event) {
    const modal = $('.gsr-modal')
    if (modal) { modal.style.display = 'none' }
  }

  events.save = function save (event) {
    const modal = $('.gsr-modal')
    const controls = $$('[data-gsr-config]', modal)
    const pending = {}

    controls.forEach(control => {
      const attr = control.getAttribute('data-gsr-config').split(':')
      const [name, value = control.value] = attr

      if (typeof config[name] === 'boolean') {
        pending[name] = control.checked
      }
      if (Array.isArray(config[name])) {
        if (!Array.isArray(pending[name])) { pending[name] = [] }
        if (control.checked) { pending[name].push(value) }
      }
    })

    Object.assign(config, pending)

    saveConfig().then(() => {
      window.location.reload()
    })
  }

  $delegate(body, '[data-gsr-onclick]', 'click', event => {
    const name = event.target.getAttribute('data-gsr-onclick')
    const callback = events[name]
    if (callback) { callback.call(event.target, event) }
  })

  return Promise.resolve()
}

/**
 * @return {Promise<HTMLStyleElement>}
 */
function addStyles () {
  const style = GM_addStyle(`
    /*!
     * Region Menu Dropdown CSS
     */
    .hdtb-sel{font-weight:700}
    .gsr-menu-dropdown{max-height:80vh;overflow-y:auto}
    .gsr-menu-dropdown .hdtbSel a{padding:0!important}
    .gsr-menu-config{cursor:pointer}
    /*!
     * Configuration Modal CSS
     */
    .gsr-modal{display:flex;align-items:center;justify-content:center;position:fixed;z-index:10000;top:0;left:0;width:100%;height:100%;background-color:rgba(255,255,255,.75)}
    .gsr-modal-dialog{display:block;width:800px;max-width:80vw;max-height:80vh;overflow:auto;margin:32px;padding:32px;border:1px solid #c5c5c5;box-shadow:0 4px 16px rgba(0,0,0,.2);background-color:#fff;font-size:13px}
    .gsr-modal-header{display:flex;justify-content:space-between}
    .gsr-modal-footer{text-align:right}
    .gsr-modal-body{margin:16px 0}
    .gsr-modal-title{font-size:16px;font-weight:thin}
    .gsr-modal-subtitle{margin:16px 0;font-size:13px;font-weight:700}
    .gsr-modal-close{display:inline-block;width:10px;height:10px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKBAMAAAB/HNKOAAAAElBMVEX////39/e9vb2zs7PCwsLv7++5ffrDAAAAL0lEQVQI12MIEWBgdGVwVmQQMmEQMhJUVmRgVFYyEmBgEDJWZICQEBGILEQlRBcAq64FtxSToc8AAAAASUVORK5CYII=);background-repeat:no-repeat;cursor:pointer}
    .gsr-columns{max-height:300px;overflow-x:auto;-webkit-column-count:5;-moz-column-count:5;column-count:5}
    .gsr-control{display:block;margin:4px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .gsr-control-input{display:none}
    .gsr-control-indicator{display:inline-block;margin:0 4px;width:10px;height:10px;border:1px solid #c6c6c6;border-radius:1px;vertical-align:middle}
    .gsr-control-indicator::after{content:" ";display:none;position:relative;top:-3px;width:15px;height:15px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAtklEQVQ4y2P4//8/A7Ux1Q0cxoaCADIbCUgCMTvVXAoE5kA8CYidyXYpGrAH4iVAHIXiCwoMDQTimUBcBsRMlBrKCsTpUANzkC0j11BuIK6EGlgKsoAkQ4FgChD7AzELVI8YEDdDDawDYk6YQaQY6gg1oAqILYC4D8oHGcyLbBAphoJAKtQgGO4EYiHk2CLHUJAXm6AG9gCxNHoSIMdQEJCFGqiALaGSayjMxQwUGzq0S6nhZygA2ojsbh6J67kAAAAASUVORK5CYII=);background-repeat:no-repeat;background-position:-5px -3px}
    .gsr-btn,.gsr-control-input:checked~.gsr-control-indicator::after{display:inline-block}
    .gsr-control:hover .gsr-control-indicator{border-color:#b2b2b2;box-shadow:inset 0 1px 1px rgba(0,0,0,.1)}
    .gsr-btn{min-width:70px;height:27px;padding:0 8px;border:1px solid;border-radius:2px;font-family:inherit;font-size:11px;font-weight:700;outline:0}
    .gsr-btn-default{border-color:rgba(0,0,0,.1);background-image:linear-gradient(#f5f5f5,#f1f1f1);color:#444}
    .gsr-btn-default:hover{border-color:#c6c6c6;background-image:linear-gradient(#f8f8f8,#f1f1f1);color:#333}
    .gsr-btn-default:focus{border-color:#4d90fe}
    .gsr-btn-primary{border-color:#3079ed;background-image:linear-gradient(#4d90fe,#4787ed);color:#fff}
    .gsr-btn-primary:hover{border-color:#2f5bb7;background-image:linear-gradient(#4d90fe,#357ae8);color:#fff}
    .gsr-btn-primary:focus{border-color:transparent;box-shadow:inset 0 0 0 1px #fff}
    /*!
     * Generated with CSS Flag Sprite Generator <https://www.flag-sprites.com/>
     *
     * FAMFAMFAM Flag Icons <http://www.famfamfam.com/lab/icons/flags/>
     * These flag icons are available for free use for any purpose with no
     * requirement for attribution.
     */
    .flag{box-sizing:border-box;display:inline-block;width:16px;height:11px;background:url(data:image/png;base64,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) no-repeat;image-rendering:-moz-crisp-edges;image-rendering:crisp-edges;image-rendering:pixelated;vertical-align:middle}
    .flag.flag-wt{border:1px dotted;background-image:none!important}
    .flag.flag-ar{background-position:0 0}
    .flag.flag-at{background-position:-16px 0}
    .flag.flag-au{background-position:-32px 0}
    .flag.flag-be{background-position:-48px 0}
    .flag.flag-bg{background-position:-64px 0}
    .flag.flag-br{background-position:-80px 0}
    .flag.flag-ca{background-position:-96px 0}
    .flag.flag-ct{background-position:-112px 0}
    .flag.flag-ch{background-position:0 -11px}
    .flag.flag-cl{background-position:-16px -11px}
    .flag.flag-cn{background-position:-32px -11px}
    .flag.flag-co{background-position:-48px -11px}
    .flag.flag-cz{background-position:-64px -11px}
    .flag.flag-de{background-position:-80px -11px}
    .flag.flag-dk{background-position:-96px -11px}
    .flag.flag-ee{background-position:-112px -11px}
    .flag.flag-es{background-position:0 -22px}
    .flag.flag-fi{background-position:-16px -22px}
    .flag.flag-fr{background-position:-32px -22px}
    .flag.flag-gb{background-position:-48px -22px}
    .flag.flag-gr{background-position:-64px -22px}
    .flag.flag-hk{background-position:-80px -22px}
    .flag.flag-hr{background-position:-96px -22px}
    .flag.flag-hu{background-position:-112px -22px}
    .flag.flag-id{background-position:0 -33px}
    .flag.flag-ie{background-position:-16px -33px}
    .flag.flag-il{background-position:-32px -33px}
    .flag.flag-in{background-position:-48px -33px}
    .flag.flag-it{background-position:-64px -33px}
    .flag.flag-jp{background-position:-80px -33px}
    .flag.flag-kr{background-position:-96px -33px}
    .flag.flag-lt{background-position:-112px -33px}
    .flag.flag-lv{background-position:0 -44px}
    .flag.flag-mx{background-position:-16px -44px}
    .flag.flag-my{background-position:-32px -44px}
    .flag.flag-nl{background-position:-48px -44px}
    .flag.flag-no{background-position:-64px -44px}
    .flag.flag-nz{background-position:-80px -44px}
    .flag.flag-pe{background-position:-96px -44px}
    .flag.flag-ph{background-position:-112px -44px}
    .flag.flag-pl{background-position:0 -55px}
    .flag.flag-pt{background-position:-16px -55px}
    .flag.flag-ro{background-position:-32px -55px}
    .flag.flag-ru{background-position:-48px -55px}
    .flag.flag-sa{background-position:-64px -55px}
    .flag.flag-se{background-position:-80px -55px}
    .flag.flag-sg{background-position:-96px -55px}
    .flag.flag-sk{background-position:-112px -55px}
    .flag.flag-sl{background-position:0 -66px}
    .flag.flag-th{background-position:-16px -66px}
    .flag.flag-tr{background-position:-32px -66px}
    .flag.flag-tw{background-position:-48px -66px}
    .flag.flag-us{background-position:-64px -66px}
    .flag.flag-vn{background-position:-80px -66px}
    .flag.flag-za{background-position:-96px -66px}
  `)

  return Promise.resolve(style)
}

// =============================================================================
// Initialization
// =============================================================================

/**
 * @return {Promise<Element>}
 */
function waitForPageReady () {
  return new Promise(resolve => {
    const observee = $('#hdtb')
    const observer = new window.MutationObserver(() => {
      const target = $('#hdtb-mn-gp')
      if (target) { resolve(target) }
    })

    observer.observe(observee, { childList: true, subtree: true })
  })
}

Promise.all([
  waitForPageReady(),
  loadConfig(),
  delegateEvents(),
  addStyles()
]).then(values => createMenu(values[0]))
