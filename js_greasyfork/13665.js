// ==UserScript==
// @name           Colony Helper
// @description	   Add Farm/Mall/Storage auto-calc buttons if you need to buy them, also prev/next button to fast zipping and some stats
// @namespace      bitbucket.org/Odahviing
// @version		   3.5
// @include        http://www.war-facts.com/view_colony.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/13665/Colony%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/13665/Colony%20Helper.meta.js
// ==/UserScript==

// Version history:
// 1.0	Initial Basic Version
// 1.1  Add warning in colony page for lack in malls
// 1.2  Add the ability to buy malls from mail page (inner settings for mall)
// 1.3  Some Bug Fix
// 2.0  Add farm Option / Redesign Script
// 2.1  Add warning if no input has been given
// 2.21  Add buy storage option + Math fix
// 3.0 Update to new UI, remove sync requests, rebuild function
// 3.2 Add ability to load the print settings automatically
// 3.21 - Auto load prints once a day.
// 3.3 - More Bug Fix
// 3.4 - Farms Working
// 3.5 - Storage Working

var ColonyId = getQueryString(document.URL);

/* Global Settings */
var doPrevNext = true;
var checkMall = true;
var checkFarm = true;
var checkPrints = true;
var checkStorage = true;
var farmConstant = 0.18; // Don't have any idea what is the right number, but this number seems more or less right
var storageLine = 75; // % of full before adding ability to buy
var storageBuy = 50; // % to get while buying
var multi = 1.1; // How much I want more then I need

/* Prints Id */
var mallId;
var peopleMall;
var effMall;
// --- //
var farmId;
var peopleFarm;
var effFarm;
// --- //

/* Main */

originalParseInt = parseInt;
parseInt = function(str){if (!str.replace) return originalParseInt(str); else return originalParseInt(str.replace(/,/g, ""));}
originalParseFloat = parseFloat;
parseFloat = function(str){if (!str.replace) return originalParseFloat(str); else return originalParseFloat(str.replace(/,/g, ""));}

var mainDataBlock = document.getElementsByClassName('light padding5 tbborder');
var population = extractValue(mainDataBlock[0], 'Population');
var mallEffective;
var farmEffective;

main();

function main() {
    loadSettings().then(function() {
        addButtons();
        addColonyPageData();
    });
}

function addButtons() {
    if (doPrevNext == true)
        addPrevNext();

    if (startupTest() == false)
        return false;

    if (checkPrints == true)
        addUpdatePrintsButton();

    if (checkMall == true)
        addMallButton();

    if (checkFarm == true)
        addFarmButton();

    if (checkStorage == true)
        addStorageButton();
}

/* End Main */

/* Load Settings */

function addUpdatePrintsButton() {
    mainDataBlock[6].innerHTML = mainDataBlock[6].innerHTML +  `<input type='button' id='updatebutton' value='Update Prints'>`;
    var mainbutton = document.getElementById('updatebutton');
    if (GM_getValue('colony-date') != getCurrentDate())
        mainbutton.style ="color:red";
    else
        mainbutton.style ="color:gray";
    mainbutton.className = 'darkbutton noleft';
    mainbutton.addEventListener("click", function(){updatePrints()}, false);
}

function loadSettings() {
    return new Promise(function (fulfill) {
        var mallData = GM_getValue("mall");
        var farmData = GM_getValue("farm");
        var savedTime = GM_getValue('colony-date');

        if (!mallData || !farmData || savedTime != getCurrentDate()) {
            updatePrints().then(function() {
                return fulfill();
            });
        }
        else
        {
            updateValues(mallData, farmData);
            console.log(`Prints Loaded\nMalls:${JSON.stringify(readRow(mallData))}\nFarms:${JSON.stringify(readRow(farmData))}`);
            return fulfill();
        }
    });
}

function updatePrints() {
    return new Promise(function (fulfill) {
        getCurrentPrints(1, 11).then(function (farmData) { // load Farm
            getCurrentPrints(3, 8).then(function (mallData){ // load Mall
                let mallSavedValue = saveRow(mallData);
                let farmSavedValue = saveRow(farmData);

                GM_setValue("mall", mallSavedValue);
                GM_setValue("farm", farmSavedValue);
                GM_setValue('colony-date', getCurrentDate());
                updateValues(mallSavedValue, farmSavedValue);
                console.log(`Prints Updated\nMalls:${JSON.stringify(mallData)}\nFarms:${JSON.stringify(farmData)}`);
                // location.reload();
                return fulfill();
            });
        });
    });
}

function getCurrentDate()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
}

function updateValues(mallData, farmData) {
    let mallParseData = readRow(mallData);
    mallId = mallParseData.printId;
    peopleMall = mallParseData.workers;
    effMall = mallParseData.effect;
    let farmParseData = readRow(farmData);
    farmId = farmParseData.printId;
    peopleFarm = farmParseData.workers;
    effFarm = farmParseData.effect;

    mallEffective = peopleMall * effMall / 100;
    farmEffective = peopleFarm * effFarm / 100;
}

function readRow(value) {
    let tmp = value.split('&');
    return {printId: tmp[0], workers: tmp[1], effect: tmp[2]};
}

function saveRow(value) {
    return `${value.printId}&${value.workers}&${value.effect}`;
}

function getCurrentPrints(type, subtype) {
    return new Promise(function (fulfill){
        sendAjaxRequest('GET', `http://www.war-facts.com/blueprints.php?type=${type}&subtype=${subtype}`, true, true, null).then(function(html) {
            let div = document.createElement('div');
            div.innerHTML = html;
            let firstPrint = div.getElementsByClassName('overauto tbborder blueprint')[0];
            let firstCheckBox = firstPrint.getElementsByTagName('input')[1];
            let values = firstPrint.getElementsByTagName('span');
            return fulfill({printId: firstCheckBox.value, workers: values[1].innerHTML.split(' ')[0].trim(), effect: values[3].innerHTML.replace('%','').trim()});
        });
    });
}

// End Load Settings */

/* Add General Stats */

function addColonyPageData() {
    let landValue = extractValue(mainDataBlock[1], 'Size');
    let allLines = document.getElementsByClassName('smalltext');
    let popGrowth = parseInt(allLines[1].innerHTML.split(' ')[1].replace('(+','').replace(')',''));
    let landGrowth = parseFloat(allLines[2].innerHTML.split('(')[1].replace('+','').replace('km²)',''));

    allLines[1].innerHTML = allLines[1].innerHTML.replace('citizens ' , '') +  ` - ${parseFloat(100 * popGrowth / population).toFixed(3)}%`;
    allLines[2].innerHTML = allLines[2].innerHTML.replace('km² ' , '') +  ` - ${parseFloat(100 * landGrowth / landValue).toFixed(3)}%`;
    allLines[3].innerHTML = allLines[3].innerHTML.replace('citizens / km²','') + ` - Growth: ${(popGrowth/landGrowth).toFixed(2)}`;
}

/* Finish General Stats */

/* Helping Functions */

function extractValue(row, text) {
    return parseInt(row.innerHTML.substring(row.innerHTML.indexOf(text + ':') + text.length + 1, row.innerHTML.indexOf('<', row.innerHTML.indexOf(text + ':'))).trim());
}

function sendAjaxRequest(type, link, async, withResponse, params) {
    return new Promise(function (fulfill, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.open(type, link , true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);

        xhttp.onreadystatechange = function () {
          if(xhttp.readyState === 4 && xhttp.status === 200) {
              if (withResponse == true)
                  fulfill(xhttp.responseText);
              else
                  fulfill();
          }
        };
    });
}

function getQueryString(colonyURL) {
    var indexPoint = colonyURL.indexOf('?');
	if (indexPoint != -1)
		colonyURL = colonyURL.substring(indexPoint+1, colonyURL.length);
	return colonyURL.replace("colony=", "");
}

function startupTest() {
    if (atleastOneBuyerisActive() == false) return false;
    if (peopleMall * peopleFarm == 0)
    {
        alert("You didn't update script settings for best blueprints, stopping..");
        return false;
    }
    return true;
}

function atleastOneBuyerisActive() {return (checkMall || checkFarm || checkStorage);}

/* End Helping Functions */

/* Add Prev Button Functions */

function getPrevAndNext(currentColonyNumber) {
	var allColoniesFrame = document.getElementById("colonylist");
	var allColonies = allColoniesFrame.getElementsByClassName("colmenu_name");
	if (allColonies.length == 1)
		return [-1, -1];

	for (var index = 0; index < allColonies.length; index ++)
	{
  		var currentValue = getQueryString(allColonies[index].href);
		if (currentColonyNumber == currentValue)
		{
				if (index == 0)
					return [-1, getQueryString(allColonies[index+1].href)];

				if (index == allColonies.length -1)
					return [getQueryString(allColonies[index-1].href), -1];

			  return [getQueryString(allColonies[index-1].href), getQueryString(allColonies[index+1].href)];
		}
	}
}

function addPrevNext() {
	var prevNextValues = getPrevAndNext(ColonyId);
    var colonyText = document.getElementsByClassName("heading bold pagetitle");
	if (prevNextValues[1] != -1)
			colonyText[0].innerHTML = colonyText[0].innerHTML + "<span>&nbsp;&nbsp;&nbsp;<a href='view_colony.php?colony=" + prevNextValues[1] + "'><font color='yellow'>Next</font></a></span>";
    if (prevNextValues[0] != -1)
			colonyText[0].innerHTML = "<span><a href='view_colony.php?colony=" + prevNextValues[0] + "'><font color='yellow'>Prev</font></a>&nbsp;&nbsp;&nbsp;</span>" + colonyText[0].innerHTML;
}

/* End Prev Button Functions */

/* Mall Functions */

function addMallButton() {
    let mallValue = extractValue(mainDataBlock[5], 'Malled people');

	if (population * 1.1 > mallValue)
	{
		mainDataBlock[5].innerHTML = mainDataBlock[5].innerHTML.replace('Malled people', `<input type='button' id='mallbutton' value='Buy Malls'> for`);
		var mainbutton = document.getElementById('mallbutton');
        mainbutton.style ="color:red";
        mainbutton.className = 'darkbutton noleft';
		mainbutton.addEventListener("click", function(){buyMalls(population * multi, mallValue)}, false);
    }
}

function buyMalls(people, malled) {
	var baseParams = "build=1&type=3&subtype=8";
	var missing = people - malled;

	var toBuy = Math.ceil(missing / (mallEffective * 40));
	baseParams = baseParams + "&buildid=" + mallId + "&colony=" + ColonyId + "&amount=" + toBuy;
    console.log(baseParams);
    sendAjaxRequest("POST", "build_facility.php", true, false, baseParams);

	location.reload();
}

/* End Mall Functions */

/* Farm Functions */

function addFarmButton() {
    var tempHolder = mainDataBlock[17].innerHTML;
    let foodStringValue = tempHolder.substring(tempHolder.indexOf('</a>') + 4, tempHolder.indexOf('<span>')).trim();
    let foodValue = parseInt(foodStringValue);
    // console.log(`foodvalues is:${foodValue} and pop is:${population * 1.2}`);
	if (population * 1.2 > foodValue * 10)
	{
		var link = "/extras/colony_res.php?colony=" + ColonyId;
		var div = document.createElement('div');

		sendAjaxRequest("GET", link, true, true, "").then(function (html){
            div.innerHTML = html;
            var allLines = div.getElementsByTagName('tr');
            var LowValue = allLines[11].getElementsByTagName('td')[1].innerHTML;
            var HighValue = allLines[11].getElementsByTagName('td')[2].innerHTML;
            var currentProduction = (parseInt(LowValue) * 0.8 + parseInt(HighValue) * 0.2);
            var resourcesGap = Math.ceil((population / 10) - currentProduction);
        //    console.log(`gap is: ${resourcesGap * multi} as currentproduction is:${currentProduction}`)
            if (resourcesGap > 0 && foodValue < (population /10 - currentProduction) * 60)
            {
                mainDataBlock[17].innerHTML = "<input type='button' id='farmbutton' value='Buy Farms'>" + `${foodStringValue} Units`;
                var mainbutton = document.getElementById('farmbutton');
                mainbutton.style ="color:red";
                mainbutton.className = 'darkbutton noleft';
                mainbutton.addEventListener("click", function(){buyFarms(resourcesGap * multi)}, false);
            }
        });
	}
}

function buyFarms(gap) {
	// First taking data from the page
	var temp = mainDataBlock[3].innerHTML;
    var wealth = temp.substring(temp.indexOf('Wealth</a>')+11, temp.indexOf('<span', temp.indexOf('Wealth</a>')+10)).trim();
	var wages = document.getElementById('wages').value;

	// Now lets see the %
    getFertSetting().then(function (farmFert) {
        console.log(gap + ' ' + wealth + ' ' + wages + ' ' + farmFert + ' ' + farmEffective);
        var toBuy = Math.ceil(gap / Math.sqrt(wages/wealth) / Math.sqrt(farmFert * farmConstant) / farmEffective);
        console.log(`tobuy:${toBuy}`);
        var baseParams = "build=1&type=1&subtype=11";
        baseParams = baseParams + "&buildid=" + farmId + "&colony=" + ColonyId + "&amount=" + toBuy;
        sendAjaxRequest("POST", "build_facility.php", true, false, baseParams);
        location.reload();
    });
}

function getFertSetting()
{
    return new Promise(function (fulfill) {
        var farmFert = GM_getValue("farm" + ColonyId);
        if (farmFert == undefined)
        {
            var planetLink = document.getElementById('midcolumn').getElementsByClassName('openextra pointer')[0].title.trim();
            var div = document.createElement('div');
            sendAjaxRequest("GET", planetLink, false, true, "").then(function(html) {
                div.innerHTML = html;
                var allPlanetValues = div.getElementsByClassName('left tbborder  light padding5 overauto box width50')
                farmFert = allPlanetValues[10].getElementsByTagName('div')[3].innerHTML.replace("%","");
                GM_setValue("farm" + ColonyId, farmFert);
                return fulfill(farmFert);
            });
        }
        else
            return fulfill(farmFert);
    });
}

/* End Farm Functions */

/* Storage Functions */

function addStorageButton() {
    var storageLeft = parseInt(document.getElementsByClassName('storagetop')[0].innerHTML.split(' ')[0]);
	var storageAll = parseInt(document.getElementsByClassName('storagebottom')[0].innerHTML.split(' ')[0]);
	var prec = Math.ceil(100 * (1 - storageLeft / storageAll));
	if (prec > storageLine)
	{
		 var holder = document.getElementsByClassName('darkbutton noleft')[2];
		 holder.innerHTML = "<font color='red'>" + holder.innerHTML + "</font>";
		 holder.onclick = "";
		 holder.addEventListener('click', function(){buyStorage(storageAll,storageLeft);}, false);
	}
}

function buyStorage(overall, left) {
	var x = storageBuy / 100;
	var buy = Math.round((x * overall- left) / (1-x));
	var baseParams = "colony=" + ColonyId + "&addstorage=" + buy;
	sendAjaxRequest('POST', "view_colony.php", true, false, baseParams);
	location.reload();
}

/* End Storage Functions */
