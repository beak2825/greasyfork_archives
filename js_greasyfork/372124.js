// ==UserScript==
// @name         TopCoder Marathn Match Score Complement UserScript
// @namespace    https://github.com/kmyk
// @version      1.0
// @description  show "1000000 - Score" instead of "Score"
// @author       Kimiyuki Onaka
// @match        *://community.topcoder.com/longcontest/?*module=ViewStandings*
// @downloadURL https://update.greasyfork.org/scripts/372124/TopCoder%20Marathn%20Match%20Score%20Complement%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/372124/TopCoder%20Marathn%20Match%20Score%20Complement%20UserScript.meta.js
// ==/UserScript==
function main() {
    const table = document.getElementsByClassName("statTable")[0];
    const rows = table.getElementsByTagName('tr');
    const th = rows[1].getElementsByTagName('td');
    let x = 0;
    while (th[x].textContent.trim() != "Score")
        x += 1;
    th[x].textContent = "1000000 - " + th[x].textContent;
    for (let y = 2; y < rows.length; ++y) {
        const td = rows[y].getElementsByTagName('td')[x];
        td.textContent = (1000000 - parseFloat(td.textContent)).toFixed(2);
    }
}
main();
