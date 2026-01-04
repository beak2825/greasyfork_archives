// ==UserScript==
// @name         See unfollows [neocities.org]
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  See people who unfollowed you. Also shows when people change their site name.
// @author       https://neocities.org/site/dimden
// @match        https://neocities.org/
// @match        https://neocities.org/?page=*
// @match        https://neocities.org/site/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neocities.org
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450226/See%20unfollows%20%5Bneocitiesorg%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/450226/See%20unfollows%20%5Bneocitiesorg%5D.meta.js
// ==/UserScript==

(async () => {
    let mySite = document.querySelector(".dropdown-menu > li > a[href^='/site/']").href.split('neocities.org/site/')[1];
    if(location.pathname.startsWith('/site/')) {
        let currentLocation = location.pathname.slice(6).split("?")[0].split("#")[0];
        if(currentLocation !== mySite) return;
    }
    function getDateFromTimeAgo(timeString) {
        const timeAgo = { hours: 0, minutes: 0, seconds: 0, days: 0, weeks: 0, months: 0, years: 0 };

        const secondsAgoMatches = timeString.match(/^(\d+) (seconds? ago)/);
        const minutesAgoMatches = timeString.match(/^(\d+) (minutes? ago)/);
        const hoursAgoMatches = timeString.match(/^(\d+) (hours? ago)/);
        const daysAgoMatches = timeString.match(/^(\d+) (days? ago)/);
        const weeksAgoMatches = timeString.match(/^(\d+) (weeks? ago)/);
        const monthsAgoMatches = timeString.match(/^(\d+) (months? ago)/);
        const yearsAgoMatches = timeString.match(/^(\d+) (years? ago)/);

        if (secondsAgoMatches) {
            timeAgo.seconds = secondsAgoMatches[1];
        }
        if (minutesAgoMatches) {
            timeAgo.minutes = minutesAgoMatches[1];
        }
        if (hoursAgoMatches) {
            timeAgo.hours = hoursAgoMatches[1];
        }
        if (daysAgoMatches) {
            timeAgo.days = daysAgoMatches[1];
        }
        if (weeksAgoMatches) {
            timeAgo.weeks = weeksAgoMatches[1];
        }
        if (monthsAgoMatches) {
            timeAgo.months = monthsAgoMatches[1];
        }
        if (yearsAgoMatches) {
            timeAgo.years = yearsAgoMatches[1];
        }

        let d = Date.now();
        d -= timeAgo.seconds * 1000;
        d -= timeAgo.minutes * 60 * 1000;
        d -= timeAgo.hours * 60 * 60 * 1000;
        d -= timeAgo.days * 24 * 60 * 60 * 1000;
        d -= timeAgo.weeks * 7 * 24 * 60 * 60 * 1000;
        d -= timeAgo.months * 30 * 24 * 60 * 60 * 1000;
        d -= timeAgo.years * 365 * 24 * 60 * 60 * 1000;

        return d;
    }

    function findBetween(date) {
        let news = Array.from(document.getElementsByClassName('news-item')).map(e => ({ el: e, time: getDateFromTimeAgo(e.getElementsByClassName('date')?.[0]?.innerText ?? '1 second ago') }));
        for (let i = 0; i < news.length; i++) {
            if (news[i].time < date && Math.abs(news[i].time-date) < 8.82e+7) {
                return news[i].el;
            }
        }
    }
    const relativeTimePeriods = [
        [31536000, 'year'],
        [2419200, 'month'],
        [604800, 'week'],
        [86400, 'day'],
        [3600, 'hour'],
        [60, 'minute'],
        [1, 'second']
    ];

    function relativeTime(date) {
        if (!(date instanceof Date)) date = new Date(date * 1000);
        const seconds = (new Date() - date) / 1000;
        for (let [secondsPer, name] of relativeTimePeriods) {
            if (seconds >= secondsPer) {
                const amount = Math.floor(seconds / secondsPer);
                return `${amount} ${name}${amount && amount !== 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    }
    async function getCurrentFollowers() {
        const followerPage = await fetch(`https://neocities.org/site/${mySite}/followers`).then(res => res.text());
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(followerPage, "text/html");
            return Array.from(doc.querySelectorAll('.username > a')).map(u => u.innerText.replace(/\n/g, '').trim()).filter(u => !u.includes('/'));
        } catch(e) {
            console.error('error getting followers', e);
            console.log(followerPage);
        }
        return [];
    }

    let currentFollowers = await getCurrentFollowers();
    if(currentFollowers.length === 0) return;

    let previousFollowers = localStorage.followings ? JSON.parse(localStorage.followings) : [];
    let newUnfollows = previousFollowers.filter(e => !currentFollowers.includes(e));
    let unfollows = localStorage.unfollows ? JSON.parse(localStorage.unfollows) : [];
    let renamed;
    let notifCount = document.getElementsByClassName("notification-value")[0];
    if(newUnfollows.length === 1 && currentFollowers.length === previousFollowers.length && !notifCount) {
        renamed = currentFollowers.find(f => !previousFollowers.includes(f));
    }

    for (let i in newUnfollows) {
        unfollows.push([newUnfollows[i], Date.now(), !(await fetch(`https://neocities.org/site/${newUnfollows[i]}`, {redirect: 'manual'})).ok, renamed]);
    }
    unfollows = unfollows.filter(u => !currentFollowers.includes(u[0]));

    localStorage.unfollows = JSON.stringify(unfollows);
    localStorage.followings = JSON.stringify(currentFollowers);

    unfollows = unfollows.reverse();
    for (let i in unfollows) {
        let [nick, date, disabledProfile, renamed] = unfollows[i];
        let el = findBetween(date);
        if (el) {
            let unfollowElement = document.createElement('div');
            unfollowElement.className = 'news-item unfollow';
            unfollowElement.innerHTML = /*html*/`
        <div class="title">
            <div class="icon"><a href="/site/${nick}" title="${nick}" class="avatar" style="background-image: url(/site_screenshots/21/90/${nick}/index.html.50x50.jpg);"></a></div>
            <div class="text">
                <a href="/site/${nick}" class="user">${nick}</a> ${renamed ? `renamed to <a href="/site/${renamed}" class="user">${renamed}</a>` : disabledProfile ? 'disabled profile.' : 'unfollowed you!'}
            </div>
            <a class="date" style="color:#aaa" href="https://greasyfork.org/en/scripts/450226-see-unfollows-neocities-org" target="_blank">detected ${relativeTime(new Date(date))}</a>
        </div>`;
            el.before(unfollowElement);
        }
    }
})();