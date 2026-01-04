// ==UserScript==
// @name           RED External Stylesheet Switcher
// @description    Adds local save/load of external CSS URL's
// @author         mrpoot
// @version        0.0.3
// @match          https://redacted.sh/user.php?action=edit&*
// @grant          none
// @run-at         document-end
// @namespace      https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/35558/RED%20External%20Stylesheet%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/35558/RED%20External%20Stylesheet%20Switcher.meta.js
// ==/UserScript==
  
(() => {
  
const list = JSON.parse(localStorage.getItem('saved_external_css') || '[]');
  
const $cssRow = $('#site_extstyle_tr');
const $cssInput = $cssRow.find('input');
const $switcherRow = $(`
  <tr>
    <td class="label tooltip">
      <strong>Saved External CSS:</strong>
    </td>
  </tr>
`);
const $switcherCol = $(`<td></td>`);
const $select = $('<select />');
const $saveButton = $(`<input type="button" value="⇓ Save" />`);
const $loadButton = $(`<input type="button" value="Load ⇑" />`);
const $deleteButton = $(`<input type="button" value="Delete" />`);
  
const populateOptions = (save) => {
  const { value } = $cssInput[0];
  
  $select.empty();
  list.forEach(sheet =>
    $select.append(`
      <option value="${sheet}" ${sheet === value ? 'selected' : ''}>
        ${sheet.replace(/https?:\/\//,'')}
      </option>
    `)
  );
  
  if (save) {
    localStorage.setItem('saved_external_css', JSON.stringify(list));
  }
};
  
populateOptions();
  
$switcherCol
  .append([$saveButton, ' ', $loadButton, ' ', $deleteButton])
  .append(`<br />`)
  .append($select);
  
$switcherRow.append($switcherCol);
  
$cssRow.after($switcherRow);
  
$select.bind('change', (e) => {
  $cssInput.val(e.target.value);
});
  
$loadButton.bind('click', (e) => {
  $cssInput.val($select.val());
});
  
$saveButton.bind('click', () => {
  const sheet = $cssInput.val();
  
  if (list.indexOf(sheet) > -1) {
    return;
  }
  
  list.push(sheet);
  
  populateOptions(true);
});
  
$deleteButton.bind('click', () => {
  if (!confirm('You sure?')) {
    return;
  }
  
  const { selectedIndex } = $select[0];
  
  if (selectedIndex === -1) {
    return;
  }
  
  list.splice(selectedIndex, 1);
  
  populateOptions(true);
});
  
})();
