// ==UserScript==
// @name        Remove Bookmarks
// @namespace   none
// @license     MIT
// @match       https://archiveofourown.org/*
// @grant       none
// @version     1.0
// @author      @zhbluvs
// @description Remove all your bookmarked fics when browsing ao3
// @downloadURL https://update.greasyfork.org/scripts/474552/Remove%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/474552/Remove%20Bookmarks.meta.js
// ==/UserScript==

async function getBookmarks(){
    'use strict';
    var work_ids = [];
    var res = await fetch('https://archiveofourown.org/users/INSERT_USERNAME_HERE/bookmarks')
    var stringweb = res.text().then(r => new DOMParser().parseFromString(r, "text/html"))
    .then(r => {
                 var outer = r.body.getElementsByClassName("bookmark blurb group");
                 for(let i = 0; i < 20; i++){
                  var inner = outer[i].getElementsByClassName("heading")[0].innerHTML;
                  var search = inner.search(/\d/)
                  var temp = inner.substring(search);
                  var work_id = temp.substring(0, temp.indexOf('"'));
                  //console.log(work_id);
                  work_ids.push(work_id);
                 }
                 let works = Array.from(document.getElementsByClassName("blurb"))
                 works.forEach(work => {
                     let curr_id = work.id.substring(work.id.indexOf("_") + 1);
                     console.log(work_ids.includes(curr_id));
                     if (work_ids.includes(curr_id)) {
                         work.style.display = 'none'
                     }
                 })
          })
}


function hideWorks()
{
  'use strict';

  getBookmarks();

}

hideWorks()