// ==UserScript==
// @name        RED - filter artist page
// @namespace   userscript1
// @match       https://redacted.sh/artist.php*
// @grant       none
// @version     0.3.5
// @description live filtering of the artist page
// @downloadURL https://update.greasyfork.org/scripts/426776/RED%20-%20filter%20artist%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/426776/RED%20-%20filter%20artist%20page.meta.js
// ==/UserScript==

// keyboard control enabled:
// f to focus search field from anywhere on page
// type to search
// enter to defocus
// esc to clear field; esc again defocuses

(function() {    // ------------

var newCode = `
  <div id="filter_box" class="box">
    <input type="search" id="filterInput" placeholder="search for.." />
    Results: <span id="filterCount"></span>
  </div>
  `;
var elm = document.querySelector('div#discog_table > .box');
if (elm === null) { return; }
elm.insertAdjacentHTML('afterend', newCode);

// get data ------
const data = [];
for (let tr of document.querySelectorAll('table.torrent_table > tbody > tr.group') ) {
  var groupID = tr.querySelector('div[id^="showimg_"]').id.split('_')[1];
  var editions = document.querySelectorAll('table.torrent_table > tbody > tr.groupid_' + groupID);
  
  var txt = tr.querySelector('strong').textContent.toUpperCase() +
        " " + tr.querySelector('div.tags').textContent.toUpperCase();
  var txtNormalized = removeAccents(txt);
  if (txt != txtNormalized) {
    txt = txt + " " + txtNormalized;
  }
  
  data.push({release:tr,
              editions:editions,
              txt:txt
             });
}
updateCount(data.length);

// listeners ------
const input = document.getElementById('filterInput');
input.addEventListener('keyup', function (e) {
  var key = e.key.toLowerCase();
  if (key === 'escape') {
    if (this.value === '') {
      this.blur();
      return;
    } else {
      this.value = '';
    }
  }
  
  if (key === 'enter') {
    this.blur();
    return;
  }
  
  filterFunction();
});

document.body.addEventListener('keyup', function (e) {
  if (e.key.toLowerCase() === 'f') {
    var tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') {
      return;
    } else {
      input.focus();
      input.select();
    }
  }
});  


// functions  ------
function filterFunction() {
  var count = 0;
	var filter = input.value.toUpperCase();
  var display;
  
  for (let d of data) {
    if (d.txt.includes(filter) ) {
      display = '';
      count++;
    } else {
      display = 'none';
    }
    d.release.style.display = display;
    for (let tr of d.editions) {
      tr.style.display = display;
    }
  }
  updateCount(count);
}

function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}
  
function updateCount(i) {
  document.getElementById('filterCount').innerHTML = i;
}

})();  // ----