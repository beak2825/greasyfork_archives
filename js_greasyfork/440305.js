// ==UserScript==
// @name Greasy Fork Install Button at search
// @namespace -
// @version 1.0.0
// @description adds install button at search and at user pages.
// @author NotYou
// @match *://*sleazyfork.org/*
// @match *://*greasyfork.org/*
// @grant none
// @run-at document-idle
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/440305/Greasy%20Fork%20Install%20Button%20at%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/440305/Greasy%20Fork%20Install%20Button%20at%20search.meta.js
// ==/UserScript==

(function() {
    var $ = (s) => document.querySelector(s)

    var $$ = (s) => document.querySelectorAll(s)

    var appendHTML = function(el, html) {
        el.insertAdjacentHTML('beforeend', html)
    }

    var domain = location.host

    // STYLES
    appendHTML($('head'), ['<style>',

    '.custom-install-link-parent {',
      'text-decoration: none !important;',
    '}',

    '.custom-install-link-parent > * {',
      'transform: scale(0.7);',
    '}',

    '.custom-install-link {',
      'margin-right: -15px !important;',
      'margin-left: -6px !important;',
    '}',

    '.custom-install-style-link {',
      'margin-left: -14px !important;',
      'margin-right: -26px !important;',
    '}',

    '</style>'].join(''))

    // USER SCRIPT

    $$('#user-script-list > li[data-script-type="public"] > article > h2 > a, #browse-script-list > li[data-script-type="public"] > article > h2 > a').forEach(function(e) {
        var data = e.parentNode.parentNode.parentNode.dataset
        var scriptId = data.scriptId
        var scriptName = data.scriptName

        appendHTML(e, '<span data-install-format="js" data-script-id="'+ scriptId +'" data-script-name="' + scriptName + '"><a href="https://' + domain + '/scripts/' + scriptId + '/code/' + scriptName + '.user.js" class="custom-install-link-parent"><span class="install-link custom-install-link">Install</span></a><span>')
    })

    // USER STYLE

    $$('#user-script-list > li[data-script-language="css"] > article > h2 > a, #browse-script-list > li[data-script-language="css"] > article > h2 > a').forEach(function(e) {
        var data = e.parentNode.parentNode.parentNode.dataset
        var scriptId = data.scriptId
        var scriptName = data.scriptName

        appendHTML(e, '<span data-install-format="css" data-script-id="'+ scriptId +'" data-script-name="' + scriptName + '"><a target="_blank" href="https://' + domain + '/scripts/' + scriptId + '/code/' + scriptName + '.user.css" class="custom-install-link-parent"><span class="install-link custom-install-link custom-install-style-link">Install as style</span></a><span>')
    })

    // LIBRARIES

    $$('#user-library-script-list > li > article > h2 > a, #browse-script-list > li[data-script-type="library"] > article > h2 > a').forEach(function(e) {
        var data = e.parentNode.parentNode.parentNode.dataset
        var scriptId = data.scriptId
        var scriptName = data.scriptName
        var _scriptName = scriptName.replace(/\s/g, "-")

        appendHTML(e, '<span data-install-format="js" data-script-id="'+ scriptId +'" data-script-name="' + scriptName + '"><a href=javascript:void(0) onclick=navigator.clipboard.writeText("https://' + domain + '/scripts/' + scriptId + '/code/' + _scriptName + '.js") class="custom-install-link-parent"><span class="install-link custom-install-link">Copy URL</span></a><span>')
    })
})()






















