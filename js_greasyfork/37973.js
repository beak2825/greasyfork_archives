// ==UserScript==
// @name         Faction Challenge Totals
// @namespace    namespace
// @version      0.7.1
// @description  description
// @author       tos
// @grant        GM_setClipboard
// @match        *.torn.com/factions.php*
// @downloadURL https://update.greasyfork.org/scripts/37973/Faction%20Challenge%20Totals.user.js
// @updateURL https://update.greasyfork.org/scripts/37973/Faction%20Challenge%20Totals.meta.js
// ==/UserScript==

const rowDelim = '\t'
const colDelim = '\n'


let copyEx = localStorage.getItem('copy_ex_members') || false
const copy = (res) => {
  let clipboard = `User ID${rowDelim}Name${rowDelim}${res.upgrade.icon}${colDelim}`
  for (const group of res.contributors) {
    for (const member of Object.keys(group)) {
      if(!copyEx && group[member].exmember) continue
      clipboard += group[member].userid + rowDelim
      clipboard += group[member].playername + rowDelim
      clipboard += group[member].total.replace(',', '') + colDelim
    }
  }
  return clipboard
}
$(document).ajaxComplete((event, jqXHR, ajaxObj) => {
  if (ajaxObj.data && ajaxObj.data.includes('step=upgradeConfirm')) {
    const resp = JSON.parse(jqXHR.responseText)
    const buttonWrap = document.querySelector('#stu-confirmation .buttons-wrap')
    let challenge_total = 0
    if (resp.contributors) {
      for (const group of resp.contributors)
        for (const member of Object.keys(group))
          challenge_total += parseInt(group[member].total.replace(',', ''))
      buttonWrap.insertAdjacentHTML('beforeend', `<div class="name">Challenge Total: ${numberWithCommas(challenge_total)}</div>`)
      buttonWrap.insertAdjacentHTML('beforeend', `<div class="buttons"><span class="name link">Copy to clipboard</span></div>`)
      buttonWrap.insertAdjacentHTML('beforeend', `<span style="color: gray; padding-right: 5px;">copy exMembers</span><input id="exMembers_ck" type="checkbox">`)
      document.querySelector('#stu-confirmation .buttons-wrap .name.link').addEventListener('click', () => {GM_setClipboard(copy(resp))})
      const exBox = document.querySelector('#stu-confirmation .buttons-wrap #exMembers_ck')
      exBox.checked = copyEx
      exBox.addEventListener('change', (e) => {
        copyEx = e.target.checked
        localStorage.setItem('copy_ex_members', e.target.checked)
      })
    }
  }
})
function numberWithCommas(x) {
  var parts = x.toString().split(".");
  return parts[0].replace(/\B(?=(\d{3})+(?=$))/g, ",") + (parts[1] ? "." + parts[1] : "");
}