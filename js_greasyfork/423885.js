// ==UserScript==
// @name         MRQZ deploy URL helper for GITLAB
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  try to take over the world!
// @author       pullso
// @match        https://gitlab.com/marquiz/*/-/merge_requests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423885/MRQZ%20deploy%20URL%20helper%20for%20GITLAB.user.js
// @updateURL https://update.greasyfork.org/scripts/423885/MRQZ%20deploy%20URL%20helper%20for%20GITLAB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var info = window.location.pathname.split('/')
    var repName = info[2]
    var label = '`' + repName + '` '
    var deployUrl = 'https://deploy-preview-' + info.reverse()[0] + '--marquiz-'+ repName +'.netlify.app/\n\n'

    var text = label + window.location.href + ' \n \r '
    if(repName !== 'backend') text += label + deployUrl
    navigator.clipboard.writeText(text)

    var descriptionBlock = document.querySelector('.description p')
    if(!descriptionBlock) return

    descriptionBlock.innerText = text + descriptionBlock.innerText

    if(repName !== 'backend'){
        descriptionBlock.innerHTML = '<a href=' + deployUrl +
            ' target="_blank"> Открыть деплой в новой вкладке </a><br><br>' +
            descriptionBlock.innerHTML
    }

})();