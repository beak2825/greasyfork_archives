// ==UserScript==
// @name         AO3: [Wrangling] Exclude Subtags and Synonyms
// @namespace    https://greasyfork.org/en/users/1322876-keladry
// @version      2.2
// @description  Link to works for a canonical tag, excluding all sub tags and syns
// @author       keladry
// @match        *://*.archiveofourown.org/tags/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498709/AO3%3A%20%5BWrangling%5D%20Exclude%20Subtags%20and%20Synonyms.user.js
// @updateURL https://update.greasyfork.org/scripts/498709/AO3%3A%20%5BWrangling%5D%20Exclude%20Subtags%20and%20Synonyms.meta.js
// ==/UserScript==

//Gets the particular tags, if any such exist on the landing page
function get_landing_tags(elements) {
    if (elements.length > 0) {
        return elements.item(0).getElementsByTagName('li');
    }
    else {
        return []
    }
}

//Gets the particular tags, if any such exist on the edit page
function get_edit_tags(element) {
    if (document.getElementById(element) != null) {
        return document.getElementById(element).childNodes[0].getElementsByTagName('li');
    }
    else {
        return []
    }
}

function search_string(canonical, excludes) {
    var start = "https://archiveofourown.org/works?commit=Sort+and+Filter&work_search%5Bexcluded_tag_names%5D=";
    return(start + excludes + "&tag_id=" + encodeURIComponent(canonical));
}

(function() {
    'use strict';

// Landing Page
if ((document.getElementsByClassName('sub').length > 0) || (document.getElementsByClassName('synonym').length > 0)){

    var subtags_landing = get_landing_tags(document.getElementsByClassName('sub'));
    var syns_landing = get_landing_tags(document.getElementsByClassName('synonym'));
    var excludes_landing = "";

    for(var i=0; i <= subtags_landing.length-1; i++){
        excludes_landing += encodeURIComponent(subtags_landing[i].childNodes[0].innerText);

        if (i < subtags_landing.length-1){
            excludes_landing += encodeURIComponent(",");
        }
    }

    if ((subtags_landing.length > 0) && (syns_landing.length > 0)) {
        excludes_landing += encodeURIComponent(",");
    }

    for(var l=0; l <= syns_landing.length-1; l++){
        excludes_landing += encodeURIComponent(syns_landing[l].childNodes[0].innerText);

        if (l < syns_landing.length-1){
            excludes_landing += encodeURIComponent(",");
        }
    }

    if (excludes_landing != "") {
        var canonical_landing = document.querySelector('h2.heading').innerHTML;
        var search_landing = search_string(canonical_landing, excludes_landing)
        var buttons_landing = document.querySelector('.tag [role="navigation"]');
        var button_landing = document.createElement("li");
        button_landing.innerHTML = '<a href="' + search_landing + '">Exclude Subtags & Syns</a>';
        buttons_landing.insertBefore(button_landing, buttons_landing.childNodes[0]);
    }
}
// Edit Page
else if (document.getElementsByClassName('tags-edit').length > 0) {

    var subtags_edit = get_edit_tags("child_SubTag_associations_to_remove_checkboxes");
    var syns_edit = get_edit_tags("child_Merger_associations_to_remove_checkboxes");
    var excludes_edit = ""

    for(var j=0; j <= subtags_edit.length-1; j++){
        excludes_edit += encodeURIComponent(subtags_edit[j].innerText);

        if (j < subtags_edit.length-1){
            excludes_edit += encodeURIComponent(",");
        }
    }

    if ((subtags_edit.length > 0) && (syns_edit.length > 0)) {
        excludes_edit += encodeURIComponent(",");
    }

    for(var k=0; k <= syns_edit.length-1; k++){
        excludes_edit += encodeURIComponent(syns_edit[k].innerText);

        if ( k < syns_edit.length-1){
            excludes_edit += encodeURIComponent(",");
        }
    }

    if (excludes_edit != "") {
        var canonical_edit = document.getElementById("tag_name").value;
        var search_edit = search_string(canonical_edit, excludes_edit);
        var button_edit = document.querySelectorAll("div.tag.wrangling ul.navigation")[1];
        button_edit.innerHTML = button_edit.innerHTML + '<li><a href="' + search_edit + '">Exclude Subtags & Syns</a></li>';
    }
}


})();