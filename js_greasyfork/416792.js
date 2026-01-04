// ==UserScript==
// @name        RED - collages by year
// @namespace   userscript1
// @match       https://redacted.sh/collages.php*
// @match       https://redacted.sh/collage.php*
// @grant       none
// @version     0.6.5
// @description click to load entire collage sorted by year/seeders + live search
// @downloadURL https://update.greasyfork.org/scripts/416792/RED%20-%20collages%20by%20year.user.js
// @updateURL https://update.greasyfork.org/scripts/416792/RED%20-%20collages%20by%20year.meta.js
// ==/UserScript==

(function() {    // ------------

// Artist collages have no year
if (document.querySelector('.box_category a').
    href.endsWith('collages.php?action=search&cats[7]=1') ) {
  return;
}

const params = new URLSearchParams(location.search);
const id = params.get('id');
const urlTorrent = '/torrents.php?id=';
const urlArtist = '/artist.php?id=';
const types = [];
types[1] = {
  1: 'Album',
  3: 'Soundtrack',
	5: 'EP',
	6: 'Anthology',
	7: 'Compilation',
	9: 'Single',
	11: 'Live album',
	13: 'Remix',
	14: 'Bootleg',
	15: 'Interview',
	16: 'Mixtape',
	17: 'Demo',
	18: 'Concert Recording',
	19: 'DJ Mix',
	21: 'Unknown'
	};
types[2] = {0: 'Application'};
types[3] = {0: 'E-Book'};
types[4] = {0: 'Audiobook'};
types[5] = {0: 'E-Learning'};
types[6] = {0: 'Comedy'};
types[7] = {0: 'Comic'};

var input;
var trList;
var mode;

var newCode = `<div id="byyear-box" class="box">
   <div id="byyear" class="head">
      <strong id="byyear-yearclick">By year</strong>
     |
     <strong id="byyear-seedclick">By seeders</strong>
     |
     [<a style="cursor: pointer;" onclick="document.getElementById('byyear-box').scrollIntoView(false);">end</a>]
    </div>
  <div id="byyear-filter"></div>
  <div id="byyear-target"></div>
  </div>
  `;

var elm = document.querySelector('div[data-component="TorrentCollageView"], #coverart');
if (elm === null) { return; }  // don't try to run on collage edit pages, etc.
elm.insertAdjacentHTML('afterbegin', newCode);

// listeners
const header = document.getElementById('byyear-yearclick');
header.style.cursor = 'pointer';
header.addEventListener('click', function handler(){
  gogo('year');
  this.removeEventListener('click', handler);
  this.style.cursor = '';
  });

const seedclick = document.getElementById('byyear-seedclick');
seedclick.style.cursor = 'pointer';
seedclick.addEventListener('click', function handler(){
  gogo('seed')
  this.removeEventListener('click', handler);
  this.style.cursor = '';
  });

// CSS
document.head.insertAdjacentHTML("beforeend", `<style>
  .byyear-marker {border-top: solid 2px;}
  .byyear-line2 {font-size: 0.8em; opacity: 50%;}
  .byyear-taglist {padding: 0px !important; visibility: unset !important;}
  #byyear-target td:first-child {width: 1%; opacity: 50%;}
  .byyear-seeders {width: 1%; opacity: 50%;}
  </style>
  `);

// functions
function gogo(m) {
  mode = m;
  let url = '';
  if (mode == 'seed') {
    url = '/ajax.php?action=collage&id=';
  } else {
    url = '/ajax.php?action=collage&showonlygroups&id=';
  }

  if (id) {
    document.body.style.cursor = 'progress';
    var req = new XMLHttpRequest();
    req.addEventListener('load', processData);
    req.open('GET', url + id);
    req.send();
  }
}

function processData() {
  var table = document.createElement('table');
  var groups = JSON.parse(this.responseText).response.torrentgroups;

  // sum seeders
  for (let g of groups) {
    let seeds = 0;
    for (let t of g.torrents) {
      seeds += t.seeders;
    }
    g.seeders = seeds;
  }

  // sort
  if (mode == 'year') {
    groups.sort(sort_by('year', false, parseInt));
  } else if (mode == 'seed') {
    groups.sort(sort_by('seeders', false, parseInt));
  }

  // build table
  for (let j of groups) {
    if (j.musicInfo && j.musicInfo.dj.length) {
        j.musicInfo.artists = j.musicInfo.dj;
    }
    var artists = (j.musicInfo) ? processArtists(j.musicInfo.artists) : '';
    var tags = (j.tagList) ? processTags(j.tagList) : '';
    try {
      var type = types[Number(j.categoryId)][Number(j.releaseType)];
    } catch {
      type = 'type?';
    }

    var row = document.createElement('tr');
    row.innerHTML = `<td> ${j.year} </td>
      <td> ${artists} </td>
      <td>
        <strong> <a target="_blank" href="${urlTorrent}${j.id}">${j.name}</a> </strong>
        <div class="byyear-line2">[${type}] <span class="tags byyear-taglist">${tags}</span></div>
      </td>
      `;
    if (mode == 'seed') {
      row.innerHTML += `<td class='byyear-seeders'> ${j.seeders} </td>`;
    }

    table.appendChild(row);
  }
  groups = null;

  let elm = document.getElementById('byyear-target');
  elm.textContent = '';  // clear table from previous run
  elm.appendChild(table);
  trList = elm.getElementsByTagName('tr');

  document.getElementById('byyear-filter').
    innerHTML = `<input type="search" id="filterInput" placeholder="search for.." />
      Results: <span id="filterCount"></span>
      `;

  input = document.getElementById('filterInput');
  input.addEventListener('keyup', filterFunction);

  if (mode == 'year') { markYears(); }
  document.body.style.cursor = '';
}

function processTags(str) {
  str = str.replace(/ /g, ', ');
  return str.replace(/_/g, '.');
}

function processArtists(artists) {
  if (artists.length > 3) { return 'Various Artists'; }
  return artists.map(a => `<a target="_blank" href="${urlArtist}${a.id}">${a.name}</a>`)
        .join(', ');
}


function filterFunction() {
  var count = 0;
	var filter = input.value.toUpperCase();

	for (let tr of trList) {
    // only look at first three columns, not seeder values
    let txtValue = "";
    let tds = tr.getElementsByTagName('td');
    for (let i=0; i<3; i++) {
      txtValue += " " + (tds[i].textContent || tds[i].innerText);
    }

    var txtValueNormalized = removeAccents(txtValue);
    if (txtValue.toUpperCase().includes(filter)
       || txtValueNormalized.toUpperCase().includes(filter) ) {
      tr.style.display = '';
      count++;
    } else {
      tr.style.display = 'none';
    }
  }

  if (mode == 'year') { markYears(); }
  document.getElementById('filterCount').innerText = count;
}


function markYears() {
  var yearCheck;

  for (let tr of trList) {
    if (tr.style.display == 'none')  { continue; }

    var year = tr.firstChild.textContent;
    if (year != yearCheck) {
      tr.classList.add('byyear-marker');
    } else {
      tr.classList.remove('byyear-marker');
    }

    yearCheck = year;
  }
}


function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

const sort_by = (field, reverse, primer) => {

  const key = primer ?
    function(x) {
      return primer(x[field])
    } :
    function(x) {
      return x[field]
    };

  reverse = !reverse ? 1 : -1;

  return function(a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}

})();  // ----------------