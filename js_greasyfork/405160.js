// ==UserScript==
// @name         Discogs/Release/PrivateList
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       denlekke
// @include      http*://*discogs.com/*release/*
// @grant        GM.xmlHttpRequest
// @connect.     https://docs.google.com/spreadsheets/d/e/
// @downloadURL https://update.greasyfork.org/scripts/405160/DiscogsReleasePrivateList.user.js
// @updateURL https://update.greasyfork.org/scripts/405160/DiscogsReleasePrivateList.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var releaseId = 0;
    if(window.location.href.includes("release/")){
        releaseId=parseInt(window.location.href.split('release/')[1]);
    }

    var page_aside=document.getElementById('page_aside');

    var section_contribs=document.getElementsByClassName('section contribs')[0];

    //new structure added
    var section_div=document.createElement('div');
    var section_title=document.createElement("h3");
    var lists_div_outer = document.createElement("div");
    var lists_div_inner = document.createElement("div");

    //lists
    var list_content=document.createElement('div');

    section_div.setAttribute('class', 'section list toggle_section  toggle_section_show_controls  toggle_section_remember');
    section_div.setAttribute('data-toggle-section-id','list');
    section_div.setAttribute('id','list');

    section_title.setAttribute('class','toggle_section_control float_fix');
    section_title.setAttribute('data-for','.list');
    section_title.innerHTML = '<i class="icon icon-chevron-down"></i><i class="icon icon-chevron-up"></i>Private Lists';

    lists_div_outer.setAttribute('class','section_content toggle_section_content');

    lists_div_inner.setAttribute('id','lists2');
    lists_div_inner.setAttribute('class','section_content toggle_section_content');

    //insert structure
    page_aside.insertBefore(section_div, section_contribs);
    section_div.appendChild(section_title);
    section_div.appendChild(lists_div_outer);
    lists_div_outer.appendChild(lists_div_inner);

    //Get all lists
    GM.xmlHttpRequest({
        method: "GET",
        url: "http://denlekke.aphrodite.feralhosting.com:5000/private_lists?release_id="+releaseId,
        onload: function(response) {
            console.log(response);
            list_content.innerText = response.responseText;
        }
    });

    lists_div_inner.appendChild(list_content);
}
)();