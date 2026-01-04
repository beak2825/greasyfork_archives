// ==UserScript==
// @name         SpringManualJapanese
// @namespace    cypher256.SpringManualJapanese
// @version      1.7
// @description  docs.spring.io の日本翻訳版ページと公式を行ったり来たり出来ます
// @author       cypher256
// @match        https://spring.pleiades.io/*
// @match        https://docs.spring.io/spring*
// @match        https://spring.io
// @match        https://spring.io/projects*
// @match        https://spring.io/guides*
// @match        https://docs.awspring.io/spring-cloud-aws*
// @match        https://jakarta.ee/specifications/platform/*/apidocs/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393587/SpringManualJapanese.user.js
// @updateURL https://update.greasyfork.org/scripts/393587/SpringManualJapanese.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var official = location.hostname.match(/(spring\.io|jakarta.ee)$/);

    function replaceLink() {
        var _host = null;
        if (official) {
            _host = 'spring.pleiades.io';
        } else if (location.pathname.match(/^\/spring-cloud-aws/)) {
            _host = 'docs.awspring.io';
        } else if (location.pathname.match(/^\/specifications/)) {
            _host = 'jakarta.ee';
        } else if (location.pathname.match(/^\/spring/)) {
            _host = 'docs.spring.io';
        } else {
            _host = 'spring.io';
        }
        return 'https://' + _host + location.href.replace(/^https:..[^\/]+/, '');
    }

    function toggleJapanese(e) {
        var a = document.getElementById('help_link');
        a.href = replaceLink();
        e.stopPropagation();
    }

    var wapper = document.createElement('div');
    wapper.style.position = 'fixed';
    wapper.style.right = 0;
    wapper.style.top = 0;
    wapper.style.zIndex = 1000;
    var link = document.createElement('a');
    link.setAttribute('id', 'help_link');
    link.setAttribute('href', replaceLink());
    link.appendChild(document.createTextNode(official ? '日本語ページへ' : '英語ページへ'));
    link.addEventListener('click', toggleJapanese, false);
    link.addEventListener('mousedown', toggleJapanese, false);
    wapper.appendChild(link);

    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(wapper, body.firstChild);
})();