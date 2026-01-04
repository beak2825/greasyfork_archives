// ==UserScript==
// @name            Visted Link Highlighter
// @version         2019.08.21
// @description     this code highlight visited links
// @author          jerry
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @run-at          document-end
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_openInTab

// @match           https://neurojobs.sfn.org/*
// @match           https://www.higheredjobs.com/*
// @match           https://www.alzforum.org/jobs*
// @match           https://www.higheredjobs.com/*
// @match           https://sprweb.org/networking*
// @match           https://careers.cccu.org/jobs/*
// @match           https://jobs.psychologicalscience.org/jobs/*
// @match           https://chroniclevitae.com/job_search*
// @match           https://scholar.google.com/*
// @match           https://www.ncbi.nlm.nih.gov/pubmed*
// @namespace https://greasyfork.org/users/28298
// @downloadURL https://update.greasyfork.org/scripts/441714/Visted%20Link%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/441714/Visted%20Link%20Highlighter.meta.js
// ==/UserScript==

function highlight_visited_links(){
// localStorage.clear();
var visited_links = JSON.parse(localStorage.getItem('visited_links')) || [];
var links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
    var that = links[i];
    that.onclick = function () {
        var clicked_url = this.href;
        if (visited_links.indexOf(clicked_url)==-1) {
            visited_links.push(clicked_url);
            localStorage.setItem('visited_links', JSON.stringify(visited_links));
            this.style.color = "#8000ff"; // change color right away
            try{this.firstElementChild.style.color = "#8000ff";} catch(e){} // chroniclevitae.com
        }
    }

    if (visited_links.indexOf(that.href)!==-1) {
        links[i].style.color = "#8000ff"; // change color previously clicked
        try{links[i].firstElementChild.style.color = "#8000ff";} catch(e){}// chroniclevitae.com
    }
}
}
highlight_visited_links();
