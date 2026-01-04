// ==UserScript==
// @name         Rancher Health
// @namespace    http://ntopus.com.br/rancher/dashboard
// @version      0.5
// @description  Monitor many nodes
// @author       Aurélio Heckert @ nTopus
// @include      https://rancher.ntopus.com.br/*/nodes
// @include      https://rancher.ntopus.com.br/*/monitoring/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396067/Rancher%20Health.user.js
// @updateURL https://update.greasyfork.org/scripts/396067/Rancher%20Health.meta.js
// ==/UserScript==

if (document.location.href.match(/\.com\.br\/[^\/]+\/[^\/]+\/nodes/)) window.addEventListener('load', waitThenBuildDashboard)
if (document.location.href.match(/\.com\.br\/[^\/]+\/[^\/]+\/monitoring/)) window.addEventListener('load', waitThenClearMonitoring)

const get = (query)=> document.querySelector(query)
const getAll = (query)=> [...document.querySelectorAll(query)]
const hide = (query)=> getAll(query).forEach(el => el.setAttribute('style', 'display: none!important'))
const mkIFrame = (url)=> {
    let iframe = document.createElement('iframe')
    iframe.setAttribute('src', url)
    iframe.setAttribute('style', 'border: none; width: 33vw; height: 33vh; margin: 2px; vertical-align: middle; background: #444')
    document.body.appendChild(iframe)
    return iframe
}
const emptyGifs = [
    'dy4swYs1dp430jChRa',
    'ckrRT65e5xvEaygrTh',
    '26ufcFUKZKO4w4B2g',
    '91vR2vcqaVVVS',
    '3oriff4xQ7Oq2TIgTu',
    '3ov9jDrVw3HJX7sDTy',
    'Lny6Rw04nsOOc',
    '3oKHWn4E12h1on0TwQ',
    'l1EsYN3B2Hrppo5VK',
    '3ohuPDOW4s0CpEoAKI',
    'vudNK1LtwXTTa'
]

function waitThenBuildDashboard() {
    if ( document.querySelector('.main-row') ) {
        buildDashboard()
    } else {
        console.log('Waiting for node elements...')
        setTimeout(waitThenBuildDashboard, 500)
    }
}

function buildDashboard() {
    console.log('Building Dashboard!')
    const urls = getAll('.main-row td[data-title="Name: "] a').map(a => a.href)
    while (urls.length < 9) {
        urls.push('https://giphy.com/embed/'+emptyGifs[Math.floor(Math.random()*emptyGifs.length)])
    }
    console.log('Monitors:', urls)
    while(document.body.firstChild) document.body.removeChild(document.body.firstChild)
    document.documentElement.setAttribute('style', 'margin: 0; height: 100%; overflow: hidden')
    document.body.setAttribute('style', 'margin: 0; height: 100%; overflow: hidden; background: #555; text-align: center')
    urls.forEach(mkIFrame)
}

function waitThenClearMonitoring() {
    if ( document.querySelector('#ember6') && document.querySelector('.banner.bg-info') ) {
        clearMonitoringNoiseData()
        reloadOnError()
    } else {
        console.log('Waiting for monitor elements...')
        setTimeout(waitThenClearMonitoring, 500)
    }
}

function clearMonitoringNoiseData() {
    console.log('Hiding elements!')
    document.documentElement.setAttribute('style', 'margin: 0; height: 100%; overflow: hidden')
    hide('#ember6, #ember37, #ember46')
    hide('footer')
    hide('.banner.bg-info')
    get('section.header').setAttribute('style', 'margin: 0')
}

function reloadOnError() {
    if (get('.alert.error')) {
        document.location.reload()
    } else {
        setTimeout(reloadOnError, 1000)
    }
}