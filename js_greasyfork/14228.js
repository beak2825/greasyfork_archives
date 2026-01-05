// ==UserScript==
// @name        Colonies Administration
// @namespace   bitbucket.org/Odahviing
// @include     http://www.war-facts.com/overview.php?view=1
// @version     1.2
// @description Add more info to the colony administration page
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/14228/Colonies%20Administration.user.js
// @updateURL https://update.greasyfork.org/scripts/14228/Colonies%20Administration.meta.js
// ==/UserScript==

// Version 1.0 - Add Total Size and Density
// Version 1.1 - Add Ship Upkeep
// Version 1.2 - Add Avg population // need to re build the script - not write good

function manyReplaces(text, amount)
{
    for (var index = 0; index <amount; index++)
        text = text.replace(',','');
    return text;
}

function realNumber(text)
{
    return Number(text).toLocaleString('en');
}


var title = document.getElementsByClassName('dark bold centertext largetext150 padding5 box tbborder')[0];

if (title.innerHTML == "C O L O N Y &nbsp;&nbsp; A D M I N I S T R A T I O N")
{
    var colonyLine = document.getElementsByClassName('padding5 tbborder fullwidth')[0];
    var colonyAmount = colonyLine.innerHTML.split(' ')[2];
    
    var peopleLine = document.getElementsByClassName('padding5 tbborder fullwidth')[1];
    var peopleAmount = peopleLine.innerHTML.split(' ')[2];

    peopleAmount = manyReplaces(peopleAmount,2);
    var value = GM_getValue('size');
    var density = parseInt(peopleAmount) / value;
    
    peopleLine.outerHTML += "<div class='padding5 tbborder fullwidth'>Total Size: " +
        realNumber(value)  + " (" + density.toFixed(2) + " Density)</div>";     
    var incomeLine = document.getElementsByClassName('padding5 tbborder fullwidth')[4];
    var tmp = document.getElementsByTagName('li')[9];
    var totalIncome = tmp.innerHTML.substring(tmp.innerHTML.indexOf('alt="income"') +14);
    totalIncome = manyReplaces(totalIncome.substring(0, totalIncome.indexOf('cr')),3);
    var income = manyReplaces(incomeLine.innerHTML.substring
          (incomeLine.innerHTML.indexOf(' ') + 1,
           incomeLine.innerHTML.indexOf('cr'))
                              ,3);
    var ship = parseInt(income) - parseInt(totalIncome);
    var corruptionLine = document.getElementsByClassName('padding5 tbborder fullwidth')[3];
    corruptionLine.innerHTML = "Ship Upkeep: " + Number(ship).toLocaleString('en') + " cr";
    avgPop = realNumber(Math.round(parseInt(peopleAmount) / parseInt(colonyAmount)));
    incomeLine.outerHTML += "<div class='padding5 tbborder fullwidth'>Avg Population: " + avgPop;
}
else
{
    var mainTable = document.getElementsByClassName('width100 box lineheight')[0];
    var allColonies = mainTable.getElementsByClassName('dark padding5');
    var allSize = 0;
    for (var index = 0; index < allColonies.length; index++)
    {
        var colonyFrame = allColonies[index].getElementsByClassName('strong');
        var sizeLine = colonyFrame[3].innerHTML;
        var popLine = colonyFrame[1].innerHTML;
        
        var size = parseInt(sizeLine.substring(0, sizeLine.indexOf(' ')).replace(",","").replace(",",""));
        var pop = parseInt(popLine.substring(0, popLine.indexOf(' ')).replace(",","").replace(",",""));

        allSize += size;
        allColonies[index].getElementsByClassName('head')[1].innerHTML +=  "&nbsp;(" + (pop/size).toFixed(2) + " d)";
    }

    GM_setValue('size', allSize);
}
