// ==UserScript==
// @name         Thingiverse - Multifix
// @namespace    https://greasyfork.org/users/77886
// @version      0.3
// @description  Fixes multiple Thingiverse site bugs, and makes the site a bit easier to use. See source for details
//                  Features and Fixes:
//                    Fix: Removes collections with a NULL description from Thingiverse API requests, which can cause the infamous "Something went wrong" response
//                    Fix: Returns up to 9,999 collections so that you can assign a thing to any of your collections (instead of the 20 most recent)
//                    Feature: Sort collections by name (instead of by Popularity or Newest)
//                    Feature: Return 100 search results (instead of 20)
// @author       muchtall
// @license      MIT
// @match        https://www.thingiverse.com/*
// @require      https://cdn.jsdelivr.net/npm/xhook@1.4.9/dist/xhook.min.js
// @grant        none
// /grant        GM_getValue        // If I enable this, then something breaks XHook when grant is no longer in the "none" state. So leaving this out for now.
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/442326/Thingiverse%20-%20Multifix.user.js
// @updateURL https://update.greasyfork.org/scripts/442326/Thingiverse%20-%20Multifix.meta.js
// ==/UserScript==

var fix_borked_collections = true;
var fix_missing_collections = true;
var more_search_results = true;
var sort_collections = true;

// -- Disabled because I can't get GM_getValue to work without breaking XHook.
// Get user's perferences on what features are enabled. All features are enabled by default.
// To disable any of these features, set a Value in ViolentMonkey like so:
//    Key:   more_search_results
//    Value: false
//let fix_borked_collections = GM_getValue('fix_borked_collections', true);
//let fix_missing_collections = GM_getValue('fix_missing_collections', true);
//let more_search_results = GM_getValue('more_search_results', true);
//let sort_collections = GM_getValue('sort_collections', true);

var userscriptname = 'Thingiverse - Multifix';
console.log(userscriptname + ' - Started');

if ( fix_missing_collections ) {
  console.log(userscriptname + ' - Enabled feature: Fix Missing Collections');
} else {
  console.log(userscriptname + ' - DISABLED feature: Fix Missing Collections');
}

if ( more_search_results ) {
  console.log(userscriptname + ' - Enabled feature: More Search Results');
} else {
  console.log(userscriptname + ' - DISABLED feature: More Search Results');
}

if ( fix_borked_collections ) {
  console.log(userscriptname + ' - Enabled feature: Fix Borked Collections');
} else {
  console.log(userscriptname + ' - DISABLED feature: Fix Borked Collections');
}

if ( sort_collections ) {
  console.log(userscriptname + ' - Enabled feature: Sort Collections');
} else {
  console.log(userscriptname + ' - DISABLED feature: Sort Collections');
}

xhook.before(function(request) {
  if ( more_search_results ) {
    if(request.url.match(/https:\/\/api.thingiverse.com\/search\/\?.*/)) {
      console.log(userscriptname + ' - More Search Results - Old URL:' + request.url);
      request.url = request.url.replace(/per_page=[0-9]+/,"per_page=100");
      console.log(userscriptname + ' - More Search Results - New URL:' + request.url);
    }
  }
  
  if ( fix_missing_collections ) {
    if(request.url.match(/https:\/\/api.thingiverse.com\/users\/[^\/]+\/search\/\?.*type=collections.*/)) {
      console.log(userscriptname + ' - Fix Missing Collections - Old URL:' + request.url);
      request.url = request.url.replace(/per_page=[0-9]+/,"per_page=9999");
      console.log(userscriptname + ' - Fix Missing Collections - New URL:' + request.url);
    }
  }
});

xhook.after(function(request, response) {
  if(request.url.match(/users\/[^\/]+\/search\/\?.*type=collections.*/)) {
    if ( fix_borked_collections ) {
      // --- Fix Borked Collections ---
      console.log(userscriptname + ' - Fix Borked Collections - Found URL: ' + request.url);
      var json = JSON.parse(response.text);
      var i=json.hits.length;
      while (i--) {
        if(json.hits[i].name === null){
          console.log(userscriptname + ' - Fix Borked Collections - Removed borked collection: ' + json.hits[i].id);
          json.hits.splice(i,1);
        } else {
          //console.log("Keeping good collection: " + json.hits[i].id);
        }
      }
    }
 
    if ( sort_collections ) {
      // --- Sort collections by Name ---
      json.hits.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      console.log(userscriptname + ' - Sorted Collections - Collections sorted by name');
    }
     
    // Send response to browser
    response.text = JSON.stringify(json);
  }
});