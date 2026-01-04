// ==UserScript==
// @name        Wiktionary: Filter & Flags
// @namespace   https://github.com/HatScripts/monolingual-wiktionary
// @version     1.0.1
// @license     MIT
// @description Filters languages and shows country flags on Wiktionary
// @author      HatScripts
// @icon        https://en.wiktionary.org/static/favicon/wiktionary/en.ico
// @match       https://en.wiktionary.org/wiki/*
// @match       https://en.wiktionary.org/w/index.php?title=*
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/460178/Wiktionary%3A%20Filter%20%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/460178/Wiktionary%3A%20Filter%20%20Flags.meta.js
// ==/UserScript==

;(() => {
  'use strict'

  const SHOW_ALL_LANGS_IN_TOC = true
  const LANG_WHITELIST = new Set(['English', 'Translingual'])
  const LANGS_ON_PAGE = new Set(Array.from(document.querySelectorAll('h2 > .mw-headline'))
                                .map(el => el.textContent.replaceAll(' ', '_')))

  let intersect = new Set([...LANG_WHITELIST].filter(l => LANGS_ON_PAGE.has(l)))

  console.log('monowikt: LANGS_ON_PAGE: ', LANGS_ON_PAGE)
  console.log('monowikt: LANG_WHITELIST:', LANG_WHITELIST)
  console.log('monowikt: intersect:     ', intersect)

  if (intersect.size === 0) {
    LANGS_ON_PAGE.forEach(lang => LANG_WHITELIST.add(lang))
  }

  if (document.title.includes(':')) { // Special page
    return
  }

  const hashLang = getHashLang()
  if (hashLang) {
    console.log('monowikt: initial hashLang:', hashLang)
    if (hashLang === '*') {
      // Add all languages on the current page to the whitelist
      LANGS_ON_PAGE.forEach(lang => LANG_WHITELIST.add(lang))
    } else if (LANGS_ON_PAGE.has(hashLang)) {
      LANG_WHITELIST.add(hashLang)
    }
  }

  function generateLangMap () {
    const langNames = new Intl.DisplayNames(['en'], {type: 'language'})
    const langMap = {}
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
        let code = String.fromCharCode(97 + i) + String.fromCharCode(97 + j)
        let name = langNames.of(code)
        if (name !== code) {
          langMap[name] = code
        }
      }
    }
    const langMap2 = {
      'Akan': 'ak',
      'Hebrew': 'he',
      'Indonesian': 'id',
      'Javanese': 'jv',
      'Romanian': 'ro',
      'Yiddish': 'yi',
      // ---
      'Tagalog': 'tl',
      // ---
      'Central Kurdish': 'ckb',
      'Eastern Mari': 'chm',
      'Hawaiian': 'haw',
      'Ilocano': 'ilo',
      'Krio': 'kri',
      'Manipuri': 'mni',
      'Mizo': 'lus',
      'Old Norse': 'non',
      'Otomi': 'oto',
      'Papiamentu': 'pap',
      'Udmurt': 'udm',
      'Western Mari': 'mrj',
      'White Hmong': 'hmn',
      'Yucatec Maya': 'yua',
    }
    return { ...langMap, ...langMap2 }
  }

  const LANG_MAP = generateLangMap()

  GM_addStyle('.lang-hidden { display: none !important; }')
  // hide('#p-visibility, #p-lang, #p-coll-print_export, #p-feedback')

  function getHashLang () {
    return window.location.hash.replace(/^#/, '')
  }

  function slugify (text) {
    return text.toString().toLowerCase()
      .replace(/[\s_]+/g, '-') // Replace all whitespace with '-'
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/-{2,}/g, '-') //  Replace multiple '-' with single '-'
      .replace(/^-+|-+$/, '') //  Trim '-' from start and end of text
  }

  function hide (elem, lang) {
    if (!elem) {
      console.log('monowikt: elem', elem, 'not found')
      return
    }
    elem.classList.add('lang-hidden')
    if (lang) {
      elem.classList.add('lang-' + slugify(lang))
    }
  }

  function createFlagImg(langCode, size) {
    const flagImg = document.createElement('img')
    flagImg.src = `https://hatscripts.github.io/circle-flags/flags/language/${langCode}.svg`
    flagImg.alt = ''
    flagImg.width = size
    return flagImg
  }

  console.time('monowikt: hide table of contents text')
  document.querySelectorAll('#toc > ul > li.toclevel-1').forEach(li => {
    const span = li.querySelector('a > span.toctext')
    const lang = span.textContent.replaceAll(' ', '_')
    const langCode = LANG_MAP[lang]
    if (langCode) {
      span.textContent = ' ' + span.textContent
      const flagImg = createFlagImg(langCode, 16)
      span.insertBefore(flagImg, span.firstChild)
    }

    if (!LANG_WHITELIST.has(lang)) {
      hide(SHOW_ALL_LANGS_IN_TOC ? li.querySelector('ul') : li, lang)
    }
  })
  console.timeEnd('monowikt: hide table of contents text')

  console.time('monowikt: hide sections')
  let hideNext = false
  let lang
  let hr
  Array.from(document.querySelector('#mw-content-text > div').children).forEach(el => {
    if (el.nodeName === 'H2') {
      const headline = el.querySelector('.mw-headline')
      lang = headline.textContent.replaceAll(' ', '_')
      console.log('lang:', lang)
      const langCode = LANG_MAP[lang]
      if (langCode) {
        headline.textContent = ' ' + headline.textContent
        const flagImg = createFlagImg(langCode, 32)
        headline.insertBefore(flagImg, headline.firstChild)
      }
      hideNext = !LANG_WHITELIST.has(lang)
      if (hr) {
        hide(hr, lang)
        hr = undefined
      }
    } else if (el.nodeName === 'HR') {
      hr = el
    }
    if (hideNext && !hr) {
      hide(el, lang)
    }
  })
  console.timeEnd('monowikt: hide sections')

  console.time('monowikt: hide categories')
  document.querySelectorAll('#mw-normal-catlinks > ul > li').forEach(li => {
    const category = li.textContent
    if (!/^en:|(?<!(Old|Middle) )\bEnglish\b/.test(category) || /(borrowed|derived) from English/.test(category)) {
      hide(li)
    } else {
      // const a = li.querySelector('a')
      // a.textContent = category.replace(/\s*(?:(?<!(Old|Middle) )English|terms)\s*/g, '')
    }
  })
  console.timeEnd('monowikt: hide categories')

  const scrollToElem = document.getElementById(hashLang)
  if (scrollToElem) {
    scrollToElem.scrollIntoView()
  }

  window.addEventListener('hashchange', () => {
    const hashLang = getHashLang()
    console.log('monowikt: changed hashLang :', hashLang)
    console.log('monowikt: slugify(hashLang):', slugify(hashLang))
    if (LANGS_ON_PAGE.has(hashLang) && !LANG_WHITELIST.has(hashLang)) {
      Array.from(document.getElementsByClassName('lang-' + slugify(hashLang))).forEach(el => {
        el.classList.remove('lang-hidden')
      })
      document.getElementById(hashLang).scrollIntoView()
    }
  }, false)
})()
