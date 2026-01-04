// ==UserScript==
// @name         ChaturbateTokenStats
// @namespace    http://tampermonkey.net/
// @version      2025.10.21
// @description  Get Chaturbate token stats for individual rooms.
// @author       nyoob/seraphine24
// @match        https://chaturbate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/533436/ChaturbateTokenStats.user.js
// @updateURL https://update.greasyfork.org/scripts/533436/ChaturbateTokenStats.meta.js
// ==/UserScript==

// BOC config
const groups = {
    // add more groups like this:
    // groupname: ["username", "username2"],
    vtuber: ["emyliveshow", "kajira_kumiho", "kyrawildofficial", "tadakonyanko", "babydollstarlit", "Xstaceyliciousx", "Kittenlush", "Smartfeeling", "animecutie", "projectmelody", "skyeanette", "zonetron"],
}

// EOC config

const userToGroupMap = {};
for (const groupName in groups) {
  groups[groupName].forEach(user => {
    userToGroupMap[user] = groupName;
  });
}

const div = `
<div style="background-color: crimson; height: auto; width: 100%; position: static; overflow: hidden; display: block; padding: 5px 0px; text-align: center; box-sizing: border-box; font-size: 14px; font-weight: 400; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; color: rgb(73, 73, 73);" ts="p" class="siteNotice">
   <div class="wrapper seratkstats" style="background-color: darksalmon; padding: 15px; border-width: 1px; border-style: solid;">
      <h1 style="font-size: 150%">Stop spending money on porn! You can watch for free.</h1>
      <div>Imagine what you could do with that money — an unforgettable trip, a gift that would make your mother smile, a home that finally feels complete, a car that’s truly yours.<br />
      <b>Now imagine throwing all of that away for pixels that pretend to care..</b></div>
      <div>Chaturbate isn’t harmless fun — <b>it’s engineered addiction</b>. It drains your wallet, your time, your confidence. Like a casino built out of loneliness.<br />
      Every tip, every private show, every “hey baby” is a calculated hook, designed to keep you chasing validation that doesn’t exist.</div>
      <div>The affection you think you’re buying? It’s scripted. The connection you feel? Manufactured.<br />
      They’ve learned exactly how to make you feel special — just enough to keep you spending, never enough to make you whole.</div>
      <div><b>This isn’t intimacy. It’s psychological exploitation disguised as attention.</b><br />
      It’s dopamine on demand — <b>stronger than gambling, almost as binding as heroin.</b> Except this one doesn’t just empty your account — it empties you.</div>
      <div>Check out: <a href="https://www.youtube.com/watch?v=Y0zePr-5ilE">Larry Wheels on camgirl addiction</a> | <a href="https://easypeasymethod.org">EasyPeasyMethod</a> |
      <a href="https://www.nofap.com/wp-content/uploads/2016/12/Getting-Started-with-NoFap.pdf">Nofap</a></div>
      <button class="seraBtn" onclick="getTkStats()">Load token stats</button>
      <button class="seraBtn seraDlBtn" onclick="dlTkTx()" disabled>Download Tx JSON</button>
      <button class="seraBtn seraDlBtn" onclick="dlTkTx(true)" disabled>Download Tx CSV</button>
   </div>
</div>
`;

const styles = `
#site_notices .wrapper > div { margin-top: 8px; }
.loadStats { color: blue; }
.seratable { display: flex; justify-content: center; }
.seratable td, .seratable th { border-bottom: 1px solid white; }
.seraBtn { padding: 6px 12px; background-color: orange; border-radius: 8px; border: 1px solid pink; margin-top: 8px; }
.seraBtn:disabled { background-color: gray; }
`;

window.getTkStats = () => {
    var jso = JSON.parse(localStorage.getItem("seraTkStats"))
    var all = [];
    if(jso) { all = [...jso]; }
    function loadMore(last_tx_id) {
        var params = "";
        if(last_tx_id != null) {
         params += "?max_transaction_id=" + last_tx_id + "&cashpage=0"
        }

        fetch("/api/ts/tipping/token-stats/" + params)
            .then((r) => r.json())
            .then((r) => {
            all = [...all, ...Object.values(r.transactions)];

            if(!r.txns_fully_loaded) {
                loadMore(r.transactions[r.transactions.length - 1].id)
            } else {
                const unique = Array.from(new Map(all.map(i => [i.id, i])).values()); // make unique by id, in order not to get accidental duplicates, but still append new ones, even after switching accounts
                localStorage.setItem("seraTkStats", JSON.stringify(unique));
                alert("finished loading tk stats");
                window.location.reload();
            }
        })
    }
    loadMore();
}

window.dlTkTx = (csv = false) => {
    const stats = localStorage.getItem("seraTkStats");
    var dataStr;
    if(csv) {
        dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(jsonToCsv(JSON.parse(stats)));
    } else {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(stats);
    }
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transactions." + (csv ? "csv" : "json"));
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

const calculateTotalStats = () => {
    const data = JSON.parse(localStorage.getItem("seraTkStats"));

    var totalSpent = 0;
    var spentByUser = {};
    var spentByGroup = {};
    data.forEach((e) => {
        if(e.description == "Tokens purchased") return;
        totalSpent += Math.abs(e.tokens);

        // by user
        var username = e.username;
        if(e.description == "Spy on private show" || e.description == "Private show") {
             username = e.broadcaster_username;
        }
        if(!spentByUser[username]) {
            spentByUser[username] = 0;
        }
        spentByUser[username] += Math.abs(e.tokens);

        // by group
        const group = userToGroupMap[username] ?? "ungrouped";
        if(!spentByGroup[group]) {
            spentByGroup[group] = 0;
        }
        spentByGroup[group] += Math.abs(e.tokens);
    });

    spentByUser = Object.entries(spentByUser).sort(([,a],[,b]) => b-a);
    spentByGroup = Object.entries(spentByGroup).sort(([,a],[,b]) => b-a);

    return {totalSpent, spentByUser, spentByGroup};
}

const tksToDollar = (tks) => {
    const minPrice = 0.079
    const maxPrice = 0.109
    return {min: (tks * minPrice).toFixed(2), max: (tks * maxPrice).toFixed(2)};
}

function jsonToCsv(data) {
  const headers = Object.keys(data[0]);
  const replacer = (key, value) => value ?? ''; // handle null/undefined
  const csvRows = data.map(row =>
    headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
  );
  return [headers.join(','), ...csvRows].join('\r\n');
}

(function() {
    // div
    $("#site_notices").append(div);
    // style
    $('html > head').append(`<style>${styles}</style>`);
    // stats
    const totalStats = calculateTotalStats();
    const totalSpentInDollar = tksToDollar(totalStats.totalSpent);

    if(!totalStats) {
        $("#site_notices .wrapper").append(`
            <div class="seraAlert">Please load token stats. You have to be logged in to do that.<br/>Detailed stats will be shown after loading.</div>
        `)
    } else {
        $(".seraDlBtn").prop('disabled', false);
        $("#site_notices .wrapper").append(`
    <div>Total spent: ${totalStats.totalSpent}tks (in dollars: ${totalSpentInDollar.min}-${totalSpentInDollar.max})</div>
    <div>

    <details>
    <summary>Tks spent per user</summary>
    <div class="seratable">
    <table><thead>
    <tr>
    <td class="">Username</td>
    <td class="">Tokens spent</td>
    <td class="">Min Dollars</td>
    <td class="">Max Dollars</td>
    </tr></thead>
    <tbody>
    ${totalStats.spentByUser.map(([user, spent]) => {
        const totalSpentInDollar = tksToDollar(spent);
        return `<tr>
        <td><a href="https://chaturbate.com/${user}/">${user}</a></td><td>${spent}tks</td> <td>${totalSpentInDollar.min}</td><td>${totalSpentInDollar.max}</td>
        </tr>`;
    }).join("")}
    </tbody>
    </table>
    </div>
    </details>
    ` + (Object.keys(totalStats.spentByGroup).length > 0
    ? `<details>
    <summary>Tks spent per group</summary>
    <div class="seratable">
    <table><thead>
    <tr>
    <td class="">Username</td>
    <td class="">Tokens spent</td>
    <td class="">Min Dollars</td>
    <td class="">Max Dollars</td>
    </tr></thead>
    <tbody>
    ${totalStats.spentByGroup.map(([group, spent]) => {
        const totalSpentInDollar = tksToDollar(spent);
        return `<tr>
        <td>${group}</td><td>${spent}tks</td> <td>${totalSpentInDollar.min}</td><td>${totalSpentInDollar.max}</td>
        </tr>`;
    }).join("")}
    </tbody>
    </table>
    </div>
    </details>`
    : ``)
    + `</div>`)
    }
})();