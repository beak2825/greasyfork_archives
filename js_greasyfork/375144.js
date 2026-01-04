// ==UserScript==
// @name         arxiv author link correction
// @namespace    https://github.com/refraction-ray/general-scripts
// @version      0.1
// @description  correct the fragile author links
// @author       refraction-ray
// @match        https://arxiv.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375144/arxiv%20author%20link%20correction.user.js
// @updateURL https://update.greasyfork.org/scripts/375144/arxiv%20author%20link%20correction.meta.js
// ==/UserScript==

(function() {
    'use strict';
var a=document.querySelectorAll('div.list-authors > a');
if (a.length===0){
	a = document.querySelectorAll('p.authors > a');
}
if (a.length===0){
	a = document.querySelectorAll('div.authors > a');
}
var url1 = 'https://arxiv.org/search/?query=%22';
var url2 = '%22&searchtype=author&abstracts=show&order=-announced_date_first&size=50';
for (var i=0;i<a.length;i++) {
	a[i].href = url1+a[i].textContent.split(' ').join('+')+url2;
}
})();