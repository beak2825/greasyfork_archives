// ==UserScript==
// @name         Programming Hero - Scrollable Course Timeline
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Make course timeline scrollable
// @author       Ramin
// @match        *://*bangla.programming-hero.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397526/Programming%20Hero%20-%20Scrollable%20Course%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/397526/Programming%20Hero%20-%20Scrollable%20Course%20Timeline.meta.js
// ==/UserScript==

var css = `.course_timeline.accordion {
        height: 75vh;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .unit_title {
        margin-bottom: 0px;
    }
// extra style
header.sleek.transparent.fixed {
    position: absolute;
}

.unit_title_extras h1,.course_timeline.accordion, div#unit h1, div#unit, div#unit_content, .unit_prevnext {
    margin: 0;
}


#unit h1 {
    font-size: 1.5rem;
}

.course_timeline.accordion {
    margin-top: 0;
}

.progress.course_progressbar.increment_complete {
    margin-top: 10px;
}

.more_course {
    margin-bottom: 10px;
}
header.sleek.transparent.fix.fixed {
    display: none !important;
}

@media only screen and (max-width: 1800px) {
    .container-fluid .col-md-9 {
        width: 100% !important;
    }
    .container-fluid .col-md-3 {
        width: 100% !important;
    }

}
`,
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
};
head.appendChild(style);
// make container fluid
document.getElementById('content').querySelector('.container').className = 'container-fluid';