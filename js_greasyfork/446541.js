// ==UserScript==
// @name        RED: votes filtering
// @namespace   userscript1
// @match       https://redacted.sh/artist.php
// @match       https://redacted.sh/collage.php
// @match       https://redacted.sh/collages.php
// @grant       none
// @version     0.1.7
// @description show or exclude your up/down voted groups
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/446541/RED%3A%20votes%20filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/446541/RED%3A%20votes%20filtering.meta.js
// ==/UserScript==

(function() {    // ------------
"use strict";

var data = [];
var newCode = `
  <div id="votefiltering">
    Show:
    <a id="votedfilterup"    data-vote="∧" data-way="true" href="#">[upvote]</a>
    <a id="votedfilterdown"  data-vote="∨" data-way="true" href="#">[downvote]</a>
    <a id="votedfilterall"   data-vote="*" data-way="true" href="#">[both]</a>
    Hide:
    <a id="votedfilterupx"   data-vote="∧" data-way="false" href="#">[upvote]</a>
    <a id="votedfilterdownx" data-vote="∨" data-way="false" href="#">[downvote]</a>
    <a id="votedfilterallx"  data-vote="*" data-way="false" href="#">[both]</a>
    |
    <a id="votedfilterclear" data-vote=" " data-way="true" href="#">[Reset]</a>
  </div>
  `;

// target on artist page || collage page
var elm = (document.querySelector('#discog_table table[id^="torrents_"]') ||
           document.getElementById('discog_table')
          );
if (elm === null) { return; }
elm.insertAdjacentHTML('beforeBegin', newCode);

// listeners ------
var ids = ['up', 'down', 'all', 'upx', 'downx', 'allx', 'clear'];
ids.forEach(i =>
  document.getElementById('votedfilter' + i).addEventListener('click', showVoted, false)
);

// functions  ------
function getData() {
  data = [];
  for (let tr of document.querySelectorAll('table.torrent_table > tbody > tr.group') ) {
    var groupID = tr.querySelector('div[id^="showimg_"]').id.split('_')[1];
    var editions = document.querySelectorAll('table.torrent_table > tbody > tr.groupid_' + groupID);

    var vote = " ";
    // gazelle HTML for votes is fun!
    var elm = tr.querySelector('[class*="voted_type"]:not(.hidden) ');
    if (elm) {
      // keep the " " for the All filter
      vote = vote + elm.textContent.toUpperCase();
    }

    data.push({release:tr,
                editions:editions,
                vote:vote
            });
  }
}

function showVoted(evt) {
  evt.preventDefault();
  var elm = evt.currentTarget;

  var str = elm.dataset.vote;
  var whichway = (elm.dataset.way === 'true');
  var display;

  if (elm.dataset.active != "true") {
    resetLinks();
    elm.style.fontWeight = "bold";
    elm.dataset.active = "true";
  } else {
    resetLinks();
    str = " "; whichway = true; // act as [reset]
  }
  // don't bold [Reset]
  document.querySelector('#votedfilterclear').style.fontWeight = "normal";


  // always refresh data as we may have cast new votes
  getData();

  for (let d of data) {
    if (str == "*") {
      // all votes, up or down
      if (d.vote.includes('∨') || d.vote.includes('∧') ) {
        display = whichway ? '' : 'none';
      } else {
        display = whichway ? 'none' : '';
      }
    } else {
      if (d.vote.includes(str) ) {
        display = whichway ? '' : 'none';
      } else {
        display = whichway ? 'none' : '';
      }
    }

    d.release.style.display = display;
    for (let tr of d.editions) {
      tr.style.display = display;
    }
  }
}

function resetLinks() {
  document.querySelectorAll('#votefiltering a').forEach(a => {
      a.style.fontWeight = "";
      a.dataset.active = "false"
  });
}

})();  // ----