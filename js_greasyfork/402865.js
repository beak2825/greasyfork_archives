// ==UserScript==
// @name         Skills left on Duolingo
// @version      0.1
// @description  Display skills left for a duolingo lesson
// @author       David Boclé
// @include     https://www.duolingo.com/*
// @namespace https://greasyfork.org/users/555204
// @downloadURL https://update.greasyfork.org/scripts/402865/Skills%20left%20on%20Duolingo.user.js
// @updateURL https://update.greasyfork.org/scripts/402865/Skills%20left%20on%20Duolingo.meta.js
// ==/UserScript==

function skillsLeftScript() {
    let oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    let firstDate = new Date();
    let secondDate = new Date(firstDate.getFullYear(),12,31);
    let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

    let rootElement = document.getElementById('root');
    let reactInstance = rootElement[Object.keys(rootElement)[0]];
    let skills = reactInstance.memoizedState.element.props.store.getState().skills

    let {lessonsLeft,skillsLeft} = Object.keys(skills).reduce((prev, current) => {
        prev.lessonsLeft += (skills[current].lessons - skills[current].finishedLessons)
        if (skills[current].finishedLessons < skills[current].lessons) prev.skillsLeft++
        return prev;
    }, {lessonsLeft: 0, skillsLeft: 0});
    let lessonsPerDay = parseFloat((lessonsLeft / diffDays).toFixed(2));

    console.log(`${lessonsLeft} Lessons left out of ${skillsLeft} skills
That's about ${lessonsPerDay} new lessons each day
(If you want to clear the course by end of year :))`);
}

(function() {
    'use strict';
    setTimeout(skillsLeftScript, 1000)
})();