// ==UserScript==
// @name           Blueprint Mod
// @description    A mod for blueprints
// @include        http://*.war-facts.com/blueprints.php*
// @exclude        http://*.war-facts.com
// @exclude        http://*.war-facts.com/index.php
// @exclude        http://*.war-facts.com/index2.php
// @version        0.0.1
// @grant          GM_xmlhttpRequest 
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_log
// @namespace https://greasyfork.org/users/14655
// @downloadURL https://update.greasyfork.org/scripts/12015/Blueprint%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/12015/Blueprint%20Mod.meta.js
// ==/UserScript==

var tst = document.getElementsByClassName('blueprint');
if (tst.length == 0)
    return;
var label = document.getElementsByClassName('blueprintswrap')[0].getElementsByClassName('centertext')[0].firstChild.nextSibling;
var processing = "";
for (var j = 0; j < tst.length; j++) {
    doProcessing(label, tst[j]);
}

function doProcessing(label, blueprint) {
    var subtext = blueprint.getElementsByClassName('blueprintleft')[0].getElementsByClassName('subtext')[0];
    var texts = subtext.getElementsByTagName('span');
    var divs = subtext.getElementsByTagName('div');
    var blueprintDetails = blueprint.getElementsByClassName('blueprintleft')[0].getElementsByClassName('subtext')[0];
    
	// Look for NR
	var ores = blueprint.getElementsByClassName('blueprintright')[0].getElementsByTagName('li');
	var orec = 0;
	
	for (var i = 1; i < ores.length; i++)
	{
		orec += parseInt(blueprint.getElementsByClassName('blueprintright')[0].getElementsByTagName('li')[1].getElementsByTagName('span')[1].innerHTML);
	}
    if (orec === 0) {
        for (var i = 0; i < ores.length; i++) {
            ores[i].style.backgroundColor = '#717100';
        }
    }
    
	switch (label.textContent) {

		case "Empire Administration":
            var workers = parseInt(texts[1].innerHTML);
            var effectiveness = parseInt(texts[3].innerHTML);
            blueprintDetails.appendChild(bpDiv("Corruption:", Math.ceil(workers * effectiveness * 0.05 * 100) / 100 + '%'));
            blueprintDetails.appendChild(bpDiv("Upkeep:", numberWithCommas(workers * effectiveness * 1000) + ' cr'));
            blueprintDetails.appendChild(bpDiv("Cost / % Corruption:", workers * effectiveness * 0.05 + ' cr'));
			break;

		case "Mall":
            var workers = parseInt(texts[1].innerHTML);
            var effectiveness = parseInt(texts[3].innerHTML);
			blueprintDetails.appendChild(bpDiv("People Served:", Math.ceil(workers * effectiveness * 40 / 100)));
			addCosts(blueprint, workers * effectiveness / 100, "Cost / Eff Worker");
			break;
            
		case "Entertainment Facility":
		case "Hospital":
		case "Police Station":
		case "School":
		case "Copper Mine":
		case "Diamond Mine":
		case "Drilling Rig":
		case "Farm":
		case "Gold Mine":
		case "Iron Mine":
		case "Platinum Mine":
		case "Silver Mine":
		case "Titanium Mine":
		case "Uranium Mine":
		case "Well":
            var workers = parseInt(texts[1].innerHTML);
            var effectiveness = parseInt(texts[3].innerHTML);            
			addCosts(blueprint, workers * effectiveness / 100, "Cost / Eff Worker");
			break;
        case "Research Facility":
            var workers = parseInt(texts[1].innerHTML);          
			addCosts(blueprint, workers, "Cost / Worker");
			break;
		case "Terraformer":
            var workers = parseInt(texts[1].innerHTML);
            var effectiveness = parseInt(texts[3].innerHTML);			
            addCosts(node, workers * effic / 100, "Cost / Eff Worker");
			break;

		case "Battleship Hull":
		case "Bomber Hull":
		case "Corvette Hull":
		case "Destroyer Hull":
		case "Troop Transport":
            var lcap = parseInt(texts[17].innerHTML);
            var cannons = parseInt(texts[3].innerHTML);
            var engines = parseInt(texts[19].innerHTML);
            var mass = parseInt(texts[21].innerHTML.replace(/,/g,""));
			addCosts(blueprint, cannons, "Cost / Cannon");
            blueprintDetails.appendChild(bpDiv("Layout / Cannon", Math.ceil(lcap / cannons*100)/100));
            blueprintDetails.appendChild(bpDiv("Mass / Engine", Math.ceil(mass / engines * 100) / 100));
            blueprintDetails.appendChild(bpDiv("Layout / Engine", Math.ceil(lcap / engines * 100) / 100));
            
            divs[0].style.height = '0px';
            divs[3].style.height = '0px';
            divs[4].style.height = '0px';
            divs[5].style.height = '0px';
            
            divs[0].style.visibility = 'hidden';
            divs[3].style.visibility = 'hidden';
            divs[4].style.visibility = 'hidden';
            divs[5].style.visibility = 'hidden';
			break;
		case "Carrier Hull":
            var fighter = parseInt(texts[7].innerHTML);
			addCosts(blueprint, fighter, "Cost / Fighter");
			var engines = parseInt(texts[19].innerHTML);
            var mass = parseInt(texts[21].innerHTML.innerHTML.replace(/,/g,""));
            var layout = parseInt(texts[17].innerHTML);
            blueprintDetails.appendChild(bpDiv("Mass / Engine", Math.ceil(mass / engines * 100) / 100));
            blueprintDetails.appendChild(bpDiv("Layout / Engine", Math.ceil(layout / engines * 100) / 100));
            
            divs[0].style.height = '0px';
            divs[1].style.height = '0px';
            divs[4].style.height = '0px';
            divs[5].style.height = '0px';
            
            divs[0].style.visibility = 'hidden';
            divs[1].style.visibility = 'hidden';
            divs[4].style.visibility = 'hidden';
            divs[5].style.visibility = 'hidden';
            
			break;
		case "Colony Ship Hull":
		case "Genesis Hull":
			var colonist = parseInt(texts[11].innerHTML.replace(/,/g,""));
			addCosts(blueprint, colonist, "Cost / Colonist");
			var engines = parseInt(texts[19].innerHTML);
            var mass = parseInt(texts[21].innerHTML);
			var layout = parseInt(texts[17].innerHTML);
			blueprintDetails.appendChild(bpDiv("Mass / Engine", Math.ceil(mass / engines * 100) / 100));
            blueprintDetails.appendChild(bpDiv("Layout / Engine", Math.ceil(layout / engines * 100) / 100));
            
            divs[0].style.height = '0px';
            divs[1].style.height = '0px';
            divs[2].style.height = '0px';
            
            divs[0].style.visibility = 'hidden';
            divs[1].style.visibility = 'hidden';
            divs[2].style.visibility = 'hidden';
			break;
		case "Command Frigate Hull":
		case "High Stability Sphere Hull":
			var layout = parseInt(texts[17].innerHTML.replace(/,/g,""));
			addCosts(blueprint, layout/1000, "Cost / 1k Layout");
			var engines = parseInt(texts[19].innerHTML);
            var mass = parseInt(texts[21].innerHTML);
			blueprintDetails.appendChild(bpDiv("Mass / Engine", Math.ceil(mass / engines * 100) / 100));
            blueprintDetails.appendChild(bpDiv("Layout / Engine", Math.ceil(layout / engines * 100) / 100));
			break;
		case "Crimson Gunboat":
			var cannons = parseInt(texts[3].innerHTML);
			addCosts(blueprint, cannons, "Cost / Cannon");
			var layout = parseInt(texts[17].innerHTML.replace(/,/g,""));
			blueprintDetails.appendChild(bpDiv("Layout / Cannon", Math.ceil(layout / cannons*100)/100));
			var guns = parseInt(texts[1].innerHTML);
			addCosts(blueprint, guns, "Cost / Gun");
			addANode(node, "Layout / Gun", Math.ceil(layout / guns * 100)/100);
			var engines = parseInt(texts[19].innerHTML);
            var mass = parseInt(texts[21].innerHTML);;
			blueprintDetails.appendChild(bpDiv("Mass / Engine", Math.ceil(mass / engines * 100) / 100));
            blueprintDetails.appendChild(bpDiv("Layout / Engine", Math.ceil(layout / engines * 100) / 100));
			break;
		case "Crimson Cruiser":
		case "Fighter Hull":
			var guns = parseInt(texts[1].innerHTML);
			addCosts(blueprint, guns, "Cost / Gun");
			var layout = parseInt(texts[17].innerHTML.replace(/,/g,""));
            blueprintDetails.appendChild(bpDiv("Layout / Gun", Math.ceil(layout / guns * 100)/100));
			var engines = parseInt(texts[19].innerHTML);
            var mass = parseInt(texts[21].innerHTML.innerHTML.replace(/,/g,""));
			blueprintDetails.appendChild(bpDiv("Mass / Engine", Math.ceil(mass / engines * 100) / 100));
            blueprintDetails.appendChild(bpDiv("Layout / Engine", Math.ceil(layout / engines * 100) / 100));
            
            divs[1].style.height = '0px';
            divs[2].style.height = '0px';
            divs[3].style.height = '0px';
            divs[4].style.height = '0px';
            divs[5].style.height = '0px';
            divs[6].style.height = '0px';
            
            divs[1].style.visibility = 'hidden';
            divs[2].style.visibility = 'hidden';
            divs[3].style.visibility = 'hidden';
            divs[4].style.visibility = 'hidden';
            divs[5].style.visibility = 'hidden';
            divs[6].style.visibility = 'hidden';
			break;
		case "Space Station Hull":
			var layout = parseInt(texts[17].innerHTML.replace(/,/g,""));
			addCosts(blueprint, layout/1000, "Cost / 1k Layout");
			var transp = parseInt(texts[9].innerHTML.replace(/,/g,""));
			addCosts(blueprint, transp/1000, "Cost / 1k Transport");
            
            divs[0].style.height = '0px';
            divs[1].style.height = '0px';
            divs[5].style.height = '0px';
            
            divs[0].style.visibility = 'hidden';
            divs[1].style.visibility = 'hidden';
            divs[5].style.visibility = 'hidden';
			break;
		case "Transport Hull":
            var transp = parseInt(texts[9].innerHTML.replace(/,/g,""));
			addCosts(blueprint, transp/1000, "Cost / 1k Transport");
			var engines = parseInt(texts[19].innerHTML);
            var mass = parseInt(texts[21].innerHTML.replace(/,/g,""));
			var layout = parseInt(texts[17].innerHTML.replace(/,/g,""));
			blueprintDetails.appendChild(bpDiv("Mass / Engine", Math.ceil(mass / engines * 100) / 100));
            blueprintDetails.appendChild(bpDiv("Layout / Engine", Math.ceil(layout / engines * 100) / 100));
            
            divs[0].style.height = '0px';
            divs[1].style.height = '0px';
            divs[3].style.height = '0px';
            divs[5].style.height = '0px';
            divs[6].style.height = '0px';
            
            divs[0].style.visibility = 'hidden';
            divs[1].style.visibility = 'hidden';
            divs[3].style.visibility = 'hidden';
            divs[5].style.visibility = 'hidden';
            divs[6].style.visibility = 'hidden';
			break;
		case "Cannon":
		case "Gun Battery":
		case "Single Barrel Gun":
			var damage = parseFloat(texts[1].innerHTML.replace(/,/g,""), 10);
			var rate = texts[3].innerHTML.replace(/,/g,"");
			var rate1 = parseInt(rate, 10);
			var rate2 = parseInt(rate.substr(rate.indexOf('.')+1), 10);
			rate = rate1 + rate2 / 100;
			var mass = parseInt(texts[5].innerHTML.replace(/,/g,""));
            blueprintDetails.appendChild(bpDiv("Dmg / 1000kg", Math.ceil(damage * rate / mass * 100*1000) / 100));
			addCosts(blueprint, Math.ceil(damage * rate / mass * 100*1000) / 100, "Cost / Dmg");
			break;

		case "Anti Matter Drive":
		case "Capital Ship Drive":
		case "Small Vessel Drive":
			var power = parseFloat(texts[1].innerHTML.replace(/,/g,""));
			var eff   = parseFloat(texts[3].innerHTML.replace(/,/g,""));
			var mass = parseInt(texts[5].innerHTML);
            blueprintDetails.appendChild(bpDiv("Power / Mass", (power / mass).toPrecision(3)));
            blueprintDetails.appendChild(bpDiv("Eff / Mass", (eff / mass).toPrecision(3)));
			break;

		case "Armor Plating":
			var armor = parseInt(texts[1].innerHTML.replace(/,/g,""), 10);
			var stab   = parseInt(texts[5].innerHTML.replace(/,/g,""), 10);
			var mass = parseInt(texts[7].innerHTML);
            blueprintDetails.appendChild(bpDiv("Armor / Mass", Math.ceil(armor * stab * 1000 / 100 / mass )));
			addCosts(blueprint, armor * stab / 100, "Cost / Armor");
            
            divs[1].style.height = '0px';
            divs[1].style.visibility = 'hidden';           
			break;
		case "Energy Shield":
			var shield = parseInt(texts[3].innerHTML.replace(/,/g,""), 10);
			var stab   = parseInt(texts[5].innerHTML.replace(/,/g,""), 10);
			var mass = parseInt(texts[7].innerHTML);
            blueprintDetails.appendChild(bpDiv("Shield / Mass", Math.ceil(shield * stab * 1000 / 100 / mass )));
			addCosts(blueprint, shield * stab / 100, "Cost / Shield");
            
            divs[0].style.height = '0px';
            divs[0].style.visibility = 'hidden';  
			break;

		case "AA Battery":
		case "Guided Missile Launcher":
			var damage = parseInt(texts[1].innerHTML.replace(/,/g,""), 10);
			var rate = texts[3].innerHTML.replace(/,/g,"");
			var rate1 = parseInt(rate, 10);
			var rate2 = parseInt(rate.substr(rate.indexOf('.')+1), 10);
			rate = rate1 + rate2 / 100;
            blueprintDetails.appendChild(bpDiv("Damage", Math.ceil(damage * rate * 100) / 100));
			addCosts(blueprint, Math.ceil(damage * rate * 100) / 100, "Cost / Dmg");
			break;
	}
}

function addCosts(blueprint, workers, tag) {
    var cost = blueprint.getElementsByClassName('blueprintright')[0].getElementsByTagName('li')[0].childNodes[1].textContent;
	cost = parseInt(cost.replace(/,/g,""),10);
	cost = Math.ceil(cost / workers) + "";
	var ncost = "";
	if (cost.indexOf(".") != -1)
	{
		ncost = cost.substr(cost.indexOf("."));
		cost = cost.substr(0, cost.indexOf(".") - 1);
	}
	while (cost.length > 0)
	{
		ncost = cost.length < 3 ? cost + ncost : cost.substr(cost.length-3) + ncost;
		cost = cost.substr(0, cost.length-3);
		if (cost.length > 0) ncost = "," + ncost;
	}
    
    var bpDetails = blueprint.getElementsByClassName('blueprintleft')[0].getElementsByClassName('subtext')[0];
    bpDetails.appendChild(bpDiv(tag, ncost + " cr"));
}

function bpDiv(tag, val) {
    var bpDiv = document.createElement('div');
    var tagSpan = document.createElement('span');
    tagSpan.textContent = tag;
    var costSpan = document.createElement('span');
    costSpan.textContent = val;    
    bpDiv.appendChild(tagSpan);
    bpDiv.appendChild(costSpan);
    return bpDiv;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}