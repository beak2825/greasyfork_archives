// ==UserScript==
// @name         automatedIndustry
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  try to take over the world!
// @author       gudigno
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398953/automatedIndustry.user.js
// @updateURL https://update.greasyfork.org/scripts/398953/automatedIndustry.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var maping = new Array(); // Map declaration
	/**Anwers has been added in the map */
	maping['310 Nutrition' ]= 14;
	maping['Amazon Studios' ]= 8;
	maping['Bleacher Report' ]= 8;
	maping['Bodyfit Design'] = 12;
	maping['bodyfit design'] = 14;
	maping['Chevrolet Argentina' ]= 5;
	maping['cineworld cinemas' ]= 8;
	maping['Clorox' ]= 4;
	maping['Diamond Whites ®' ]= 14;
	maping['Easy Fruits #EasyFruitsSG'] = 17;
	maping['e.l.f. Cosmetics'] = 14;
	maping['First Aid Beauty'] = 14;
	maping['Hairbesties Community'] = 14;
	maping['Idobi Radio' ]= 8;
	maping['innocent' ]= 13;
	maping['Jlab Audio' ]= 25;
	maping['Jordan' ]= 12;
	maping['Kendra Scott' ]= 12;
	maping['Kenia Ontiveros Beauty' ]= 14;
	maping['La Roche-Posay France' ]= 14;
	maping['Lavazza' ]= 13;
	maping['Lenovo España'] = 25;
	maping['Lutron Electronics' ]= 25;
	maping['M&S' ]= 9;
	maping['Made my Google' ]= 25;
	maping['Mayvenn Inc.'] = 14;
	maping['Mitsubishi Motors México']= 5;
	maping['NBC Sports'] = 8;
	maping['NATIVE INSTRUMENTS' ]= 25;
	maping['Next' ]= 12;
	maping['POPSUGAR' ]= 8;
	maping['Prada' ]= 12;
	maping['Psysique 57'] = 14;
	maping['Que Riko'] = 17;
	maping['Royal Dutch Shell'] = 23;
	maping['SEAT Deutschland'] = 5;
	maping['Sony PlayStation Italia' ]= 22;
	maping['Supermercados Guanabara'] = 9;
	maping['Tinder' ]= 25;
	maping['Toyota Argentina'] = 5;
	maping['The Met' ]= 2;
	maping['TV2' ]= 8;
	maping['Special K' ]= 17;
	maping["Historia"]= 8;
	maping['UCLA Health' ]= 14;
	maping['Volvo Car España' ]= 5;
	maping['Whole Foods Market' ]= 17;
	maping['Yamaha Motor Indonesia' ]= 5;
	maping['Zales' ]= 12;
	maping['Bad Boy Entertainment' ]= 3;
	maping['Sista key'] = 8;
	maping['questnutrition'] = 17;
	maping['level1' ]= 8;
	maping['American Express']=6;
	maping['NRK' ]= 8;
	maping['Bad voy entertaiment' ]= 3;
	maping['SKY Brasil']= 8;
	maping['Motown Records' ]= 3;
	maping['Fathom Events'] = 8;
	maping['Red Bull Brasil'] = 13;
	maping['shary berries' ] = 17;
	maping['7uparabia'] = 13;
	maping["Physique 57"] = 14;
	maping['Universal Pictures Switzerland'] = 8;
	maping['도곡동 바디핏디자인 발레핏 다이어트 필라테스 요가 줌바'] = 14;
	maping['100PLUS Malaysia'] = 13;
	maping['7up'] = 13;
	maping['100 Plus Malaysia'] = 13;
	maping['EA Sports Fifa' ]= 22;
	maping['La Roche=Posay France'] = 14;
	maping['Spotify'] = 25;
	maping['Sprint'] = 19;
	maping['TAFENSW'] = 15;
	maping['samsungchile'] = 25;
	maping['Fitness First Germany'] = 14;
	maping['Harley-Davidson Spain'] = 5;
	maping['UFC GYM'] = 14;
	maping['Volvo Car UK'] = 5;
    maping['macaousa travel'] = 2;
	maping['BAD BOY ENTERTAIMENT'] = 3;
    maping['Siesta Key'] = 8;
	maping['Level 1'] = 8;
	maping['Demak Up' ]= 14; 
	maping['Boss Models South Africa'] = 16;
	maping['Crystal boys'] = 8;
	maping['Yotanka'] = 3;
	maping['Beaudesert Race Club'] = 2
	maping['Mumtaz Mirza Auditorium'] = 16;
	maping['Pepsi Ukraine'] = 13;
	maping['Hormel Foods'] = 17;
	maping['Spotify Brasil'] = 25;
    maping['Buick'] = 5;
	maping['ROLEX'] = 12;
	maping['Made by Google' ]= 25;
	maping['Club América' ]= 21
	maping['Nike Sportswear'] = 12;
	maping["Shari's Berries"] = 17;
	maping['CSKA Moscow' ]= 21;
	maping['ABC World News Tonight'] = 8;
	maping["Palmer's" ]= 14;
    maping['FVF'] = 17;
	maping['Matrix'] = 14;
	maping['Lenovo Indonesia'] = 25;

	var taskNameRegex = 'In What Industry This Company'; // Portion of task name
	var taskName = document.getElementsByTagName('h1')[1].innerText; // task name

	//if(document.getElementsByTagName('h1')[1].innerText == "In What Industry This Company Work? [2020-01-27]")

	if(taskName.search(taskNameRegex) != -1) // If portion of task name match then return an index otherwise return -1
	{

		var a = document.getElementsByTagName('select');
		var size_a =  a.length - 1;

		for (var i = 0; i < size_a; i++)
		{
			/** Name of the item to search */
			var elementName = document.getElementsByClassName('well')[i+1].getElementsByTagName('a')[0].text;
			if (maping[elementName] != null )
			{
				//* Required validation passed and current element is selected */
				document.getElementsByTagName('select')[i].className = 'industry validates-required validates validates validation-passed';
				document.getElementsByTagName('select')[i].value = maping[elementName];

				/** Give a message in the item that has been done */
				var element = document.createElement("p");
				var content = document.createTextNode("I did this one for you ('-')");
				element.appendChild(content);
				element.setAttribute("align","center");
				element.style.fontWeight = 'bold';
				var father = document.getElementsByClassName("cml jsawesome")
								[i].getElementsByTagName("a")[1].parentNode;
				father.appendChild(element);
			}
		}
	}
    // Your code here...
})();