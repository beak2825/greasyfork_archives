// ==UserScript==
// @name         500px.com View
// @namespace    github.com/hrxn
// @version      0.5
// @description  Gets you to the real image (and more)!
// @author       Hrxn <github.com/hrxn>
// @license      Creative Commons BY-NC-SA
// @match        *://500px.com/*
// @grant        none
// @icon         https://assetcdn.500px.org/assets/favicon-1e8257b93fb787f8ceb66b5522ee853c.ico
// @downloadURL https://update.greasyfork.org/scripts/14810/500pxcom%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/14810/500pxcom%20View.meta.js
// ==/UserScript==
'use strict';

var fivehundredpx = function () {
    var resrc = [];
    var rname = [];
    function conWrite(link, title) {
        console.log(link);
        console.log(title);
    }
    function addLinks(src, fn) {
        var el = document.querySelector('.main_container .sidebar_region .actions_region');
        el.insertAdjacentHTML('afterEnd', '<a href="' + src + '" target="_blank"> [ View... ] </a> | <a href="' + src + '" download="' + fn + '"> [ Try Download... ] </a>');
    }
    function aryreset() {
        resrc = [];
        rname = [];
    }
    function afilters(s1, s2) {
        s2 = s2.replace(" on 500px", "");
        resrc.push(s1);
        rname.push(s2);
        if (resrc.length > 1 && rname.length > 1) {
            var r1 = resrc[resrc.length - 1];
            var r2 = rname[rname.length - 1];
            addLinks(r1, r2);
            conWrite(r1, r2);
            aryreset();
        } else {
            var r3 = resrc[0];
            var r4 = rname[0];
            addLinks(r3, r4);
            conWrite(r3, r4);
        }
    }
    var observerHandler = function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src' && mutation.target.className === 'photo' && mutation.target.src.indexOf('m%3D2048') > 0) {
                afilters(mutation.target.src, mutation.target.alt);
            }
        });
    };
    var MutationObserver = window.MutationObserver;
    var target = document.querySelector('body');
    var observer = new MutationObserver(observerHandler);
    var config = {attributes: true, subtree: true};
    observer.observe(target, config);
};
fivehundredpx();
