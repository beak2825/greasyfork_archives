// ==UserScript==
// @name         osrs poll good
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fixes osrs poll %
// @author       You
// @match        http://secure.runescape.com/m=poll/oldschool/results?id=*
// @match        https://secure.runescape.com/m=poll/oldschool/results?id=*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/420697/osrs%20poll%20good.user.js
// @updateURL https://update.greasyfork.org/scripts/420697/osrs%20poll%20good.meta.js
// ==/UserScript==

let fieldset = document.getElementsByTagName("fieldset");
let totalVotes = parseInt(document.body.innerHTML.match(/Total Number of Votes: (\d+)/)[1]);

for (var i = 0; i < fieldset.length; i++) {
    let tr = fieldset[i].getElementsByTagName("tr");
    if(tr.length == 3 && tr[0].getElementsByTagName("td")[0].innerHTML == "Yes"
      && tr[1].getElementsByTagName("td")[0].innerHTML == "No"
      && tr[2].getElementsByTagName("td")[0].innerHTML == "Skip question") {
        let yes = tr[0].getElementsByTagName("td")[2];
        let no = tr[1].getElementsByTagName("td")[2];
        let skip = tr[2].getElementsByTagName("td")[2];
        let yesVotes = parseInt(yes.innerHTML.match(/(\d+) votes/)[1]);
        let noVotes = parseInt(no.innerHTML.match(/(\d+) votes/)[1]);
        let withoutSkip = yesVotes + noVotes;
        let yesFixed = document.createElement("td");
        yesFixed.innerHTML = (yesVotes*100 / withoutSkip).toFixed(1) + "% (" + yesVotes + " votes)";
        let noFixed = document.createElement("td");
        noFixed.innerHTML = (noVotes*100 / withoutSkip).toFixed(1) + "% (" + noVotes + " votes)";
        let skipFixed = document.createElement("td");
        skipFixed.innerHTML = "N/A% (" + (totalVotes-withoutSkip) + " votes)";
        tr[0].replaceChild(yesFixed, yes);
        tr[1].replaceChild(noFixed, no);
        tr[2].replaceChild(skipFixed, skip);
    }
}