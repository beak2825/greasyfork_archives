// ==UserScript==
// @name     PTP - filter ratings list
// @namespace   differentia
// @version  0.3
// @include https://passthepopcorn.me/user.php?action=ratings&id=*
// @grant    none
// @description type to filter the ratings list
// @downloadURL https://update.greasyfork.org/scripts/416205/PTP%20-%20filter%20ratings%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/416205/PTP%20-%20filter%20ratings%20list.meta.js
// ==/UserScript==

elm = document.getElementById('ratings_table_wrapper');
newCode = '<input type="text" id="filterInput" placeholder="filter on..." /> Results: <span id="filterCount"></span>';
elm.insertAdjacentHTML('beforebegin', newCode);

tr = document.getElementById('ratings_table').getElementsByTagName("tr");
tdList = [];
for (i = 0; i < tr.length; i++) {
  if (tr[i].parentNode.nodeName == 'THEAD') {
    continue;
  }
  td = tr[i].getElementsByTagName('td')[0];
  if (td) {
    tdList.push(td);
  }
}

input = document.getElementById('filterInput');
input.addEventListener('keyup', filterFunction);

function filterFunction() {
  var filter, td, i, count;
  count = 0;
	filter = input.value.toUpperCase();
	for (i = 0; i < tdList.length; i++) {
		td = tdList[i];
    txtValue = td.textContent || td.innerText;
    txtValueNormalized = removeAccents(txtValue);
    if (txtValue.toUpperCase().indexOf(filter) > -1
       || txtValueNormalized.toUpperCase().indexOf(filter) > -1) {
      td.parentNode.style.display = "";
      count++;
    } else {
      td.parentNode.style.display = "none";
    }
  }
  document.getElementById('filterCount').innerText = count;
}

function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}