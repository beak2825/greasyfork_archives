// ==UserScript==
// @name         Bangumi User Statstics on Topic Page+
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Display user statstics on topic, blog, subject pages. Data are fetched from user pages. High frequency of requests may cause 503 error, reload the page several times if that happens.
// @author       CryoVit
// @match        https://bgm.tv/group/topic/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://chii.in/group/topic/*
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        https://chii.in/subject/*
// @match        https://bgm.tv/blog/*
// @match        https://bangumi.tv/blog/*
// @match        https://chii.in/blog/*
// @icon         https://bgm.tv/img/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465469/Bangumi%20User%20Statstics%20on%20Topic%20Page%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/465469/Bangumi%20User%20Statstics%20on%20Topic%20Page%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const baseURL = 'https://bgm.tv/user/';
    if (window.location.href.match(/\/subject\//)) { // subject page
        let texts = document.getElementsByClassName('text');
        for (let i = 0; i < texts.length; i++) {
            let text = texts[i];
            let user = text.children[0];
            let uid = user.href.split('/').pop();
            if (sessionStorage.getItem(uid)) {
                let newspan = document.createElement('span');
                newspan.innerText = sessionStorage.getItem(uid);
                text.insertBefore(newspan, user.nextSibling);
                newspan.style.color = "#999999";
                newspan.style.fontSize = "10px";
                continue;
            }
            setTimeout(getRating, 1000, user, uid, "10px");
        }
    } else { // topic + blog page
        let inners = document.getElementsByClassName('inner');
        for (let i = 1; i < inners.length - 2; i++) {
            let inner = inners[i];
            let user = inner.getElementsByTagName('strong')[0];
            let uid = user.firstChild.href.split('/').pop();
            if (sessionStorage.getItem(uid)) {
                let newspan = document.createElement('span');
                newspan.innerText = sessionStorage.getItem(uid);
                user.parentNode.insertBefore(newspan, user.nextSibling);
                newspan.style.color = "#999999";
                newspan.style.fontSize = "12px"; // default font size = 14px
                continue;
            }
            setTimeout(getRating, 1000, user, uid);
        }
    }

    function getRating(user, uid, size="12px") {
        let reqURL = baseURL + uid;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', reqURL, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                let doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');
                let gridstats = doc.getElementsByClassName('gridStats')[0];
                let ent = gridstats.children[0].children[0].innerText;
                let vot = gridstats.children[1].children[0].innerText;
                let avg = gridstats.children[3].children[0].innerText;
                let std = gridstats.children[4].children[0].innerText;
                let rating = ' ' + vot + '/' + ent + ' ' + avg + '±' + std;
                let newspan = document.createElement('span');
                newspan.innerText = rating;
                user.parentNode.insertBefore(newspan, user.nextSibling);
                newspan.style.color = "#999999";
                newspan.style.fontSize = size;
                sessionStorage.setItem(uid, rating);
            }
        };
    }
})();