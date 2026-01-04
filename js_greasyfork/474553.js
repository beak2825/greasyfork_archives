// ==UserScript==
// @name        Remove AO3 Bookmarks
// @namespace   none
// @license     MIT
// @match       https://archiveofourown.org/*
// @grant       none
// @version     1.1
// @author      @zhbluvs
// @description Remove all your bookmarked fics when browsing ao3
// @downloadURL https://update.greasyfork.org/scripts/474553/Remove%20AO3%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/474553/Remove%20AO3%20Bookmarks.meta.js
// ==/UserScript==

async function getBookmarksOnePage(num){
    var work_ids = [];
    var res2 = await fetch('https://archiveofourown.org/users/INSERT_USERNAME_HERE/bookmarks?page='+num)
    var stringweb = res2.text().then(r => new DOMParser().parseFromString(r, "text/html"))
    .then(r => {
        var outer = r.body.getElementsByClassName("bookmark blurb group");
        //console.log(outer);
        //console.log(outer.length);
        for(let i = 0; i < outer.length; i++){
            var inner = outer[i].getElementsByClassName("heading")[0].innerHTML;
            var search = inner.search(/\d/)
            var temp = inner.substring(search);
            var work_id = temp.substring(0, temp.indexOf('"'));
            work_ids.push(work_id);
        }
        let works = Array.from(document.getElementsByClassName("blurb"))
        works.forEach(work => {
            let curr_id = work.id.substring(work.id.indexOf("_") + 1);
            if (work_ids.includes(curr_id)) {
                work.style.display = 'none'
            }
        })
    })
}

async function getBookmarks(){
    'use strict';
    var res = await fetch('https://archiveofourown.org/users/centerz/bookmarks')
    var getpages = res.text().then(r => new DOMParser().parseFromString(r, "text/html"))
        .then(async r => { let str = r.body.getElementsByTagName("h2")[0].innerHTML;
                     let idx = str.indexOf("of");
                     let idx2 = str.indexOf("Bookmarks");
                     let num_works = Number(str.substring(idx + 3, idx2));
                     var pages = Math.floor(num_works / 20) + 1;
                     for(let i = 1; i <= pages; i++) {
                        getBookmarksOnePage(i);
                        await new Promise(r => setTimeout(r, 5000));
                     }
                   }
           );
}


function hideWorks()
{
  'use strict';

  getBookmarks();

}

hideWorks()