// ==UserScript==
// @name        Github Clear Date
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.5.1
// @description Add a clear date to the relative time in Github
// @author      wzshiming
// @match       *://github.com/*
// @grant       none
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/431485/Github%20Clear%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/431485/Github%20Clear%20Date.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

    let config = {
        childList: true,
        subtree: true,
        attributes: true,
    };
    let observer = new MutationObserver(mutation);
    observer.observe(document.body, config);
    mutate(document.body);
})();

function mutate(elem) {
    elem.querySelectorAll('relative-time').forEach(mutateItem);
}

function mutateItem(item) {
    formatRelativeTime(item);
    removeTruncate(item);
}

function removeTruncate(item) {
    if (!item.parentNode.classList.contains("css-truncate")) {
        return;
    }
    item.parentNode.classList.remove("css-truncate");
}

function mutation(mutationsList) {
    for (let mutation of mutationsList) {
        mutate(mutation.target.parentNode);
    }
}

function formatRelativeTime(item) {
    let text = item.shadowRoot.innerHTML;
    if (text.length == 0) {
        return
    }

    let datetime = new Date(item.datetime);
    let now = new Date();

    let dateStr = formatTime(datetime, now);
    if (dateStr.length == 0) {
        return
    }

    if (text.includes(dateStr)) {
        return
    }
    item.shadowRoot.innerHTML = dateStr + ", " + text;
    return
}

function formatDate(datetime, now) {
    let hour = datetime.getHours();
    let minute = datetime.getMinutes();
    let second = datetime.getSeconds();
    let nowHour = now.getHours();
    let nowMinute = now.getMinutes();
    let nowSecond = now.getSeconds();

    if (hour == nowHour &&
        minute == nowMinute &&
        second == nowSecond) {
        return "";
    }

    return formatNumber(hour) + ":" + formatNumber(minute) + ":" + formatNumber(second);
}

function formatTime(datetime, now) {
    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    let day = datetime.getDate();
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth();
    let nowDay = now.getDate();

    if (year == nowYear &&
        month == nowMonth &&
        day == nowDay) {
        return formatDate(datetime, now);
    }

    // append date
    if (year == nowYear) { // this year will be omitted
        return formatNumber(month + 1) + "/" + formatNumber(day);
    }

    let century = Math.round(year / 100);
    let nowCentury = Math.round(nowYear / 100);
    if (century == nowCentury) { // this century will be omitted
        return formatNumber(year - 2000) + "/" + formatNumber(month + 1) + "/" + formatNumber(day);
    }

    return formatNumber(year) + "/" + formatNumber(month + 1) + "/" + formatNumber(day);
}

function formatNumber(num) {
    return num < 10 ? "0" + num : "" + num;
}
