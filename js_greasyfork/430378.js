// ==UserScript==
// @name         Filman.cc
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Filman script
// @author       You
// @match        https://filman.cc/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/430378/Filmancc.user.js
// @updateURL https://update.greasyfork.org/scripts/430378/Filmancc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function ready() {
        if (window.opener) {
            const filman = document.querySelector(".filman");
            if(filman){
                window.opener.postMessage("loaded", "*");
            }
        }

        document.querySelectorAll("#color-switch,#cookies,#fb-root,#belt,header,.filman,center,.description,#single-poster,div.clearfix,thead > tr.version, #wrapper > .container, .fa-sort, #search").forEach(function(item) {
            item.remove();
        });
        const el = document.querySelector("#item-info");
        if(el){
            el.classList = [];
        }
        const el1 = document.querySelector("#link-list");
        if(el1){
            el1.setAttribute("style", "");
        }
        const body = document.querySelector("body");
        if(body){
            body.setAttribute("style", "padding: 2em");
        }
        document.querySelectorAll("a.select-version").forEach(function(item) {
            item.removeAttribute("href");
            item.setAttribute("style", "cursor: pointer");

            item.addEventListener('click', function(){
                const selectedVersion = item.textContent;
                document.querySelectorAll("tr.version").forEach(function(item) {
                    item.setAttribute("style", "");
                });
                if (selectedVersion !== 'Wszystkie') {
                    document.querySelectorAll("tr.version").forEach(function(item) {
                        if(selectedVersion === 'Lektor') {
                            if (!item.textContent.includes(selectedVersion) || item.textContent.includes('Lektor_IVO')) {
                                item.setAttribute("style", "display: none");
                            }
                        } else if (!item.textContent.includes(selectedVersion)) {
                            item.setAttribute("style", "display: none");
                        }
                    });
                }
            });
        });

        document.querySelectorAll(".link-to-video > a").forEach(function(item) {
            item.removeAttribute("href");
            item.removeAttribute("target");
            item.setAttribute("style", "cursor: pointer");

            item.addEventListener('click', function(){
                const url = JSON.parse(atob(item.getAttribute('data-iframe'))).src;
                const path = location.pathname.split('/');
                var name = path[2];
                var sname = '';
                if (path[1] === 'serial-online') {
                    sname = name;
                    name = document.querySelector('h3').textContent;
                }
                var msg = url + "|" + name;
                if (sname) {
                    msg += "|" + sname;
                }
                window.parent.postMessage(msg, "*");
            }, false);
        });
    }
    document.addEventListener('beforescriptexecute', function(e){
        const loaded = document.getElementsByClassName('filman').length > 0;
        if(loaded){
            e.stopPropagation ();
            e.preventDefault ();
            e.target.parentNode.removeChild (e.target);
        }
    }, true);
    document.addEventListener("DOMContentLoaded", ready);
})();