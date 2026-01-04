// ==UserScript==
// @name         CBC Schedule Tracker
// @author       @MSbitani
// @namespace    https://greasyfork.org/en/users/53803
// @description  Shows the time until each section of a lesson
// @match        https://github.com/coding-boot-camp/*TimeTracker.md
// @match        https://github.com/coding-boot-camp/*LessonPlan.md
// @match        https://github.com/coding-boot-camp/*LESSON-PLAN.md
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/397511/CBC%20Schedule%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/397511/CBC%20Schedule%20Tracker.meta.js
// ==/UserScript==

const classTimeZone = 'UTC';
const page = window.location.pathname.includes('TimeTracker.md') ? 'TT' : window.location.pathname.includes('LessonPlan.md') || window.location.pathname.includes('LESSON-PLAN.md') ? 'LP' : null;
const updateTimes = () => {
    if (page === 'TT') {
        for (const row of document.querySelectorAll('table > tbody > tr')) {
            row.children[0].textContent = `${Math.round((new Date(`${new Date().toDateString()} ${row.children[1].textContent} ${classTimeZone}`).getTime() - Date.now())/1000/60)} min`;
        }
    } else if (page === 'LP') {
        const start = new Date(`${new Date().toDateString()} ${document.querySelector('article > h1, article > h2').textContent.split('(')[1].split(')')[0]} ${classTimeZone}`).getTime();
        let runtime = 0;
        for (const header of [...document.querySelectorAll('article > h3 > span')]) {
            header.textContent = ` (${Math.round((new Date(start + runtime*60*1000).getTime() - Date.now())/1000/60)} min from now)`;
            runtime += Number(header.previousSibling.textContent.match(/\((\d*) *min/i)[1]);
        }
    } else return;
    setTimeout(updateTimes, 15000);
};
if (page === 'TT') {
    document.querySelector('table > thead > tr').prepend(Object.assign(document.createElement('th'), {innerText: 'From now'}));
    document.querySelectorAll('table > tbody > tr').forEach(row => row.prepend(document.createElement('td')));
} else if (page === 'LP') {
    [...document.querySelectorAll('article > h3')].filter(node => node.textContent.match(/\(\d* *min/gi)).forEach(node => node.append(document.createElement('span')));
}
updateTimes();