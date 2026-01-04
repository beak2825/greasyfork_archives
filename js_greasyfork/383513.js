// ==UserScript==
// @name         scholar download
// @namespace    https://twitter.com/threadripper_
// @version      0.1.2
// @description  add scihub download button to google scholar
// @author       @threadripper_
// @match        https://scholar.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383513/scholar%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/383513/scholar%20download.meta.js
// ==/UserScript==

(function() {
var papers = document.querySelectorAll('.gs_ri');
papers.forEach(function(item){
	var paper_link = "https://sci-hub.tw/" + item.querySelector('.gs_rt a').href;
	var down_but = `<a target="_blank" href="${paper_link}" style= "color: red; font-weight: bold;">download</a>`;
	item.querySelector('.gs_ri .gs_fl').insertAdjacentHTML('beforeend', down_but);
});
})();