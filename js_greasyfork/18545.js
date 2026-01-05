// ==UserScript==
// @name         Subdomain Switcher
// @namespace    http://jonas.ninja
// @version      2.0.4
// @description  enables navigation to identical page on different internal URLs
// @author       @_jnblog
// @match        *://ivan.dev.sentryone.com/*
// @match        *://dev.sentryone.com/*
// @match        *://qa.sentryone.com/*
// @match        *://stg.sentryone.com/*
// @match        *://www.preview.sentryone.com/*
// @match        *://www.sentryone.com/*
// @match        *://sentryone.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @require      https://greasyfork.org/scripts/18233-window-floating-container/code/Window%20floating%20container.js?version=187970
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/18545/Subdomain%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/18545/Subdomain%20Switcher.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global $, GM_addStyle, GM_getValue, GM_setValue */
/* jshint asi: true, multistr: true */
'use strict'


var baseUrl = window.location.host.match(/[^\.]+\.[^\.]+$/)[0]
var currentEnv = window.location.hostname.replace('sqlsentry.com', '').replace('sentryone.com', '')
var floater = window.windowFloaterUtils.getFloater()
var allEnvs = [
  {
    name: 'ivan.dev',
    isSecure: false,
    hostnamePrefix: 'ivan.dev.',
    bgColor: '#5cb85c' // green
  },
  {
    name: 'dev',
    isSecure: true,
    hostnamePrefix: 'dev.',
    bgColor: '#337ab7' // blue
  },
  {
    name: 'QA',
    isSecure: true,
    hostnamePrefix: 'qa.',
    bgColor: '#efb74d' // yellow
  },
  {
    name: 'staging',
    isSecure: true,
    hostnamePrefix: 'stg.',
    bgColor: '#ef834d' // orange
  },
  // {
  //   name: 'preview',
  //   isSecure: true,
  //   hostnamePrefix: 'www.preview.',
  //   bgColor: 'red'
  // },
  {
    name: 'production',
    isSecure: true,
    hostnamePrefix: 'www.',
    bgColor: '#d9534f' // red
  }
]

// domain without subdomain = production
currentEnv = currentEnv || 'www.'

$.each(allEnvs, function(idx, env) {
  if (env.hostnamePrefix === currentEnv) {
    // instead of adding the current environment to the list, change the floater's background color for easy identification.
    floater.css('background-color', env.bgColor)
  } else {
    // append this element as a link to a different environment
    var item = $('<span class="ijgWindowFloater-item">').appendTo(floater)
    var url = 'http' + (env.isSecure ? 's' : '') + '://' + env.hostnamePrefix + baseUrl + window.location.pathname + window.location.search
    item.append($('<a href="'+url+'">').text(env.name))
  }
})
