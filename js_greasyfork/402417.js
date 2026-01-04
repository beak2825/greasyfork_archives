// ==UserScript==
// @name         ArxivRedirector
// @namespace    https://github.com/tao-shen/ArxivRedirector
// @homepage     https://github.com/tao-shen/ArxivRedirector
// @version      1.2
// @author       tao.shen
// @description  An Arxiv Redirector for China Mainland
// @include      /^https?://(.*\.)?arxiv\.org/.*/
// @include      http://xxx.itp.ac.cn/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/402417/ArxivRedirector.user.js
// @updateURL https://update.greasyfork.org/scripts/402417/ArxivRedirector.meta.js
// ==/UserScript==

window.onload=function() {
    'use strict';
    if (location.href.search('xxx.itp.ac.cn') == -1){
    function incompletePDF(url){ return url.includes('/pdf') && !url.endsWith('pdf') }
    function abstractURL(url){ return url.includes('/abs') }
    let mirrors = {
        'China':'xxx.itp.ac.cn',
    }
    let mirror='China'
    let url = location.href.replace(location.hostname,mirrors[mirror]).replace('https','http')
    url = incompletePDF(url) ? url+'.pdf' : url
    console.log(mirror+':'+url)
    location.replace(url,'xxx.itp.ac.cn')}
}