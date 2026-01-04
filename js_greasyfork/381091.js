// ==UserScript==
// @name         QidianUnderground TOC Cleanup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Only show the series you care about. Add to the url to filter for your fav series, e.g. toc.qidianunderground.org/?s=library,release that witch,the king's avatar
// @author       Me
// @match        https://toc.qidianunderground.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381091/QidianUnderground%20TOC%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/381091/QidianUnderground%20TOC%20Cleanup.meta.js
// ==/UserScript==

function setCookie(name,value) {
    const date = new Date();
    date.setTime(date.getTime() + (365*24*60*60*1000));
    document.cookie = name + '=' + (value || '') + '; expires=' + date.toUTCString() + '; path=/';
}
function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

(function() {
    'use strict';

    const series = (location.search && location.search.indexOf("s=") > -1) ? decodeURIComponent(location.search.slice(1).split("&").find(s=>s.indexOf("s=")===0).slice(2).toLowerCase()).split(",") : ["library of heaven", "release that witch", "the king's avatar", "it's not easy", "cultivation chat"];

    [...document.getElementsByTagName("p")].forEach(p => {
        const title = p.firstChild.textContent.toLowerCase();
        const hasSeries = series.find(s => title.includes(s));
        if (hasSeries) {
            [...p.nextElementSibling.firstElementChild.childNodes].slice(0, -5).forEach(c => {
                c.parentNode.removeChild(c);
            });
        }
        else {
            p.style.display = 'none';
            p.nextElementSibling.style.display = 'none';
        }
    });

    [...document.getElementsByTagName("h3")].forEach(h => {h.style.display = 'none'});
    document.getElementsByTagName("h1")[0].style.display = 'none';
    document.getElementsByTagName("code")[0].style.display = 'none';
    document.getElementsByTagName("button")[0].style.display = 'none';

    const lastVisit = getCookie('lastVisitTime');
    const now = Date.now();
    if (lastVisit) {
        const minsSince = Math.ceil((now - parseInt(lastVisit)) / 60000);
        let lastVisitDt;
        if (minsSince < 120) lastVisitDt = minsSince + ' minutes ago';
        else if (minsSince < 60*48) lastVisitDt = 'about ' + Math.ceil(minsSince / 60) + ' hours ago';
        else lastVisitDt = 'about ' + Math.ceil(minsSince / 60 / 24) + ' days ago';
        document.getElementsByTagName("section")[0].firstElementChild.firstElementChild.insertAdjacentHTML("beforeend", "<small id=last class='content is-small'>Last visited: <code><abbr class=\"timeago\" title=\"" + new Date(parseInt(lastVisit)).toISOString() + '\">' + lastVisitDt + "</abbr></code>.</small>");
    }

    setCookie('lastVisitTime', now);

    [...document.getElementsByTagName('p')].forEach(p => {
        const cookie = getCookie(p.firstChild.textContent.replace(/[^A-Za-z0-9]/g, ''));
        if (cookie !== null) {
            const lastText = p.nextElementSibling.lastElementChild.lastElementChild.textContent;
            const color = (lastText.indexOf('-') > -1 ? lastText.split('-')[1] : lastText).indexOf(cookie.substring(1, cookie.length - 1)) > -1 ? 'grey' : 'red';
            p.nextElementSibling.lastElementChild.insertAdjacentHTML('beforeend', ' | <span class=mark style=\"color:' + color + '\">' + cookie + '</span>');
        }
    });

    [...document.getElementsByTagName('a')].forEach(a => {
        a.addEventListener('mouseup', e => {
            let mark = e.currentTarget.textContent;
            if (mark.indexOf('-') > -1) mark = mark.split('-')[1].trim();
            const last = e.currentTarget.parentNode.lastElementChild;
            const latest = (last.tagName === 'SPAN') ? last.previousElementSibling : last;
            const color = (latest.textContent.indexOf('-') > -1 ? latest.textContent.split('-')[1] : latest.textContent).indexOf(mark) > -1 ? 'grey' : 'red';
            mark = '(' + mark + ')';

            if (last.classList.contains('mark')) {
                last.textContent = mark;
                last.style.color = color;
            }
            else e.currentTarget.parentNode.insertAdjacentHTML('beforeend', ' | <span class=mark style=\"color:' + color + '\">' + mark + '</span>')

            const title = e.currentTarget.parentNode.parentNode.previousElementSibling.firstChild.textContent.replace(/[^A-Za-z0-9]/g, '');
            setCookie(title, mark);
        });

        a.href = 'https://amgine.princerevolution.org/paste.php?u=' + encodeURIComponent(a.href.replace('#', '~'));

    });
})();