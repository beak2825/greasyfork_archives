// ==UserScript==
// @name         interpals profilevisitor
// @version      0.1
// @description  such is life
// @author       mountlus
// @include      https://interpals.net/app/*
// @include      http://interpals.net/*
// @grant        none
// @namespace https://greasyfork.org/users/451947
// @downloadURL https://update.greasyfork.org/scripts/397083/interpals%20profilevisitor.user.js
// @updateURL https://update.greasyfork.org/scripts/397083/interpals%20profilevisitor.meta.js
// ==/UserScript==


if (document.getElementsByClassName("cur_page")[0].innerHTML === "1 ") {
    //setOptions();
}


openLinks();

function startSearch() {
    document.sCForm.submit();
}

function setOptions() {
    //                        female, male, or both
    selectSettings('16','25','female', true, false);

    //doesn't add second option for some reason
    //var countries = ["RU","ES", "ET", "UA"];

    //any country
    var countries = ["---"];
    selectCountries(countries);

    var continents = ["Africa", "Asia", "Europe", "North America", "Australia/Oceania", "South America"];
    selectContinents("all");

    // doesnt work for multiple countries because of the getElementsByClassName("dynSelAdd clickable") isnt accurate enough. I.e there are dynSelAdd clickable classes
    // also in country selection, so it's difficult to distinguish which one to select. Certainly do-able though.
    //var languages = ["ET", "ES", "UA", "RU"];
    var languages = ["---"];
    //selectLanguages(languages);

    startSearch();
}

function selectSettings(minAge, maxAge, gender, photoOnly, online) {
	var minAgeDoc = document.getElementsByName('age1')[0];
	var maxAgeDoc = document.getElementsByName('age2')[0];
	minAgeDoc.value = minAge;
	maxAgeDoc.value = maxAge;
	if (gender === "female") {
	document.getElementById("sex_female").checked = true;
    document.getElementById("sex_male").checked = false;
    } else if (gender === "male") {
	document.getElementById("sex_male").checked = true;
    document.getElementById("sex_female").checked = false;
	} else if (gender === "both") {
	document.getElementById("sex_female").checked = true;
	document.getElementById("sex_male").checked = true;
	}
    if (photoOnly) {
   	document.getElementById("photo_field").checked = true;
    } else {
    document.getElementById("photo_field").checked = false;
    }
    if (online) {
    document.getElementById("online_field").checked = true;
    } else {
    document.getElementById("online_field").checked = false;
    }
}


function selectCountries(countries) {
    if (countries[0] === "---") {
        document.getElementsByName('countries[]')[0].value = countries[0];
        return
    }
    for (var i = 0; i<countries.length; i++) {
        document.getElementsByName('countries[]')[i].value = countries[i];
        document.getElementsByClassName("dynSelAdd clickable")[0].click();
    }
}


function selectContinents(continents) {
    if (continents === "all") {
        document.getElementById("Africa").checked = true;
        document.getElementById("Asia").checked = true;
        document.getElementById("Europe").checked = true;
        document.getElementById("North America").checked = true;
        document.getElementById("Australia/Oceania").checked = true;
        document.getElementById("South America").checked = true;
        return
    }
    for (var i = 0; i<continents.length; i++) {
        document.getElementById(continents[i]).checked = true;
    }
}


function selectLanguages(languages) {
    if (languages[0] === "---") {
        document.getElementsByName('languages[]')[0].value = languages[0];
        return
    }
    for (var i = 0; i<languages.length; i++) {
        document.getElementsByName('languages[]')[i].value = languages[i];
        document.getElementsByClassName("dynSelAdd clickable")[i+1].click();
    }
}


function openLinks() {
    var links=document.getElementsByClassName("sResThumb"), hrefs = [];
    for (var j = 0; j<20; j++)
    {
        hrefs.push(links[j].href);
    }
    var openedWindows= [];
    setTimeout(function(){
        for (var k = 0; k<hrefs.length; k++)
        {
            var windowOp = window.open(hrefs[k]).close();
            openedWindows.push(windowOp);
        }
    }, 400);
   clickNextPage();
}

function clickNextPage() {
    var pages = document.getElementsByClassName('pages')[0].getElementsByTagName('a');
    pages[2].click();
}
