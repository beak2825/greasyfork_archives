// ==UserScript==
// @name         GooglePreforme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://workplace.clickworker.com/en/clickworker/jobs/128767/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/130071/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369434/GooglePreforme.user.js
// @updateURL https://update.greasyfork.org/scripts/369434/GooglePreforme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    https://www.google.com/search?tbm=isch&as_q=&tbs=isz:lt,islt:4mp,sur:fmc
    // ==UserScript==
// @name         PreformeBingeSearche
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://workplace.clickworker.com/en/clickworker/jobs/128767/edit
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    jQuery("#task_info_1").show();
    jQuery("#task_wait_1").show();
    jQuery("#worked").show();
    jQuery("#task_one_1").show();
    jQuery("#task_two_1").show();
    jQuery("#task_three_1").show();
    jQuery(".subpages").show();
    jQuery('#task_one_1').show();
    jQuery('#task_two_1').show();
    var searchterm = document.getElementsByTagName('font')[2].textContent;
    var followsearch = document.getElementsByTagName('font')[6].textContent;
    searchterm = searchterm.replace(/\s/g, '%20');
    followsearch = followsearch.replace(/\s/g, '%20');
    var searchwindow = window.open('https://www.google.com/search?tbm=isch&as_q='+followsearch, "searcher", "width=600, height=800, top=0, left=110");
    document.getElementsByTagName('textarea')[0].textContent = 'https://www.google.com/search?tbm=isch&as_q='+searchterm;
    document.getElementsByTagName('textarea')[1].textContent = 'https://www.google.com/search?tbm=isch&as_q='+followsearch;
    document.getElementsByTagName('textarea')[2].oninput = function(){document.getElementsByName('submit_job')[0].click();searchwindow.close();};

    // Your code here...
})();
    // Your code here...
})();