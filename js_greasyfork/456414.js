// ==UserScript==
// @name         Site Manager
// @namespace    https://greasyfork.org/users/28298
// @version      1.2
// @description  Manage sites
// @author       Jerry
// @include      /^https:\/\/.*omniupdate.*.com\/.*$/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @noframes
// @license      GNU GPLv3
// @require      https://greasyfork.org/scripts/456410-gmlibrary/code/GMLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/456414/Site%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/456414/Site%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // var links = document.getElementsByClassName('bti-job-detail-link');
    // var links = document.links;
    // for (var i = 0; i < links.length; i++){
    //     links[i].target="_blank";
    // }
    // document.documentElement.innerHTML

    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    var parts = window.location.href.split('/');
    var base = window.location.origin + '/' + parts[3] + '/' + parts[4] + '/' + parts[5] + '/';
    addbutton("PSY Page", function () {
        window.location.href = base + 'psych2015/browse/staging';
    }, 0.065*h, 0.08*w+150*1, 130);
    addbutton("PSY Upload", function () {
        window.location.href = base + 'psych2015/browse/production/';
    }, 0.065*h + 30, 0.08*w+150*1, 130);

    addbutton("Online Page", function () {
        window.location.href = base + 'onlinepsych2016/browse/staging';
    }, 0.065*h, 0.08*w+150*2, 130);
    addbutton("Online Upload", function () {
        window.location.href = base + 'onlinepsych2016/browse/production/';
    }, 0.065*h + 30, 0.08*w+150*2, 130);

    addbutton("Neuro Page", function () {
        window.location.href = base + 'neuroscience2017/browse/staging';
    }, 0.065*h, 0.08*w+150*3, 130);
    addbutton("Neuro Upload", function () {
        window.location.href = base + 'neuroscience2017/browse/production/';
    }, 0.065*h + 30, 0.08*w+150*3, 130);

    addbutton("Feature", function () {
        window.location.href = 'https://www.eiu.edu/apps/global/sites_list.php';
    }, 0.065*h, 0.08*w+150*4, 130);
})();
