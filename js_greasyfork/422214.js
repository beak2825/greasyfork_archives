// ==UserScript==
// @name         Quora expand all the more buttons and comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Quora more buttons and answer's comments automatically expanded on mouse scroll
// @author       ClaoDD
// @match        https://www.quora.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422214/Quora%20expand%20all%20the%20more%20buttons%20and%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/422214/Quora%20expand%20all%20the%20more%20buttons%20and%20comments.meta.js
// ==/UserScript==

(window.onscroll = function(){[...document.querySelectorAll('.qt_read_more')].map( e => e.click() );
                              [...document.getElementsByClassName("q-text qu-fontSize--small qu-color--gray qu-truncateLines--1")].map( e => e.click() );
                              [...document.getElementsByClassName("fDkEAC")].map( e => e.click() );
                             })();
(function(){[...document.querySelectorAll('.ui_qtext_more_link')].map( e => e.click() );})();