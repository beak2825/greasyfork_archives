// ==UserScript==
// @name         Chain report export to CSV
// @namespace    Jox.Torn
// @version      3.1.0
// @description  Prepare data and add link to export data to CSV file
// @author       Jox [1714547]
// @match        https://www.torn.com/war.php*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/368244/Chain%20report%20export%20to%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/368244/Chain%20report%20export%20to%20CSV.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    addButton();
});

var ChainData = null;
var Chain = [];
var War = [];

function addButton(){

    var whereToPlace = document.getElementById('skip-to-content').parentElement;
    var button = document.createElement('input');
    button.type = 'button';
    button.value = 'Export';
    button.style.padding = '5px';
    button.onclick = function (){

        if(ChainData){ //Exporting chain
            for(var rows in ChainData.members){
                Chain.push(
                    {userid:ChainData.members[rows].userID,
                     playername:ChainData.members[rows].playername,
                     level:ChainData.members[rows].level,
                     respect:ChainData.members[rows].respect,
                     leaves:ChainData.members[rows].leaves,
                     mugs:ChainData.members[rows].mugs,
                     hosps:ChainData.members[rows].hosps,
                     assists:ChainData.members[rows].assists,
                     attacks:ChainData.members[rows].attacks,
                     retals:ChainData.members[rows].retals,
                     overseas:ChainData.members[rows].overseas,
                     draws:ChainData.members[rows].draws,
                     escapes:ChainData.members[rows].escapes,
                     losses:ChainData.members[rows].losses,
                     wars:ChainData.members[rows].wars ? ChainData.members[rows].wars : 0,
                     bonuses:ChainData.members[rows].bonuses ? ChainData.members[rows].bonuses : 0,
                    }
                );
            }

            exportToCSVFile(Chain, 'chaindata.csv');
        }
        else{//No chain data, check for war data...
            if(document.querySelector(".faction-war")){
                let enemy_faction_members = document.querySelectorAll("div.enemy-faction ul.members-list li:not(.iconShow)");
                for(var member of enemy_faction_members){
                    War.push({
                        name : member.querySelector("div.member a.user.name").innerHTML.trim(),
                        lvl : Number(member.querySelector(".lvl").innerHTML.trim()),
                        points : Number(member.querySelector(".points").innerHTML.trim().replace(',','')),
                        joins :  Number(member.querySelector(".joins").innerHTML.trim().replace(',','')),
                        knockoff :  Number(member.querySelector(".knock-off").innerHTML.trim().replace(',','')),
                        enemy : true
                    });
                }

                let your_faction_members = document.querySelectorAll("div.your-faction ul.members-list li:not(.iconShow)");
                for(var member of your_faction_members){
                    War.push({
                        name : member.querySelector("div.member a.user.name").innerHTML.trim(),
                        lvl : Number(member.querySelector(".lvl").innerHTML.trim()),
                        points : Number(member.querySelector(".points").innerHTML.trim().replace(',','')),
                        joins :  Number(member.querySelector(".joins").innerHTML.trim().replace(',','')),
                        knockoff :  Number(member.querySelector(".knock-off").innerHTML.trim().replace(',','')),
                        enemy : false
                    });
                }

                exportToCSVFile(War, 'wardata.csv');
            }
        }
    }

    whereToPlace.insertBefore(button, whereToPlace[0]);
}


function exportToCSVFile(arrayToExport, filename) {
    let dataStr = "";


    for(var i=0; i<arrayToExport.length; i++){

        if(i == 0){
            var j = 0;
            for(var dataheader in arrayToExport[i]){
                dataStr += (j==0 ? "" : ",") + dataheader;
                j++;
            }
            dataStr += "\n";
        }

        var x = 0;
        for(var data in arrayToExport[i]){
            dataStr += (x == 0 ? "" : ",") + (typeof arrayToExport[i][data] === 'string' ? "\"" : "") + arrayToExport[i][data] + (typeof arrayToExport[i][data] === 'string' ? "\"" : "");
            x++;
        }
        dataStr += "\n";

    }

    let dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = filename ? filename : 'data.csv';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}



// save the original fetch
const original_fetch = fetch

// replace the page's fetch with our own
window.fetch = async (input, init) => {
	//console.log('initiating fetch', input, init)

	const response = await original_fetch(input, init)

	//console.log('fetch done', response)

	// on certain requests...
	if (response.url.startsWith('https://www.torn.com/war.php?step=getChainReport&chainID=')) {
		// clone the response so we can look at its contents
		// otherwise we'll consume them and the page won't be able to read them
		const clone = response.clone()

		// parse and read the cloned response as json(), text() or whatever
		// note we do not await or we'll delay the response for the page
		//clone.json().then((json) => console.log('fetched data', json))
        clone.json().then((json) => {ChainData = json});
	}

	return response
}
