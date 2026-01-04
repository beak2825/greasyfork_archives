// ==UserScript==
// @name              File Regexplorer
// @version           0.2.1
// @namespace         file_regexplorer
// @description       Implements local explorer - file manager and provide a means to sort the file list in custom order via regular expressions
// @description:en    Implements local explorer - file manager and provide a means to sort the file list in custom order via regular expressions
// @description:it    Implementa il file manager locale del browser e fornisce un sistema per ordinare l'elenco dei file in modo personalizzato tramite espressioni regolari
// @author            OpenDec
// @match             file:///*/
// @icon              data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjwhLS1HZW5lcmF0b3I6IFhhcmEgRGVzaWduZXIgKHd3dy54YXJhLmNvbSksIFNWRyBmaWx0ZXIgdmVyc2lvbjogNi4wLjAuNC0tPg0KPHN2ZyBzdHJva2Utd2lkdGg9IjAuNTAxIiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgb3ZlcmZsb3c9InZpc2libGUiIHdpZHRoPSIyODQuNzE4cHQiIGhlaWdodD0iMjQyLjk5N3B0IiB2aWV3Qm94PSIwIDAgMjg0LjcxOCAyNDIuOTk3Ij4NCiA8ZGVmcz4NCgk8L2RlZnM+DQogPGcgaWQ9IkRvY3VtZW50IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBmb250LWZhbWlseT0iVGltZXMgTmV3IFJvbWFuIiBmb250LXNpemU9IjE2IiB0cmFuc2Zvcm09InNjYWxlKDEgLTEpIj4NCiAgPGcgaWQ9IlNwcmVhZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMjQyLjk5NykiPg0KICAgPGcgaWQ9IkxheWVyIDMiPg0KICAgIDxwYXRoIGQ9Ik0gMCwyMTUuMDczIEMgMCwyMzAuNDg3IDEyLjUxLDI0Mi45OTcgMjcuOTIzLDI0Mi45OTcgTCA2MC41NzgsMjQyLjk5NyBDIDc1Ljk5MSwyNDIuOTk3IDg4LjUwMSwyMzAuNDg3IDg4LjUwMSwyMTUuMDczIEwgODguNTAxLDIxMC43NDkgTCAyMjQuNzM4LDIxMC43NSBDIDI0MS4wMjgsMjEwLjc1IDI1My4wMzUsMTk3LjU4NCAyNTEuNTM4LDE4MS4zNjMgTCAyMzcuNTEsMjkuMzg4IEwgMC4wMDEsMjkuMTUxIiBmaWxsPSIjY2Y5YzBlIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSI3OS44NDAzMTkzNjEyNzc1Ii8+DQogICAgPHBhdGggZD0iTSA1Mi41LDE3NS4zMjQgTCA1Mi41LDczLjY3NSBMIDIzNi4yNTEsNzMuNjc1IEwgMjM2LjI1MSwxNzUuMzI0IEMgMjM2LjI1MSwxODMuMjg3IDIyOS43ODgsMTg5Ljc1IDIyMS44MjUsMTg5Ljc1IEwgNjYuOTI2LDE4OS43NSBDIDU4Ljk2MywxODkuNzUgNTIuNSwxODMuMjg3IDUyLjUsMTc1LjMyNCBaIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIG1hcmtlci1zdGFydD0ibm9uZSIgbWFya2VyLWVuZD0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9Ijc5Ljg0MDMxOTM2MTI3NzUiLz4NCiAgICA8cGF0aCBkPSJNIDIzLjQ3NSwxMjguNzQ0IEwgMS4wOSwzNy41MTEgQyAtMy45ODksMTYuODA1IDkuMTkxLDAgMzAuNTExLDAgTCAyMTMuNDE3LDAgQyAyMzQuNzM3LDAgMjU2LjE2NCwxNi44MDUgMjYxLjI0NCwzNy41MTEgTCAyODMuNjI5LDEyOC43NDQgQyAyODguNzA5LDE0OS40NDkgMjc1LjUyOSwxNjYuMjU0IDI1NC4yMDgsMTY2LjI1NCBMIDcxLjMwMywxNjYuMjU0IEMgNDkuOTgyLDE2Ni4yNTQgMjguNTU1LDE0OS40NDkgMjMuNDc1LDEyOC43NDQgWiIgZmlsbD0iI2ZlZDU1NyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBtYXJrZXItc3RhcnQ9Im5vbmUiIG1hcmtlci1lbmQ9Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSI3OS44NDAzMTkzNjEyNzc1Ii8+DQogICAgPHBhdGggZD0iTSAxNzIuNzI1LDg5LjI4NCBMIDE3Mi43MjQsMTY5Ljc5NyBDIDE3Mi43MjQsMTcyLjczNCAxNzUuMTA3LDE3NS4xMTYgMTc4LjA0MywxNzUuMTE2IEwgMjE3LjMzLDE3NS4xMTYgQyAyMjAuMjY1LDE3NS4xMTYgMjIyLjY0OCwxNzIuNzM0IDIyMi42NDgsMTY5Ljc5NyBMIDIyMi42NDUsODkuMjg0IEMgMjIyLjY0NSw4NC4xMjUgMjE4Ljg2NSw4MS43MzkgMjE0LjIwNyw4My45NTYgTCAxOTkuMzc4LDkxLjAyMSBDIDE5Ny42ODUsOTEuODA2IDE5Ny42ODUsOTEuODA2IDE5NS45OTIsOTEuMDIxIEwgMTgxLjE2NSw4My45NTYgQyAxNzYuNTA2LDgxLjczOSAxNzIuNzI1LDg0LjEyNSAxNzIuNzI1LDg5LjI4NCBaIiBmaWxsPSIjZDAwMDAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIG1hcmtlci1zdGFydD0ibm9uZSIgbWFya2VyLWVuZD0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9Ijc5Ljg0MDMxOTM2MTI3NzUiLz4NCiAgICA8cGF0aCBkPSJNIDYyLjQ5NywxMTIuNjk1IEMgNTAuMzc1LDEwMi42MDUgNDEuODQyLDg3LjkxMSA0MS44NDIsNzIuNzYgQyA0MS44NDIsNTcuNjA5IDUwLjM3Niw0Mi45MTUgNjIuNDk4LDMyLjgyNSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjE1IiBzdHJva2U9IiM2MzRkMjkiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSI3OS44NDAzMTkzNjEyNzc1Ii8+DQogICAgPHBhdGggZD0iTSAxMzcuODQ0LDExMi42OTUgQyAxNDkuOTY2LDEwMi42MDUgMTU4LjQ5OSw4Ny45MTEgMTU4LjQ5OSw3Mi43NiBDIDE1OC40OTksNTcuNjA5IDE0OS45NjUsNDIuOTE1IDEzNy44NDMsMzIuODI1IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMTUiIHN0cm9rZT0iIzYzNGQyOSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9Ijc5Ljg0MDMxOTM2MTI3NzUiLz4NCiAgICA8cGF0aCBkPSJNIDc5Ljk3Myw3MS4xNTggQyA4Ni40NTUsNzEuMTU4IDkxLjcxNyw2NS44OTYgOTEuNzE3LDU5LjQxNCBDIDkxLjcxNyw1Mi45MzIgODYuNDU1LDQ3LjY3IDc5Ljk3Myw0Ny42NyBDIDczLjQ5MSw0Ny42NyA2OC4yMjksNTIuOTMyIDY4LjIyOSw1OS40MTQgQyA2OC4yMjksNjUuODk2IDczLjQ5MSw3MS4xNTggNzkuOTczLDcxLjE1OCBaIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0iIzYzNGQyOSIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBtYXJrZXItc3RhcnQ9Im5vbmUiIG1hcmtlci1lbmQ9Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSI3OS44NDAzMTkzNjEyNzc1Ii8+DQogICAgPHBhdGggZD0iTSAxMDIuNzg5LDgwLjEzOSBMIDEwNy4xNjMsOTEuOTYgTCA5Ni42NzYsOTguOTUxIEwgMTA5LjI3MSw5OC40NDQgTCAxMTIuNjc4LDExMC41NzggTCAxMTYuMDg4LDk4LjQ0MyBMIDEyOC42ODIsOTguOTUxIEwgMTE4LjE5NCw5MS45NiBMIDEyMi41NjksODAuMTM5IEwgMTEyLjY3OCw4Ny45NTIgTCAxMDIuNzg5LDgwLjEzOSBaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iOSIgc3Ryb2tlPSIjNjM0ZDI5IiBmaWxsPSIjNjM0ZDI5IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBtYXJrZXItc3RhcnQ9Im5vbmUiIG1hcmtlci1lbmQ9Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSI3OS44NDAzMTkzNjEyNzc1Ii8+DQogICA8L2c+DQogIDwvZz4NCiA8L2c+DQo8L3N2Zz4NCg==
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM.deleteValue
// @run-at            document-start
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/467835/File%20Regexplorer.user.js
// @updateURL https://update.greasyfork.org/scripts/467835/File%20Regexplorer.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

// --------------------------------------------------
// ---                   START                    ---
// --------------------------------------------------

function start(){

'use strict';

// Exit if page is cached
const _html = document.documentElement;
if (_html.classList.contains('od_regexplorer')) return;
_html.classList.add('od_regexplorer');

const _name = GM.info.script.name;
const _vers = GM.info.script.version;
const _icon = GM.info.script.icon || GM.info.scriptMetaStr.match(/^\/\/ @icon +(.*)$/m)[1];
const _header = document.querySelector('#header, h1');
const _table = document.querySelector('table');
const _thead = _table.querySelector('#theader, thead > tr');
const _tbody = _table.querySelector('#tbody, tbody');
const _topbar = document.createElement('div');
const _form = document.createElement('div');
const _url = window.location.href;
const _urlHash = getHash(_url);
let _arrRows;
let _order;
let _orderBy;
let _userData;

// --------------------------------------------------
// ---                    DATA                    ---
// --------------------------------------------------

async function saveData(){
  const data = {};
  if (_inpPattern.value) data.pattern = _inpPattern.value;
  if (_ckbFlagI.checked) data.flagI = 1;
  if (_inpOutput.value) data.output = _inpOutput.value;
  if (_ckbFilteredView.checked) data.filteredView = 1;
  if (_orderBy) data.orderBy = _orderBy;
  if (_order === -1) data.order = -1;

  if (Object.keys(data).length === 0) GM.deleteValue(_urlHash);
  else GM.setValue(_urlHash, JSON.stringify(data));
}
async function loadData(){
  _html.removeAttribute('style');
  const dataJSON = await GM.getValue(_urlHash);
  if (!dataJSON) return;
  const data = JSON.parse(dataJSON);

  if (data.pattern) _inpPattern.value = data.pattern;
  if (data.flagI) _ckbFlagI.checked = true;
  if (data.output) _inpOutput.value = data.output;
  if (data.filteredView) _ckbFilteredView.checked = true;
  _orderBy = data.orderBy ? +data.orderBy : 0;
  _order = data.order ? -1 : 1;

  fillOutputColumn(_inpPattern.value, _inpOutput.value);
  setFilteredView(_ckbFilteredView.checked, {skipTransition: true});

  if (_orderBy || _order === -1){
    _table.dataset.order = _order;
    sortBy(_orderBy, true);
  }
}
function getHash(s){
  const hash = Array.from(s).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0).toString(36);
  return '_' + (hash[0] === '-' ? hash.slice(1).toUpperCase() : hash);
}

loadData();

// --------------------------------------------------
// ---                    TOP                     ---
// --------------------------------------------------

_topbar.id = 'od_topbar';
_topbar.innerHTML = `<a href="https://greasyfork.org/it/scripts/467835-file-regexplorer">${_name} v${_vers}</a>`;
document.body.appendChild(_topbar);


// --------------------------------------------------
// ---                    FORM                    ---
// --------------------------------------------------

// Pattern fields
_form.id = 'od_form';
_form.innerHTML = `
<div class="od_container_field" id="od_container_pattern">
  <label class="od_lbl" id="od_lbl_pattern">Pattern (.*): <input class="od_inp" id="od_inp_pattern" value="" spellcheck="false"></label>
  <label class="od_lbl od_lbl_top" id="od_lbl_pattern_flag_i"><input type="checkbox" class="od_ckb od_ckb_top" id="od_ckb_pattern_flag_i"> Case Insensitive</label>
</div>
<div class="od_container_field" id="od_container_output">
  <label class="od_lbl" id="od_lbl_output">Output: <input class="od_inp" id="od_inp_output" value="" spellcheck="false"></label>
  <label class="od_lbl od_lbl_top" id="od_lbl_output_filtered_view"><input type="checkbox" class="od_ckb od_ckb_top" id="od_ckb_output_filtered_view"> Filtered view</label>
</div>
`;
_header.parentNode.insertBefore(_form, _header.nextSibling);
const _inpPattern = document.getElementById('od_inp_pattern');
const _ckbFlagI = document.getElementById('od_ckb_pattern_flag_i');
const _inpOutput = document.getElementById('od_inp_output');
const _ckbFilteredView = document.getElementById('od_ckb_output_filtered_view');

// Check regex pattern validity
_inpPattern.addEventListener('input', e => {
  const me = e.target;
  const pat = me.value;
  me.setCustomValidity('');
  try {
    new RegExp(pat);
  } catch(err){
    me.setCustomValidity('Invalid regex pattern');
  }
});

// Redraw output column based on form values
function submitForm(){
  fillOutputColumn(_inpPattern.value, _inpOutput.value);
  if (_table.dataset.orderBy === '1') sortBy(1, true);
  saveData();
}

// When press a key in the fields
function onKey(e){
  const me = e.target;
  if (e.keyCode === 13){
    if (me ===_inpPattern) _inpOutput.focus();
    else me.blur();
  } else if (e.keyCode === 27){
    me.value = me.dataset.currentValue;
    me.blur();
  }
}

// When field focus
function onFocus(e){
  const me = e.target;
  me.dataset.currentValue = me.value;
}

// Form fields listeners
[_inpPattern, _inpOutput].forEach(e => {
  e.addEventListener('change', submitForm);
  e.addEventListener('focus', onFocus);
  e.addEventListener('keydown', onKey);
});
_ckbFlagI.addEventListener('change', e => {
  submitForm();
});
_ckbFilteredView.addEventListener('change', e => {
  const me = e.target;
  saveData();
  setFilteredView(me.checked);
});


// --------------------------------------------------
// ---                   TABLE                    ---
// --------------------------------------------------

(()=>{
  const th = document.createElement('th');
  th.innerText = '(.*)';
  _thead.insertBefore(th, _thead.cells[1]);

  // Clean & set column headers
  setTimeout(()=>{
    Array.from(_thead.cells).forEach(th => {
      th.innerHTML = th.innerText;
      th.tabIndex = '0';
      th.setAttribute('role', 'button');
    });
  }, 100);

  Array.from(_tbody.rows).forEach(tr => {
    const td0 = tr.cells[0];
    if ('value' in td0.dataset){
      // On Chromium, prepend 1 or 2 for the value of folders or files respectively, to keep items separate when sorting, like Firefox does
      const tdVal = td0.dataset.value;
      if (tdVal){
        td0.dataset.value = (tdVal.slice(-1) === '/')
          ? 1 + (td0.firstChild.innerHTML = tdVal.slice(0,-1))
          : 2 + tdVal
        ;
      }
    } else if (td0.hasAttribute('sortable-data')){
      // FF - pass the values to the data attribute for each td
      Array.from(tr.cells).forEach(td => {
        td.dataset.value = td.getAttribute('sortable-data');
        td.removeAttribute('sortable-data');
      });
      // FF remove the nested table with the ellipsis from the file name cell
      td0.innerHTML = td0.querySelector('a').outerHTML;
    }

    // Wrap cell content
    Array.from(tr.cells).forEach((td, index) => {
      if (td.innerHTML === '') return;
      td.innerHTML = `<div>${td.innerHTML}</div>`;
    });

    // Add output column
    let td = document.createElement('td');
    tr.insertBefore(td, tr.cells[1]);
  });

  // Shadow thead sticky
  const shadow = document.createElement('div');
  shadow.id = 'od_shadow_thead_sticky';
  document.body.insertBefore(shadow, _table);

  // Change the sort order when you press on the headers
  _thead.addEventListener('click', e => {
    e.stopPropagation();
    sortBy(e.target.cellIndex);
    saveData();
  }, true);
  _thead.addEventListener('keydown', e => {
    if (e.key == 'Enter' || e.key == ' ') {
      e.stopPropagation();
      e.preventDefault();
      sortBy(e.target.cellIndex);
      saveData();
    }
  }, true);

  // Default array rows (sorted by filename ascending)
  _arrRows = Array.from(_tbody.rows);
  sortBy(0);
  _arrRows = Array.from(_tbody.rows);
})();

function fillOutputColumn(pat, out){
  let reg;
  try {
    reg = new RegExp(pat, _ckbFlagI.checked ? 'i' : '');
  } catch(err) {
    console.error('Invalid regex pattern');
    return;
  }
  const nomatches = [];

  _arrRows.forEach((tr, index) => {
    const valName = tr.cells[0].innerText;
    const matches = valName.match(reg);
    const td = tr.cells[1];
    if (matches === null){
      nomatches[index] = true;
      td.innerHTML = '<div></div>';
      // Prepend 2 for empty values, otherwise 1, to keep items separate when sorting
      td.dataset.value = 2;
    } else {
      const text = matches[0]?.replace(reg, out || '$&') || '';
      td.innerHTML = `<div>${text}</div>`;
      td.dataset.value = 1 + text;
    }
  });
  // Apply nomatch class
  applyNomatch(nomatches);

}
function applyNomatch(nomatches){
    _arrRows.forEach((tr, index) => {
      tr.classList.toggle('od_nomatch', nomatches[index] || false);
    });
}
function sortBy(column, keepOrder = false){
  const rows = Array.from(_arrRows);
  _order = keepOrder ? +_table.dataset.order : (_orderBy == column && _table.dataset.order === '1') ? -1 : 1;
  _table.dataset.orderBy = _orderBy = column;
  _table.dataset.order = _order;
  rows.sort((rowA, rowB) => {
    let a = rowA.cells[_orderBy].dataset.value || '';
    let b = rowB.cells[_orderBy].dataset.value || '';
    return _order * a.localeCompare(b, false, {numeric: true});
  });

  _tbody.innerHTML = '';
  for (let i = 0; i < rows.length; i++){
    _tbody.appendChild(rows[i]);
  }
}
function setFilteredView(b, o){
  if (o?.skipTransition){
    _table.classList.add('od_skip_transition');
    setTimeout(()=>{_table.classList.remove('od_skip_transition');}, 0)
  }
  _table.classList.toggle('od_filtered_view', b);
}

// --------------------------------------------------
// ---                   STYLE                    ---
// --------------------------------------------------

addGlobalStyle(`
/* -------------------------------------------------- */
/* ---                   RESET                    --- */
/* -------------------------------------------------- */

html *,
html *::before,
html *::after {box-sizing: border-box}
:root {
  padding-inline: 0;
}

/* -------------------------------------------------- */
/* ---                    MAIN                    --- */
/* -------------------------------------------------- */

body {
  position: relative;
  width: auto;
  min-width: 500px;
  margin: 4em auto;
  padding: 2em 1em;
  font: 12px "Segoe UI", "DejaVu Sans", "Bitstream Vera Sans", "Lucida Grande", Verdana, Tahoma, Arial, sans-serif;
  border: 1px solid;
  border-radius: 10px;
}
#header, h1 {
  margin: 0 0 60px;
  padding: 0;
  white-space: normal;
  word-break: break-word;
  font-size: 160%;
  font-weight: normal;
  border-bottom: 1px solid;
}
#header, h1 {
  margin: 0 0 60px;
  padding: 0;
  white-space: normal;
  word-break: break-word;
  font-size: 160%;
  font-weight: normal;
  border-bottom: 1px solid;
}

/* -------------------------------------------------- */
/* ---                   TOPBAR                   --- */
/* -------------------------------------------------- */

#od_topbar {
  display: inline-flex;
  align-items: center;
  position: absolute;
  top: -30px;
  left: 0;
}
#od_topbar a {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  padding-left: 40px;
  height: 30px;
  background: 8px/24px url(${_icon}) no-repeat;
}

/* -------------------------------------------------- */
/* ---                    FORM                    --- */
/* -------------------------------------------------- */

#od_form {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  margin: -50px 0 10px;
  padding: 5px 10px;
}
input.od_inp {
  width: 100%;
  margin: 5px 0 0;
  padding: .5em;
  border: 1px solid;
}
input.od_inp:invalid {
  outline: 1px solid;
}
.od_container_field {
  position: relative;
}
.od_lbl {
  user-select: none;
}
.od_lbl_top {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  padding-left: 18px;
  margin-right: 10px;
}
.od_ckb_top {
  position: absolute;
  left: 0;
  margin: 0;
}

/* -------------------------------------------------- */
/* ---                   TABLE                    --- */
/* -------------------------------------------------- */

body > table {
  min-width: 100%;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0;
}
thead {
  position: sticky;
  top: 0;
  z-index: 2;
}
#od_shadow_thead_sticky {
  clear: both;
  position: sticky;
  top: 0;
  width: 100%;
  height: 2.5em;
  margin-top: -2.5em;
  pointer-events: none;
}

/* FF fix. Collapse margin after floated elements */
#UI_goUp, #UI_showHidden {
  margin-bottom: -2.5em;
  position: relative;
  z-index: 1;
}

:root.od_regexplorer > body > table > * > tr > * {
  padding-block: 4px;
  padding-inline: 8px;
}
body > table > thead > tr > th {
  position: relative;
  border-width: 1px;
  border-style: solid;
  font-size: 15px;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}
body > table > tbody > tr {
  outline-offset: -1px;
}
body > table > tbody > tr > td {
  border: solid transparent;
  border-width: 0 1px;
}
body > table > tbody > tr > td {
}
body > table > thead > tr > th:first-child {
  text-align: start;
}
body > table > tbody > tr > td:nth-child(-n+2) {
  text-align: start;
  overflow-wrap: anywhere;
}
body > table > tbody > tr > td:nth-child(3) {
  text-align: end;
}
body > table > tbody > tr > td:nth-child(4) {
  text-align: center;
}
body > table > tbody > tr {
  outline: 1px solid transparent;
}
body > table > tbody > tr > td:first-child a {
  display: inline-block;
  white-space: break-spaces;
}

/* Sorting icons - column headers */
table[data-order-by="0"] > thead > tr > th:nth-child(1)::after,
table[data-order-by="1"] > thead > tr > th:nth-child(2)::after,
table[data-order-by="2"] > thead > tr > th:nth-child(3)::after,
table[data-order-by="3"] > thead > tr > th:nth-child(4)::after {
  display: inline-block;
}
table[data-order] > thead > tr > th::after {
  display: none;
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  width: fit-content;
  margin-inline: auto;
  font-size: 9px;
  text-align: center;
  opacity: .4;
  transform: scaleX(1.5);
}
table[data-order="1"] > thead > tr > th::after {
  content: "˄";
}
table[data-order="-1"] > thead > tr > th::after {
  content: "˅";
}

/* Unmatched items */
tr.od_nomatch td:nth-child(2) {
  position: relative;
}
tr td:nth-child(2) > div:empty {
  width: 0;
  left: 50%;
  transform: translateX(-50%);
}
tr.od_nomatch td:nth-child(2) > div {
  position: absolute;
  top: 50%;
  border-bottom: 1px solid #e5683e;
  width: 100%;
}

/* Filtered view - hide rows with unmatched items */
body > table > tbody > tr > td {
  opacity: 1;
  transition: .3s .2s;
}
body > table > tbody > tr > td > div {
  overflow: hidden;
  max-width: 75vw;
  max-height: 10em;
  transition: .3s .2s, max-width .2s;
}
body > table.od_filtered_view > tbody > tr.od_nomatch > td {
  padding-block: 0;
  opacity: 0;
  transition: .5s;
}
body > table.od_filtered_view > tbody > tr.od_nomatch > td > div {
  max-width: 0;
  max-height: 0;
  transition: .3s, max-width .3s .3s;
}
body > table.od_skip_transition > tbody > tr.od_nomatch > td,
body > table.od_skip_transition > tbody > tr.od_nomatch > td > div {
  transition: none;
}

@media (min-width: 600px) {
#od_form {grid-template-columns: 3fr 2fr;}
body {
  max-width: 800px;
  min-width: fit-content;
  padding: 3em;
}
}

/* -------------------------------------------------- */
/* ---                   COLORS                   --- */
/* -------------------------------------------------- */

thead > tr                            {box-shadow: -1px 0 0, 1px 0 0;}
:root                                 {background-color: #efefef;}
body                                  {background-color: #fff; border-color: #8888;}
#od_shadow_thead_sticky               {box-shadow: 0 .3em .8em .3em #fff;}
#od_topbar a                          {color: #555;}
#od_topbar a:hover                    {color: #111;}
#od_form                              {background: #8882;}
#header, h1                           {border-bottom-color: #8889;}
input.od_inp                          {background: #fff; border-color: #888;}
input.od_inp:invalid                  {background-color: #f003; outline-color: #f33;}
thead > tr                            {background-color: #eee; color: #eee;}
thead > tr > th                       {color: #333; border-color: transparent #888a #8884 transparent;}
thead > tr > th:last-child            {border-right-color: transparent}
thead > tr > th:hover                 {background: #8883;}
body > table > tbody > tr:hover       {background: #8881; outline-color: #8889;}

@media (prefers-color-scheme: dark) {
:root                                 {background-color: #18181a;}
body                                  {background-color: #272729;}
#od_shadow_thead_sticky               {box-shadow: 0 .3em .8em .3em #272729;}
thead > tr                            {background-color: #333; color: #333;}
thead > tr > th                       {color: #eee;}
#od_topbar a                          {color: #bbb;}
#od_topbar a:hover                    {color: #eee;}
input.od_inp                          {background: #454546;}
}
`);
}

function addGlobalStyle(strCSS){
  const h = document.querySelector('head');
  if (!h) return;
  const s = document.createElement('style');
  s.type = 'text/css';
  s.innerHTML = strCSS;
  h.appendChild(s);
}

// --------------------------------------------------
// ---           WHEN DOCUMENT IS READY           ---
// --------------------------------------------------

if (['complete', 'interactive', 'loaded'].includes(document.readyState)){
  // Document has at least been parsed
  start();
} else {
  // Document is not ready yet, so wait for the event
  document.documentElement.style.opacity = '0';
  document.addEventListener('DOMContentLoaded', start, false);
}