// ==UserScript==
// @name         Torn Rackets
// @namespace    namespace
// @version      0.5.1
// @description  description
// @author       tos
// @match        *.torn.com/city.php*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/389750/Torn%20Rackets.user.js
// @updateURL https://update.greasyfork.org/scripts/389750/Torn%20Rackets.meta.js
// ==/UserScript==

GM_addStyle(`
#x_map_info {
  float: left;
  font-family: monospace;
  margin-left: 20px;
}
#x_map_info .x_copy {
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 0.5em;
  text-decoration: underline;
}
#x_map_info thead {
  color: #000;
  font-weight: bold;
}
#x_map_info tbody: {
  color: #000;
}
#x_map_info td {
  padding: 0.5em;
  text-align: left;
}
#x_map_info td[data-tID] {
  cursor: pointer;
}
#x_map_info th {
  cursor: pointer;
  padding: 0.5em;
  text-align: left;
}

`)

//----------------------------------------------------------------------------------------------------------------------------------------
var TableSorter = {
    makeSortable: function(table){
        var _this = this; // Store context of this in the object
        var th = table.tHead, i;
        th && (th = th.rows[0]) && (th = th.cells);
        if (th){
            i = th.length;
        }else{
            return; // if no `<thead>` then do nothing
        }
        // Loop through every <th> inside the header
        while (--i >= 0) (function (i) {
            var dir = 1;
            // Append click listener to sort
            th[i].addEventListener('click', function () {
                _this._sort(table, i, (dir = 1 - dir));
            });
        }(i));
    },
    _sort: function (table, col, reverse) {
        var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
        i;
        reverse = -((+reverse) || -1)
        //console.log(reverse)
        // Sort rows
        if (col === 0 || col === 1 || col === 3 || col === 5) { //sort integer columns
          tr = tr.sort(function (a, b) {
            if (reverse === 1) return parseInt(b.cells[col].textContent.trim()) - parseInt(a.cells[col].textContent.trim())
            else return parseInt(a.cells[col].textContent.trim()) - parseInt(b.cells[col].textContent.trim())
          })
        }
        else {
          tr = tr.sort(function (a, b) { //sort text columns
            return reverse * (a.cells[col].textContent.trim().localeCompare(b.cells[col].textContent.trim()))
          })
        }
        for(i = 0; i < tr.length; ++i){
            tb.appendChild(tr[i])
        }
    }
};
//----------------------------------------------------------------------------------------------------------------------------------------

const territories_p = new Promise((resolve, reject) => {
  let territory_obj = {}
  window.unsafeWindow.territories_shapes.forEach((territory) => {
    territory_obj[territory[4]] = territory[9]
  })
  resolve(territory_obj)
})

const racket_info_HTML = `
<div id="x_map_info">
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Type</th>
        <th>Type Name</th>
        <th>Level</th>
        <th>Description</th>
        <th>Territory ID</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>
`

const mapdata_p = new Promise((resolve, reject) => {
  $( document ).ajaxComplete(function(event, jqXHR, ajaxObj) {
    if (ajaxObj.url && ajaxObj.url.includes('step=mapData')) {
      resolve(JSON.parse(jqXHR.responseText))
    }
  })
})

Promise.all([territories_p, mapdata_p]).then(([territories, mapdata]) => {
  //console.log(territories, mapdata)
  document.querySelector('#mainContainer .content-wrapper').insertAdjacentHTML('afterend', racket_info_HTML)
  document.querySelector('#x_map_info').insertAdjacentHTML('afterbegin', `<div class="x_copy">Copy Rackets to Clipboard(${mapdata.rackets.length})</div>`)
  const table_body = document.querySelector('#x_map_info tbody')
  row_num = 0
  mapdata.rackets.forEach((r) => {
    row_num += 1
    table_body.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${row_num}</td>
        <td>${r.type}</td>
        <td>${r.typeName}</td>
        <td>${r.level}</td>
        <td>${r.description}</td>
        <td><a href="https://www.torn.com/city.php#terrName=${territories[r.territoryID]}">${territories[r.territoryID]}</a></td>
      </tr>
    `)
  })
  TableSorter.makeSortable(document.querySelector('#x_map_info table'))
  document.querySelector('#x_map_info .x_copy').addEventListener('click', (e) => {
    let csv = 'type\ttypeName\tlevel\tname\tdescription\tterritoryID\n'
    mapdata.rackets.forEach(r => csv += r.type+'\t'+r.typeName+'\t'+r.level+'\t'+r.name+'\t'+r.description+'\t'+r.territoryID+'\n')
    GM_setClipboard(csv)
  })
})
