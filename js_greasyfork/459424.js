// ==UserScript==
// @name         HDB Moderation Shortcuts and Buttons
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Shortcut to set Moderated and open Edit Torrent with "~" and "!" key press respectively and adds DL | ED | RP buttons
// @author       Faiyaz93, Chameleon
// @match        https://hdbits.org/browse.php*
// @match        https://hdbits.org/details.php?id=*
// @icon         https://www.google.com/s2/favicons?domain=hdbits.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459424/HDB%20Moderation%20Shortcuts%20and%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/459424/HDB%20Moderation%20Shortcuts%20and%20Buttons.meta.js
// ==/UserScript==

(function() {

  var url = location.href;
  if (url.match(/id=\d+/)) {
    var dl_url = document.querySelector('a.js-download').href;
    var id = url.match(/id=(\d+)/)[1];
    var span=document.createElement('span');
    span.setAttribute('class', 'basic-movie-list__torrent__action');
    span.innerHTML=`<span class="basic-movie-list__torrent__action"> [
    		    <a href="${dl_url}" title="Download">DL</a>
    		    | <a href="https://hdbits.org/edit.php?id=${id}" title="Edit" target="_blank">ED</a>
    		    | <a href="https://hdbits.org/report/create?torrentid=${id}" title="Report" target="_blank">RP</a>
    		    ]</span>
                `;
    document.querySelector('a.js-wishlistadd:last-of-type').after(span);
  } else {
    Array.from(document.querySelector('#torrent-list').querySelectorAll('tr')).forEach((e, index)=> {
      /*$('torrent-list').find('tr:gt(0)').each((index,e)=>{*/
      if(index==0) return;
      console.log('test 1');
      //var id = $(e).find('td:eq(2)').find('a').attr('href').match(/id=(\d+)/)[1];
      var id=e.querySelector('a[href*="id="]').href.match(/id=(\d+)/)[1];
      //var dl_url = $(e).find('td:eq(2)').find('a:eq(1)').attr('href');
      var dl_url = e.querySelector('a.js-download').href;
      console.log(dl_url);
      var container = e.querySelector('a.js-wishlistadd');
      if (!container){
        container = e.querySelector('a.js-bookmarkadd');
      }
      var span=document.createElement('span');
      span.innerHTML=`<span class="basic-movie-list__torrent__action"> [
    		    <a href="${dl_url}" title="Download">DL</a>
    		    | <a href="https://hdbits.org/edit.php?id=${id}" title="Edit" target="_blank">ED</a>
    		    | <a href="https://hdbits.org/report/create?torrentid=${id}" title="Report" target="_blank">RP</a>
    		    ]</span>
                `;
            container.after(span);
          })
        }
})();

document.body.addEventListener('keydown', function(e) {
  if (e.key == "~") {
    document.querySelector("#setmoderated").click();
  }
});

document.body.addEventListener('keypress', function(e) {
  if (e.which == 33) {
    var url = window.location.href;
    var id = url.split("=")[1];
    window.open("https://hdbits.org/edit.php?id=" + id);
  }
});