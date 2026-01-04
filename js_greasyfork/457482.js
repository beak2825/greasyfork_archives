// ==UserScript==
// @name        Google Translate: Filter & Flags
// @namespace   https://github.com/HatScripts/google-translate-filter-and-flags
// @version     1.0.2
// @license     MIT
// @description Filters languages and shows country flags on Google Translate
// @author      HatScripts
// @icon        https://ssl.gstatic.com/translate/favicon.ico
// @match       http://translate.google.com/*
// @match       https://translate.google.com/*
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/457482/Google%20Translate%3A%20Filter%20%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/457482/Google%20Translate%3A%20Filter%20%20Flags.meta.js
// ==/UserScript==

/* global GM_config, GM_info, GM_registerMenuCommand */

;(() => {
  'use strict'

  GM_config.init({
    id: 'gtff_config',
    title: GM_info.script.name + ' Settings',
    fields: {
      SHOW_FLAGS: {
        label: 'Show flags',
        type: 'checkbox',
        default: true,
        title: 'Show country flags next to languages'
      },
      FILTER_LANGUAGES: {
        label: 'Filter languages',
        type: 'checkbox',
        default: true,
        title: 'Show only the specified languages'
      },
      LANGUAGES_SHOWN: {
        label: 'Languages shown',
        type: 'textarea',
        default: 'ar,de,el,en,eo,es,fi,fr,it,ja,ko,la,no,pt,ru,sv,zh-CN',
        title: 'The languages to show, as ISO 639-1 language codes, separated by commas'
      }
    }
  })

  GM_registerMenuCommand('Settings', () => {
    GM_config.open()
  })

  console.log(GM_info.script.name)

  const LANG_MAP = {
    'iw': 'he', // Hebrew
    'jw': 'jv', // Javanese
    'mni-Mtei': 'mni', // Meiteilon (Manipuri)
    'zh-CN': 'zh', // Chinese (Simplified)
    'zh-TW': 'zh', // Chinese (Traditional)
  }

  const prefix = '.qSb8Pe'
  if (!document.querySelector(prefix)) {
    console.error('Couldn\'t find language buttons')
  }

  let css = '/* ' + GM_info.script.name + ' */'

  if (GM_config.get('FILTER_LANGUAGES')) {
    css += prefix + '{ display: none; }'
    console.log(GM_config.get('LANGUAGES_SHOWN').split(','))
    css += GM_config.get('LANGUAGES_SHOWN').split(',').map(lang => `${prefix}[data-language-code=${lang}]`).join(',')
    css += '{ display: inline-flex; }'
    css += '.C96yib > .vSUSRc > ' + prefix + ' { display: inline-flex; }'
  }

  if (GM_config.get('SHOW_FLAGS')) {
    //css += `${prefix}.RCaXn:not(.KKjvXb) .W5jNxd, ${prefix} .g3XDjb { display: none !important; }`
    css += `${prefix} > .l7O9Dc { background-repeat: no-repeat; background-size: contain; background-position-x: 6px; }`
    css += `${prefix} > .l7O9Dc > i { display: none !important; }`
    document.querySelectorAll(prefix).forEach(wrapper => {
      let code1 = wrapper.dataset.languageCode
      let code2 = LANG_MAP[code1] || code1
      css += `${prefix}[data-language-code=${code1}] > .l7O9Dc {`
      css += `background-image: url(https://hatscripts.github.io/circle-flags/flags/language/${code2}.svg) !important;`
      css += '}'
    })
  }

  GM_addStyle(css)
})()