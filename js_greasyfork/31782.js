// ==UserScript==
// @name         GitHub Sourcegraph Button
// @namespace    yikai.info
// @version      1.0.1
// @description  An userscript to add "Sourcegraph" button on github.
// @author       martianyi
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31782/GitHub%20Sourcegraph%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/31782/GitHub%20Sourcegraph%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var rawUrl = '';

    function replace(){
        var rawBtn = document.querySelector('#raw-url');
        if(rawBtn && rawUrl !== rawBtn.href){
            rawUrl = rawBtn.href;
            createButton(rawBtn);
        }
    }

    function createButton(btn) {

        var newBtn = btn.cloneNode(false);
        newBtn.removeAttribute("id");
        newBtn.setAttribute('class', 'btn btn-sm BtnGroup-item');
        newBtn.textContent = "Sourcegraph";
        newBtn.href = "";
        newBtn.addEventListener('click', goToSourcegraph);

        btn.parentNode.insertBefore(newBtn, btn.nextSibling);

        if (!btn.parentNode.classList.contains("btn-group")) {
            var parent = btn.parentNode,
                group = document.createElement("div");
            group.className = "btn-group";
            while (parent.childNodes.length) {
                group.appendChild(parent.childNodes[0]);
            }
            parent.appendChild(group);
        }
    }

    function goToSourcegraph(event) {
        event.preventDefault();
        var pats = [
            ['^/([^/]+)/([^/]+)/tree/([^/]+)$', '/github.com/$1/$2@$3', '^/github.com/([^/]+)/([^/@]+)@([^/]+)$', '/$1/$2/tree/$3'],
            ['^/([^/]+)/([^/]+)/tree/([^/]+)/(.+)$', '/github.com/$1/$2@$3/-/tree/$4', '^/github.com/([^/]+)/([^/@]+)@([^/]+)/-/tree/(.+)$', '/$1/$2/tree/$3/$4'],
            ['^/([^/]+)/([^/]+)/blob/([^/]+)/(.+)$', '/github.com/$1/$2@$3/-/blob/$4', '', ''],
            ['^/([^/]+)/([^/]+)$', '/github.com/$1/$2', '^/github.com/([^/]+)/([^/]+)$', '/$1/$2'],
            ['^/([^/]+)$', '/$1', '^/([^/]+)$', '/$1'],
        ];
        var pathname = window.location.pathname;
        for (var i = 0; i < pats.length; i++) {
            var pat = pats[i];
            var r,
                pathname2;
            if (window.location.hostname === 'github.com') {
                if (pat[0] === '') {continue;}
                r = new RegExp(pat[0]);
                if (pathname.match(r)) {
                    pathname2 = pathname.replace(r, pat[1]);
                    window.location = 'https://sourcegraph.com' + pathname2;
                    return;
                }
            } else {
                if (pat[2] === '') { continue; }
                r = new RegExp(pat[2]);
                if (pathname.match(r)) {
                    pathname2 = pathname.replace(r, pat[3]);
                    window.location = 'https://github.com' + pathname2;
                    return;
                }
            }
        }
        alert('Unable to jump to Sourcegraph (no matching URL pattern).');
    }

    var container =
        document.querySelector("#js-repo-pjax-container") ||
        document.querySelector("#js-pjax-container");

    if (container) {
        new MutationObserver(function(){
            replace();
        }).observe(container, {childList: true, subtree: true});
    }

    replace();
})();