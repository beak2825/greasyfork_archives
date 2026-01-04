// ==UserScript==
// @name         Torn Extensions - Torn Attack Stats
// @namespace    https://www.torn.com/profiles.php?XID=1918010#/
// @version      1.3
// @description  Get some information on the attack page.
// @author       Mathias
// @match        https://www.torn.com/loader.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391922/Torn%20Extensions%20-%20Torn%20Attack%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/391922/Torn%20Extensions%20-%20Torn%20Attack%20Stats.meta.js
// ==/UserScript==

(function attack() {
    'use strict';

    let api = "API HERE";
    let url = window.location.href;
    if(url.includes("sid=attack"))
    {
        url = new URL(url);
        let attackId = url.searchParams.get("user2ID");
        console.log(`https://api.torn.com/user/${attackId}?selections=profile,personalstats&key=${api}`);
        fetch(`https://api.torn.com/user/${attackId}?selections=profile,personalstats&key=${api}`)
		.then(function(response) {
			if (response.status !== 200) {
				console.log(`fetch error ${response.status}`);
				return;
			}
			response.json().then(function(data) {
                let joinBtn = $("button:contains(\"Start fight\"), button:contains(\"Join fight\")").closest("button");
				if($(joinBtn).length) {
					$(joinBtn).after(`<div id='attackInfo'>
					<br />Attacks: <font color='green'>[W] ${parseInt(data.personalstats.attackswon) || 0}</font> <font color='red'>[L] ${parseInt(data.personalstats.attackslost) || 0}</font>
					<br />Defends: <font color='green'>[W] ${parseInt(data.personalstats.defendswon) || 0}</font> <font color='red'>[L] ${parseInt(data.personalstats.defendslost) || 0}</font>
					<br />Drugs: ${parseInt(data.personalstats.drugsused) || 0} used (${parseInt(data.personalstats.xantaken) || 0} xan)
					<br />Consumables: ${parseInt(data.personalstats.consumablesused) || 0} used
					<br />Refills: ${parseInt(data.personalstats.refills) || 0} used
                    <br />Networth: $${data.personalstats.networth.toLocaleString("en")}
					<br />Last action: ${data.last_action.relative}
					<br />Faction: <a href='https://www.torn.com/factions.php?step=profile&ID=${data.faction.faction_id}'>${data.faction.faction_name}</a>
					</div>`);
				}
			}).catch((err) => { console.log(err); });
		}).catch(function(err) {
			console.log(`fetch error ${err}`);
		});
    }
})();