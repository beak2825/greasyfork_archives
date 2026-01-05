// ==UserScript==
// @name         ao3 series collapser
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.5
// @description  collapse works that are later than part 1 of a series
// @author       scriptfairy
// @include      http://archiveofourown.org/*works*
// @include      https://archiveofourown.org/*works*
// @exclude      /https?://archiveofourown\.org/works/\d+/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/19012/ao3%20series%20collapser.user.js
// @updateURL https://update.greasyfork.org/scripts/19012/ao3%20series%20collapser.meta.js
// ==/UserScript==

var serColStyle = document.createElement('style');
serColStyle.innerHTML = '@keyframes hideSeries {from{opacity:1;} to {opacity:0.6;}} @keyframes showSeries {from{opacity:0.6;} to {opacity:1;}} .hideseries > * {display:none; animation: hideSeries 250ms ease-in-out both;} .hideseries>.series {display:block; opacity:0.6;} .showseries>*{display:block; animation: showSeries 250ms ease-in-out both;}';
document.head.appendChild(serColStyle);

var series = document.querySelectorAll('li.blurb ul.series');

for (i=0; i<series.length; i++) {
    var serText = series[i].innerText;
    if (serText.search('Part 1 of') == -1) {
        series[i].parentNode.className += ' series-collapse hideseries';
    }
}

var colSers = document.getElementsByClassName('series-collapse');

for (j=0; j<colSers.length; j++) {
    var colSer = colSers[j];
    colSer.onclick = function() {
        if (this.classList.contains('hideseries')) {
            this.classList.remove('hideseries');
            this.classList += ' showseries';
        } else {
            this.classList.remove('showseries');
            this.classList += ' hideseries';
        }
    };
}