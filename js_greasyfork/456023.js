// ==UserScript==
// @name         AO3: [Wrangling] Search my canonicals for illegal characters
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      3.0
// @description  automatically runs a fandom-specific tag search over all your assigned fandoms, to find any canonicals with 'illegal' characters such as curly quotes or Chinese pipes
// @author       escctrl
// @match        https://archiveofourown.org/tags/search
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456023/AO3%3A%20%5BWrangling%5D%20Search%20my%20canonicals%20for%20illegal%20characters.user.js
// @updateURL https://update.greasyfork.org/scripts/456023/AO3%3A%20%5BWrangling%5D%20Search%20my%20canonicals%20for%20illegal%20characters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COPY_SEARCH_STRING = false;

    const DEBUG = false;

    var found = 0; // counting found results

    var node_ul = document.getElementById('wranglerbuttons') || document.querySelector('#main ul.navigation.actions');
    const node_li = document.createElement('li');

    node_li.id = 'checkillegal';
    node_li.className = 'reindex';
    node_li.innerHTML = "<a href='#'>Check Illegal Characters</a>";
    if (COPY_SEARCH_STRING) node_li.addEventListener("click", copySearchString);
    else node_li.addEventListener("click", startBackgroundCheck);
    node_ul.appendChild(node_li);

    function copySearchString() {
        document.getElementById('tag_search_name').value = "*’* OR *‘* OR *“* OR *”* OR *｜* OR *–* OR *—* OR *―* OR *（* OR *）* OR *\\'\\'*";
        var tagtype = document.getElementById('tag_search_status');
        if (tagtype !== null) tagtype.value = 'T'; // if the Smaller Tag Search script is enabled
        else document.getElementById('tag_search_canonical_t').checked = true; // for the plain New Tag Search form
    }

    function startBackgroundCheck() {
        // who am I logged in as?
        const user = document.querySelector('#greeting ul.user.navigation li.dropdown>a.dropdown-toggle[href*="/users/"]').href.match(/\/([A-Za-z0-9_]+)\/?$/i)[1];
        if (DEBUG) console.log("Illegal Characters: Logged in as user "+user);

        window.ao3jail = false;

        // get a list of all my wrangled fandoms
        pageload('https://archiveofourown.org/tag_wranglers/'+user, 'fandoms');
    }

    function retrieveFandomList(me) {
        // find all the assigned fandoms in the table (URL and name)
        const fandomlist = me.querySelectorAll('table tbody tr th a');

        // add a tracker for how many open XHR there will be
        window.openXHR = fandomlist.length;
        if (DEBUG) console.log("Illegal Characters: There are "+window.openXHR+" fandoms assigned, to be checked");
        document.getElementById('checkillegal').firstChild.innerText = "Checking " + window.openXHR + " fandoms";

        fandomlist.forEach( (f, i) => {
            var url = 'https://archiveofourown.org/tags/search?tag_search%5Bname%5D=*%E2%80%99*+OR+*%E2%80%98*+OR+*%E2%80%9C*+OR+*%E2%80%9D*+OR+*%EF%BD%9C*+OR+*%E2%80%93*+OR+*%E2%80%94*+OR+*%E2%80%95*+OR+*%EF%BC%88*+OR+*%EF%BC%89*+OR+*%5C%27%5C%27*&tag_search%5Btype%5D=&tag_search%5Bcanonical%5D=T&tag_search%5Bsort_column%5D=name&tag_search%5Bsort_direction%5D=asc&commit=Search+Tags&tag_search%5Bfandoms%5D=';
            url += encodeURIComponent(f.innerText);

            if (DEBUG) console.log("Illegal Characters: Fandom "+f.innerText+" will be checked in "+3000*i+" second");
            if (DEBUG) url = 'https://archiveofourown.org/tags/search?tag_search%5Bname%5D=*POV*&tag_search%5Btype%5D=&tag_search%5Bcanonical%5D=T&tag_search%5Bsort_column%5D=name&tag_search%5Bsort_direction%5D=asc&commit=Search+Tags&tag_search%5Bfandoms%5D='+ encodeURIComponent(f.innerText);

            // collect the search results for specifically those fandoms
            setTimeout(function() {
                pageload(url, 'search');
            }, 3000*i);
        });
    }

    function retrieveSearchResults(me) {
        window.openXHR--;
        // avoids updating the button by a slower (working) response after a page load was already jailed
        if (!window.ao3jail) document.getElementById('checkillegal').firstChild.innerText = "Checking " + window.openXHR + " fandoms";

        const results = me.querySelectorAll('ol.tag.index li span');
        const fandom = me.querySelector('#tag_search_fandoms').value;

        if (DEBUG) console.log("Illegal Characters: Fandom "+fandom+" has "+results.length+" tags with illegal characters");
        if (DEBUG) console.log("Illegal Characters: There are "+window.openXHR+" fandoms remaining to be checked");

        // adds the found nodelist to the object
        var printtext = "";
        if (results.length > 0) {
            printtext = '<h4 class="heading">'+fandom+'</h4><ol class="tag index group">';
            found = found + results.length;
            for (let n of results.values()) { printtext += '<li>'+n.outerHTML+'</li>'; }
            printtext += '</ol>';

            const node_parent = document.querySelector('#main');
            node_parent.innerHTML += printtext; // appending at the bottom of the list
        }

        if (window.openXHR == 0) {
            if (DEBUG) console.log("Illegal Characters: Last fandom was checked, tallying up the result tags");
            // this was the last open XHR so we can print the total number found!
            printTotals();
        }
    }

    function printTotals() {
        const heading = document.createElement('h3');
        heading.className = "heading"
        heading.innerText = found+' Found';
        const node_parent = document.querySelector('#new_tag_search');
        node_parent.insertAdjacentElement('afterend', heading);
        if (DEBUG) console.log("Illegal Characters: Script completed.");
        document.getElementById('checkillegal').firstChild.innerText = "Check for illegal characters finished";
    }

    function saySorry(me) {
        // this does not count down the checked fandoms so button can never show as "finished" when there were errors

        // user output only if this is the fist page that failed
        if (window.ao3jail == false) {
            // check if we received a retry-after value in the response
            if (DEBUG) console.log("Illegal Characters: 429 retry-after " + me.getResponseHeader('Retry-After'));
            var timeout = parseInt(me.getResponseHeader('Retry-After') || 0);
            timeout = (timeout > 0) ? ' You can try again in '+ Math.ceil(timeout / 60) +' minutes.' : '';
            document.querySelector('#new_tag_search').outerHTML += "<h3 class='heading'>Sorry, the script stopped because it ran into the "+me.statusText+" error."+ timeout +"</h3>";
            document.getElementById('checkillegal').firstChild.innerText = "Check stopped: error";
        }
        window.ao3jail = true;
        // console output for every page that didn't load properly
        console.log("Illegal Characters: The background page load ran into an issue: "+me.status+" "+me.statusText);
    }

    function pageload(url, what) {
        if (DEBUG) console.log("Illegal Characters: Loading page "+url);
        if (window.ao3jail) {
            if (DEBUG) console.log("Illegal Characters: This page load was skipped due to previously encountered errors.");
            return false;
        }
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status==200 && xhr.response != "") {
                if (what == 'fandoms') retrieveFandomList(xhr.response);
                else retrieveSearchResults(xhr.response);
            }
            else saySorry(xhr);
        };
        xhr.onerror = () => { saySorry(xhr); };
        xhr.open("GET", url);
        xhr.responseType = "document";
        xhr.send();
    }

})();