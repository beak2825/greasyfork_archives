// ==UserScript==
// @name         Wonder island distance
// @name:ru		 Расстояние до чудоостровов
// @namespace    http://grepolis.scripts/
// @version      1.1.0
// @description  Shows island cities ring number and average distance to wonder islands
// @description:ru  Показывает номер кольца, в котором города острова, и среднее расстояние до чудоостровов
// @author       Plest
// @include      /^https?:\/\/ru85\.grepolis\.com\/game\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422575/Wonder%20island%20distance.user.js
// @updateURL https://update.greasyfork.org/scripts/422575/Wonder%20island%20distance.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const wonders = [
        [552, 453],
        [546, 451],
        [542, 449],
        [536, 448],
        [553, 445],
        [549, 444],
        [550, 439]
    ];

    function getDistance(coords) {
        return wonders.map(wonder => (Math.sqrt((wonder[0] - coords[0]) * (wonder[0] - coords[0]) + (wonder[1] - coords[1]) * (wonder[1] - coords[1]))));
    }

    function getGrade(distance) {
        const thresholdLevel = 66.81;
        const rounds = 3;
        const gradeValue = thresholdLevel / rounds;
        return Math.floor(distance / gradeValue);
    }

    function addForumControl() {
        const threadTitle = document.getElementById('threadtitle');

        const showGrades = document.getElementById('show-grades');
        if (showGrades) {
            aboutRevoltsLink.parentElement.removeChild(showGrades);
        }

        const link = document.createElement('a');
        link.setAttribute('id', 'show-grades');
        link.appendChild(document.createTextNode('Показать расстояния '))
        link.style.float = 'right';

        if (threadTitle) {
            link.style.backgroundColor = 'white';
            link.addEventListener('click', handleClick);
            threadTitle.appendChild(link);
        }
    }

	function handleClick() {
        if (!document.querySelector('.thread')) {
            parseCities();
        }
	}

    function parseCities() {
        const bbTowns = document.getElementsByClassName('bbcodes_town');
        for (const bbTown of bbTowns) {
            const link = bbTown.querySelector('a');
            const codedValues = link.getAttribute('href').substring(1);
            const decodedValues = JSON.parse(atob(codedValues));

            const distances = getDistance([decodedValues.ix, decodedValues.iy]);
            const distance = distances.reduce((a, b) => a + b, 0) / wonders.length;
            const grade = getGrade(distance);
            if (link.innerHTML.indexOf('(') === -1) {
                link.appendChild(document.createTextNode(`(${grade}, ${distance.toFixed(2)})`));
            }
        }
    }

    jQuery(document).ajaxComplete(function(event, xhr, settings){
        const type = settings.url.replace(/.*action=(.*)&h.*/g, "$1");
        if (type === 'index') {
            const coordsEl = document.querySelector('.islandinfo_coords');
            if (coordsEl) {
                const coords = coordsEl.innerHTML.match(/\d+\/\d+/)[0].split('/');
                const distances = getDistance(coords);
                const aveDistance = distances.reduce((a, b) => a + b, 0) / wonders.length;

                coordsEl.appendChild(
                    document.createTextNode(` ${getGrade(aveDistance)} (${aveDistance.toFixed(2)})`)
                );
            }
        } else if (type === 'forum') {
            addForumControl();
        }
    });
})();
