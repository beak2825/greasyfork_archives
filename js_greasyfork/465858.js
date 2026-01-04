// ==UserScript==
// @name         Prettify PTT
// @version      0.3
// @description  Makes PTT easier on the eyes. 降低PPT造成的視覺壓力。
// @author       ElectroKnight22
// @match        *://www.ptt.cc/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABx0lEQVR4AXWSgWdCURTGT3lDs2GYYcQYMdAA2VjY9GdUGixSIIQABIFqA7EMlgAYTG0RISkDCg00JrChV3Xfa9+9vTNPXoef797X/e4553RdvVyOzPmcjMWCTGDM535oDPsbqA97gg6wfzWXyzLWfXVuuSQTuDrZLF/gwQ/30Ij9QlYc5v0j1nGgA3KL6ZSErnugdRCx9mQAVmM2U2sBxToC6sADSDNgwK0F3B7YzMqlcgU2AqBgCnHreo9G/TD07MbrapV29vfJHt/tNnUyGfodjQhGWuEi6LlsISmrgKpyJU5xFAhQsFKRQ7YPPelGb5fC3ieg1YpktFMpej49pVY8rvZ7Xi8dnJ1JM7dypSGj9/+DpWs7qTUuVsqhTybrM4YhOdaQ0W5WcAUXpZKC46vRoJ/hkM0kw40MY6B6Y5ziI5+nl1CIVkKwWcZYg7mJrCecXU6YK3gLh+mzViPTyijZiKYbj6O4rQKZTfVr9ewQRQ1/SVe9cSFiQJp4iMokv22JMuhqyCgPJWD0odRLKD0dHhLW3IpTtEBCDdF6EDqebBCaRjU6z8EhdJAGQWtNrvLuLg+Is/rw/Q5cAb9l7IMmeAADssUfe8oQdrIClQUAAAAASUVORK5CYII=
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @namespace    https://www.ptt.cc/
// @downloadURL https://update.greasyfork.org/scripts/465858/Prettify%20PTT.user.js
// @updateURL https://update.greasyfork.org/scripts/465858/Prettify%20PTT.meta.js
// ==/UserScript==

GM_addStyle ( `
#topbar-container {
    background-color: #2277dd;
}

#topbar a:link, #topbar a:visited, #topbar a:hover {
    color: #eee;
}

#logo:link, #logo:visited, #logo:hover {
    text-decoration: none;
    color: #eee;
}

#action-bar-container {
    background-color: transparent;
}

body {
    background-color: #030303;
}

#main-content a:link {
    color: #88c;
}

.article-meta-tag {
    padding: 0;
    background-color: transparent;
    color: #666;
}

.article-metaline-right {
    visibility: hidden;
}

.article-meta-value {
    color: #d88;
    background-color: transparent;
}

.article-metaline {
    color: #ddd;
    background-color: transparent;
}

.richcontent {
    width: fit-content;
    margin: 1em;
}

.bbs-screen {
    color: #bebebe;
    background-color: #1a1a1b;
    /* changing line height breaks arts */
    /* line-height: 1.4; */
    padding: 1em;
    margin: 1.8em auto;
    border-radius: 10px;
}

.r-ent {
    border-radius: 10px;
}

.f2 {
    color: #4c4;
}

.hl.f3 {
    color: #da5;
}

.f3 {
    color: #b85;
}

#navigation a:link, #navigation a:visited {
    color: #cdcdcd;
}

#navigation-container {
    background-color: #383838;
}

#navigation a:hover {
    color: #eee;
    background-color: #4b4b4b;
    text-decoration: none;
}
a:hover {
    color: #eee;
    background-color: #4b4b4b;
}

#article-polling {
    width: -moz-fit-content;
    width: fit-content;
    background-color: transparent;
    min-width: 0;
}

` );




// only starts after website has finish loading
window.addEventListener('load', function() {
    'use strict';

    var author = document.getElementsByClassName('article-metaline')[0];
    var title = document.getElementsByClassName('article-metaline')[1];
    var time = document.getElementsByClassName('article-metaline')[2];

    var titleClone = title.cloneNode(true);

    title.style.backgroundColor = "red";
    title.parentNode.insertBefore(titleClone, author);
    title.parentNode.removeChild(title);
})();