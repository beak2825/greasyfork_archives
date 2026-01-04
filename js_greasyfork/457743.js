// ==UserScript==
// @name         Torrent links to Episodecalendar
// @description  Adds torrent links next to every season and episode in calendar, unwatched and season overview sections on episodecalendar.com with various options (RARBG, Torrentz2, ThePirateBay, TorrentProject2, 1337X, Snahp)
// @namespace    NotNeo
// @author       NotNeo
// @license      unlicense
// @icon         https://i.imgur.com/hf3pTZJ.png
// @icon64       https://i.imgur.com/hf3pTZJ.png
// @match        https://episodecalendar.com/*
// @version      4.0.1
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/457743/Torrent%20links%20to%20Episodecalendar.user.js
// @updateURL https://update.greasyfork.org/scripts/457743/Torrent%20links%20to%20Episodecalendar.meta.js
// ==/UserScript==


//URLS
var url_TP = "https://torrentproject.cc";
var url_RARBG = "https://rarbg.to";
var url_TPB = "https://thepiratebay.org";
var url_Torz2 = "https://torrentz2.nz";
var url_1337X = "https://1337x.st";

//Load settings
var usingRARBG = GM_getValue("usingRARBG", true);
var usingTP = GM_getValue("usingTP", false);
var usingTPB = GM_getValue("usingTPB", false);
var usingTorz2 = GM_getValue("usingTorz2", false);
var using1337x = GM_getValue("using1337x", false);
var usingSnahp = GM_getValue("usingSnahp", false);
var orderBySeeds = GM_getValue("orderBySeeds", true);
var SearchRes = GM_getValue("SearchRes", "");
var url_Snahp = GM_getValue("url_Snahp", ""); //asked from the user and stored locally

//(if all settings are set to false, usingRARBG is set to true)
if(!usingTP && !usingRARBG && !usingTPB && !usingTorz2 && !using1337x && !usingSnahp) { usingRARBG = true; }

main();
setInterval(main, 200);



function main() {
    var vURL = window.location.href;

    //Settings section ------------------
    if ( vURL.indexOf("episodecalendar.com/users/edit") >= 0 )
    {
        //if the custom options aren't already there...
        if(!document.getElementById("newSetDiv")) {
            let settingsDiv = document.getElementById("settings");
            if(!settingsDiv || settingsDiv.length == 0)
                return

            let newSetTit = document.createElement("h2"); //Creating Settings title -----
            let newSetTitAt = document.createAttribute("class"); //Creating the attribute "class" for title
            newSetTitAt.value = "big margin_bottom"; //setting the attribute value
            newSetTit.setAttributeNode(newSetTitAt); //Giving the attribute to the settings title
            let newSetTitTe = document.createTextNode("Torrent Link Settings"); // Creating a text node for the settings title node
            newSetTit.appendChild(newSetTitTe); //Inserting title text node into the title node

            let newSetDiv = document.createElement("div"); //Creating Settings div -----
            let newSetDivAt = document.createAttribute("class"); //Creating the attribute "class" for div
            let newSetDivAt2 = document.createAttribute("id");
            newSetDivAt2.value = "newSetDiv";
            newSetDivAt.value = "epic-card -no-margin pad margin_bottom_big"; //setting the attribute value
            newSetDiv.setAttributeNode(newSetDivAt); //Giving the attribute to the settings div
            newSetDiv.setAttributeNode(newSetDivAt2);

            settingsDiv.insertBefore(newSetTit, settingsDiv.firstElementChild.nextElementSibling);
            settingsDiv.insertBefore(newSetDiv, settingsDiv.firstElementChild.nextElementSibling.nextElementSibling);
            let innerHTMLForNewSet = '<div class="checkbox-wrapper"><input name="RARBGCheck" type="hidden" value="0"><input type="checkbox" value="1" name="RARBGCheck2" id="RARBGCheckbox"> <label for="RARBGCheckbox">Use RARBG</label></div><br><br>' +
                '<div class="checkbox-wrapper"><input name="TPCheck" type="hidden" value="0"><input type="checkbox" value="1" name="TPCheck2" id="TPCheckbox"> <label for="TPCheckbox">Use TorrentProject2</label></div><br><br>' +
				'<div class="checkbox-wrapper"><input name="TPBCheck" type="hidden" value="0"><input type="checkbox" value="1" name="TPBCheck2" id="TPBCheckbox"> <label for="TPBCheckbox">Use The Pirate Bay</label></div><br><br>' +
				'<div class="checkbox-wrapper"><input name="Torz2Check" type="hidden" value="0"><input type="checkbox" value="1" name="Torz2Check2" id="Torz2Checkbox"> <label for="Torz2Checkbox">Use Torrentz2</label></div><br><br>' +
                '<div class="checkbox-wrapper"><input name="Check1337x" type="hidden" value="0"><input type="checkbox" value="1" name="Check21337x" id="Checkbox1337x"> <label for="Checkbox1337x">Use 1337x</label></div><br><br>' +
                '<div class="checkbox-wrapper"><input name="CheckSnahp" type="hidden" value="0"><input type="checkbox" value="1" name="Check2Snahp" id="CheckboxSnahp"> <label for="CheckboxSnahp">Use Snahp forums</label></div><br><br>' +
				'<select style="width: auto;" name="SearchResSel" id="SearchResSelect"><option value="">Any</option><option value="720p">720p</option><option value="1080p">1080p</option><option value="2160p">2160p</option></select><label for="SearchResSelect"> Searched resolution</label><br><br>' +
                '<div class="checkbox-wrapper"><input name="CheckOrderBySeeds" type="hidden" value="0"><input type="checkbox" value="1" name="Check2OrderBySeeds" id="CheckboxOrderBySeeds"> <label for="CheckboxOrderBySeeds">Order torrents by seeds</label></div>';
            document.getElementById("newSetDiv").innerHTML = innerHTMLForNewSet;
            document.getElementById("RARBGCheckbox").checked = usingRARBG; //setting checkbox values to the saved values or if none are saved, to the default values
            document.getElementById("TPCheckbox").checked = usingTP;
			document.getElementById("TPBCheckbox").checked = usingTPB;
			document.getElementById("Torz2Checkbox").checked = usingTorz2;
            document.getElementById("Checkbox1337x").checked = using1337x;
            document.getElementById("CheckboxOrderBySeeds").checked = orderBySeeds;
            document.getElementById("SearchResSelect").value = SearchRes;
            document.getElementById("CheckboxSnahp").checked = usingSnahp;

            document.getElementById("RARBGCheckbox").onchange = UpdateSettings;
            document.getElementById("TPCheckbox").onchange = UpdateSettings;
            document.getElementById("TPBCheckbox").onchange = UpdateSettings;
            document.getElementById("Torz2Checkbox").onchange = UpdateSettings;
            document.getElementById("Checkbox1337x").onchange = UpdateSettings;
            document.getElementById("CheckboxOrderBySeeds").onchange = UpdateSettings;
            document.getElementById("SearchResSelect").onchange = UpdateSettings;
            document.getElementById("CheckboxSnahp").onchange = UpdateSettings;
        }
    }
    //Calendar section ----------------
	else if ( vURL.indexOf("episodecalendar.com/en/calendar") >= 0 )
    {
        let selected = document.querySelectorAll("span.episode:not(.tlte_added):not([hidden])"); //get all untouched episode nodes
        for(let i = 0; i < selected.length; i++) { //Loop through the nodes and do the following to all targets
            let showName = selected[i].previousElementSibling.firstChild.textContent; //Getting showname
            if(!showName || showName.length == 0)
                return;

            showName = CleanSomeSymbols(showName);
            let epNumTemp = selected[i].textContent; //Getting the episode number
            epNumTemp = epNumTemp.substring(epNumTemp.length - 7, epNumTemp.length -1);
            epNumTemp = epNumTemp.split("(")[1];
            let epNumTemp1 = epNumTemp.split("x")[0]; //changing the episode number format to: s01e01
            if (epNumTemp1.length < 2) { epNumTemp1 = "0" + epNumTemp1; } //adding prefix 0 if needed
            let epNumTemp2 = epNumTemp.split("x")[1]; //changing the episode number format to: s01e01
            if (epNumTemp2.length < 2) { epNumTemp2 = "0" + epNumTemp2; } //adding prefix 0 if needed
            let epNum = "S" + epNumTemp1 + "E" + epNumTemp2; //changing the episode number format to: s01e01
            //append torrent button
			if(usingTP) {
                selected[i].innerHTML += " <span> <a class='dllink2' href='" + url_TP + "/?t=" + showName + "+" + epNum + "+" + SearchRes + (orderBySeeds ? "&orderby=seeders" : "") + "'> <img alt='TorrentProject DL Link' src='https://i.imgur.com/bOql47X.png'> </a> </span>";
            }
			if(usingRARBG) {
                selected[i].innerHTML += " <span> <a class='dllink' href='" + url_RARBG + "/torrents.php?search=" + showName + "+" + epNum + "+" + SearchRes + (orderBySeeds ? "&order=seeders&by=DESC" : "") + "'> <img alt='RARBG DL Link' src='" + url_RARBG + "/favicon.ico'> </a> </span>";
            }
			if(usingTPB) {
                selected[i].innerHTML += " <span> <a class='dllink3' href='" + url_TPB + "/search/" + showName + " " + epNum + " " + SearchRes + "/0/99/0" + "'> <img alt='TPB DL Link' src='" + url_TPB + "/favicon.ico' width='16' height='16'> </a> </span>";
            }
			if(usingTorz2) {
                selected[i].innerHTML += " <span> <a class='dllink4' href='" + url_Torz2 + "/search?f=" + showName + "+" + epNum + "+" + SearchRes + "'> <img alt='Torrentz2 DL Link' src='" + url_Torz2 + "/torrentz.ico' width='14' height='14'> </a> </span>";
            }
            if(using1337x) {
                selected[i].innerHTML += " <span> <a class='dllink5' href='" + url_1337X + "/" + (orderBySeeds ? "sort-" : "") + "search/" + showName + "+" + epNum + "+" + SearchRes + (orderBySeeds ? "/seeders/desc" : "") + "/1/'> <img alt='1337x DL Link' src='" + url_1337X + "/favicon.ico' width='14' height='14'> </a> </span>";
            }
            if(usingSnahp) {
                selected[i].innerHTML += " <span> <a class='dllink6' href='" + url_Snahp + "/search.php?keywords=" + showName + "+" + epNum + "+" + SearchRes + "'&sf=titleonly> <img alt='Snahp DL Link' src='https://i.imgur.com/116lSLX.png' width='14' height='14'> </a> </span>";
            }
            selected[i].classList.add("tlte_added");
        }
    }
    //Unwatched section --------------
	else if ( vURL.indexOf("episodecalendar.com/en/unwatched") >= 0 )
    {
        let showName;
        let season = document.querySelectorAll("div.options:not(.tlte_added):not([hidden])"); //get all untouched season nodes(the node before the season node) (working with target -> nextNode )
        for(let i = 0; i < season.length; i++) { //Loop through the nodes and do the following to all targets
            console.log("unwatched - newly found season");
            let nameAndSeason = season[i].nextElementSibling.firstChild; //getting show name and season
            if(!nameAndSeason)
                return
            nameAndSeason = nameAndSeason.innerHTML;
            if(!nameAndSeason || nameAndSeason.length == 0)
                return;

            showName = CleanSomeSymbols(nameAndSeason.split(" - ")[0]); //splitting off show name
            let seasonT = nameAndSeason.split(" - ")[1]; //splitting off season
            let shortformSeason = seasonT.split(" ")[1];
            if (shortformSeason.length < 2) {
                shortformSeason = "S0" + shortformSeason;
            } else {
                shortformSeason = "S" + shortformSeason;
            }
            //append torrent button for full season
            if(usingTP) {
                season[i].nextElementSibling.innerHTML = " <span> <a class='dllink2' href='" + url_TP + "/?t=" + showName + "+" + seasonT + "+" + SearchRes + (orderBySeeds ? "&orderby=seeders" : "") + "'> <img alt='TorrentProject DL Link' src='https://i.imgur.com/bOql47X.png'> </a> </span>" + season[i].nextElementSibling.innerHTML;
            }
            if(usingRARBG) {
                season[i].nextElementSibling.innerHTML = " <span> <a class='dllink' href='" + url_RARBG + "/torrents.php?search=" + showName + "+" + shortformSeason + "+" + SearchRes + (orderBySeeds ? "&order=seeders&by=DESC" : "") + "'> <img alt='RARBG DL Link' src='" + url_RARBG + "/favicon.ico'> </a> </span>" + season[i].nextElementSibling.innerHTML;
            }
            if(usingTPB) {
                season[i].nextElementSibling.innerHTML = " <span> <a class='dllink3' href='" + url_TPB + "/search/" + showName + " " + seasonT + " " + SearchRes + "/0/99/0" + "'> <img alt='TPB DL Link' src='" + url_TPB + "/favicon.ico' width='16' height='16'> </a> </span>" + season[i].nextElementSibling.innerHTML;
            }
            if(usingTorz2) {
                season[i].nextElementSibling.innerHTML = " <span> <a class='dllink4' href='" + url_Torz2 + "/search?f=" + showName + "+" + seasonT + "+" + SearchRes + "'> <img alt='Torrentz2 DL Link' src='" + url_Torz2 + "/torrentz.ico' width='14' height='14'> </a> </span>" + season[i].nextElementSibling.innerHTML;
            }
            if(using1337x) {
                season[i].nextElementSibling.innerHTML = " <span> <a class='dllink5' href='" + url_1337X + "/" + (orderBySeeds ? "sort-" : "") + "search/" + showName + "+" + seasonT + "+" + SearchRes + (orderBySeeds ? "/seeders/desc" : "") + "/1/'> <img alt='1337x DL Link' src='" + url_1337X + "/favicon.ico' width='14' height='14'> </a> </span>" + season[i].nextElementSibling.innerHTML;
            }
            if(usingSnahp) {
                season[i].nextElementSibling.innerHTML = " <span> <a class='dllink6' href='" + url_Snahp + "/search.php?keywords=" + showName + "+" + seasonT + "+" + SearchRes + "&sf=titleonly'> <img alt='Snahp DL Link' src='https://i.imgur.com/116lSLX.png' width='14' height='14'> </a> </span>" + season[i].nextElementSibling.innerHTML;
            }
            season[i].classList.add("tlte_added");
        }

        let selected = document.querySelectorAll("div.epic-list-episode:not(.tlte_added):not([hidden])"); //get all untouched episode nodes
        for(let i = 0; i < selected.length; i++) { //Loop through the nodes and do the following to all targets
            let epNumTemp = selected[i].textContent; //Getting episode number. For some reason going any deeper nets no results????
            if(!epNumTemp || epNumTemp.length == 0)
                return;

            let epNumTemp1 = epNumTemp.split("x")[0]; //Cleaning up episode number string
            let epNumTemp2 = epNumTemp.split("x")[1]; //Cleaning up episode number string
            epNumTemp1 = epNumTemp1.replace(/[^0-9.]/g, ""); //Cleaning up episode number string
            if (epNumTemp1.length < 2) { epNumTemp1 = "0" + epNumTemp1; } //adding prefix 0 if needed
            epNumTemp2 = epNumTemp2.substring(0, 2); //Cleaning up episode number string
            epNumTemp2 = epNumTemp2.replace(/[^0-9.]/g, ""); //Cleaning up episode number string
            if (epNumTemp2.length < 2) { epNumTemp2 = "0" + epNumTemp2; } //adding prefix 0 if needed
            let epNum = "S" + epNumTemp1 + "E" + epNumTemp2; //changing the episode number format to: s01e01
            //append torrent button (again, can't traverse any deeper!?)
            if(usingTP) {
                selected[i].innerHTML = " <span> <a class='dllink2' href='" + url_TP + "/?t=" + showName + "+" + epNum + "+" + SearchRes + (orderBySeeds ? "&orderby=seeders" : "") + "'> <img alt='TorrentProject DL Link' src='https://i.imgur.com/bOql47X.png'> </a> </span>" + selected[i].innerHTML;
            }
			if(usingRARBG) {
                selected[i].innerHTML = " <span> <a class='dllink' href='" + url_RARBG + "/torrents.php?search=" + showName + "+" + epNum + "+" + SearchRes + (orderBySeeds ? "&order=seeders&by=DESC" : "") + "'> <img alt='RARBG DL Link' src='" + url_RARBG + "/favicon.ico'> </a> </span>" + selected[i].innerHTML;
            }
			if(usingTPB) {
                selected[i].innerHTML = " <span> <a class='dllink3' href='" + url_TPB + "/search/" + showName + " " + epNum + " " + SearchRes + "/0/99/0" + "'> <img alt='TPB DL Link' src='" + url_TPB + "/favicon.ico' width='16' height='16'> </a> </span>" + selected[i].innerHTML;
            }
			if(usingTorz2) {
                selected[i].innerHTML = " <span> <a class='dllink4' href='" + url_Torz2 + "/search?f=" + showName + "+" + epNum + "+" + SearchRes + "'> <img alt='Torrentz2 DL Link' src='" + url_Torz2 + "/torrentz.ico' width='14' height='14'> </a> </span>" + selected[i].innerHTML;
            }
            if(using1337x) {
                selected[i].innerHTML = " <span> <a class='dllink5' href='" + url_1337X + "/" + (orderBySeeds ? "sort-" : "") + "search/" + showName + "+" + epNum + "+" + SearchRes + (orderBySeeds ? "/seeders/desc" : "") + "/1/'> <img alt='1337x DL Link' src='" + url_1337X + "/favicon.ico' width='14' height='14'> </a> </span>" + selected[i].innerHTML;
            }
            if(usingSnahp) {
                selected[i].innerHTML = " <span> <a class='dllink6' href='" + url_Snahp + "/search.php?keywords=" + showName + "+" + epNum + "+" + SearchRes + "'&sf=titleonly> <img alt='Snahp DL Link' src='https://i.imgur.com/116lSLX.png' width='14' height='14'> </a> </span>" + selected[i].innerHTML;
            }
            selected[i].classList.add("tlte_added");
        }
    }
    //Show section -----------------------
	else if ( vURL.indexOf("episodecalendar.com/en/show/") >= 0 )
    {
        //page has showname
        if(document.querySelectorAll(".show_banner > h1").length > 0)
        {
            let showName = CleanSomeSymbols(document.querySelectorAll(".show_banner > h1")[0].textContent); //Getting the show name
            showName = showName.replace("'", "%27");

            let season = document.querySelectorAll("span.h2:not(.tlte_added):not([hidden])"); //getting the untouched season nodes
            for (let i = 0; i < season.length; i++) { //Loop through the nodes and do the following to all targets
                let seasonT = season[i]; //get the season
                if(!seasonT)
                    return;
                seasonT = seasonT.innerHTML;
                if(seasonT.length == 0)
                    return;

                let shortformSeason = seasonT.split(" ")[1];
                if (shortformSeason.length < 2) {
                    shortformSeason = "S0" + shortformSeason;
                } else {
                    shortformSeason = "S" + shortformSeason;
                }
                //append torrent button for full season
                if(usingTP) {
                    season[i].insertAdjacentHTML("beforebegin", " <span> <a class='dllink2' href='" + url_TP + "/?t=" + showName + "+" + seasonT + "+" + SearchRes + (orderBySeeds ? "&orderby=seeders" : "") + "'> <img alt='TorrentProject DL Link' src='https://i.imgur.com/bOql47X.png'> </a> </span>");
                }
                if(usingRARBG) {
                    season[i].insertAdjacentHTML("beforebegin", " <span> <a class='dllink' href='" + url_RARBG + "/torrents.php?search=" + showName + "+" + shortformSeason + "+" + SearchRes + (orderBySeeds ? "&order=seeders&by=DESC" : "") + "'> <img alt='RARBG DL Link' src='" + url_RARBG + "/favicon.ico'> </a> </span>");
                }
                if(usingTPB) {
                    season[i].insertAdjacentHTML("beforebegin", " <span> <a class='dllink3' href='" + url_TPB + "/search/" + showName + " " + seasonT + " " + SearchRes + "/0/99/0" + "'> <img alt='TPB DL Link' src='" + url_TPB + "/favicon.ico' width='16' height='16'> </a> </span>");
                }
                if(usingTorz2) {
                    season[i].insertAdjacentHTML("beforebegin", " <span> <a class='dllink4' href='" + url_Torz2 + "/search?f=" + showName + "+" + seasonT + "+" + SearchRes + "'> <img alt='Torrentz2 DL Link' src='" + url_Torz2 + "/torrentz.ico' width='14' height='14'> </a> </span>");
                }
                if(using1337x) {
                    season[i].insertAdjacentHTML("beforebegin", " <span> <a class='dllink5' href='" + url_1337X + "/" + (orderBySeeds ? "sort-" : "") + "search/" + showName + "+" + seasonT + "+" + SearchRes + (orderBySeeds ? "/seeders/desc" : "") + "/1/'> <img alt='1337x DL Link' src='" + url_1337X + "/favicon.ico' width='14' height='14'> </a> </span>");
                }
                if(usingSnahp) {
                    season[i].insertAdjacentHTML("beforebegin", " <span> <a class='dllink6' href='" + url_Snahp + "/search.php?keywords=" + showName + "+" + seasonT + "+" + SearchRes + "&sf=titleonly'> <img alt='Snahp DL Link' src='https://i.imgur.com/116lSLX.png' width='14' height='14'> </a> </span>");
                }
                season[i].classList.add("tlte_added");
            }

            let selected = document.querySelectorAll("div.epic-list-episode:not(.tlte_added):not([hidden])"); //get all untouched episode nodes
            for(let i = 0; i < selected.length; i++) { //Loop through the nodes and do the following to all targets
                let epNumTemp = selected[i].textContent;
                if(epNumTemp.length == 0)
                    return;

                let epNumTemp1 = epNumTemp.split("x")[0]; //Cleaning up episode number string
                let epNumTemp2 = epNumTemp.split("x")[1]; //Cleaning up episode number string
                epNumTemp1 = epNumTemp1.replace(/[^0-9.]/g, ""); //Cleaning up episode number string
                if (epNumTemp1.length < 2) { epNumTemp1 = "0" + epNumTemp1; } //adding prefix 0 if needed
                epNumTemp2 = epNumTemp2.substring(0, 2); //Cleaning up episode number string
                epNumTemp2 = epNumTemp2.replace(/[^0-9.]/g, ""); //Cleaning up episode number string
                if (epNumTemp2.length < 2) { epNumTemp2 = "0" + epNumTemp2; } //adding prefix 0 if needed
                let epNum = "S" + epNumTemp1 + "E" + epNumTemp2; //changing the episode number format to: s01e01
                //append torrent button (again, can't traverse any deeper!?)
                if(usingTP) {
                    selected[i].innerHTML = " <span> <a class='dllink2' href='" + url_TP + "/?t=" + showName + "+" + epNum + "+" + SearchRes + (orderBySeeds ? "&orderby=seeders" : "") + "'> <img alt='TorrentProject DL Link' src='https://i.imgur.com/bOql47X.png'> </a> </span>" + selected[i].innerHTML;
                }
                if(usingRARBG) {
                    selected[i].innerHTML = " <span> <a class='dllink' href='" + url_RARBG + "/torrents.php?search=" + showName + "+" + epNum + "+" + SearchRes + (orderBySeeds ? "&order=seeders&by=DESC" : "") + "'> <img alt='RARBG DL Link' src='" + url_RARBG + "/favicon.ico'> </a> </span>" + selected[i].innerHTML;
                }
                if(usingTPB) {
                    selected[i].innerHTML = " <span> <a class='dllink3' href='" + url_TPB + "/search/" + showName + " " + epNum + " " + SearchRes + "/0/99/0" + "'> <img alt='TPB DL Link' src='" + url_TPB + "/favicon.ico' width='16' height='16'> </a> </span>" + selected[i].innerHTML;
                }
                if(usingTorz2) {
                    selected[i].innerHTML = " <span> <a class='dllink4' href='" + url_Torz2 + "/search?f=" + showName + "+" + epNum + "+" + SearchRes + "'> <img alt='Torrentz2 DL Link' src='" + url_Torz2 + "/torrentz.ico' width='14' height='14'> </a> </span>" + selected[i].innerHTML;
                }
                if(using1337x) {
                    selected[i].innerHTML = " <span> <a class='dllink5' href='" + url_1337X + "/" + (orderBySeeds ? "sort-" : "") + "search/" + showName + "+" + epNum + "+" + SearchRes + (orderBySeeds ? "/seeders/desc" : "") + "/1/'> <img alt='1337x DL Link' src='" + url_1337X + "/favicon.ico' width='14' height='14'> </a> </span>" + selected[i].innerHTML;
                }
                if(usingSnahp) {
                    selected[i].innerHTML = " <span> <a class='dllink6' href='" + url_Snahp + "/search.php?keywords=" + showName + "+" + epNum + "+" + SearchRes + "'&sf=titleonly> <img alt='Snahp DL Link' src='https://i.imgur.com/116lSLX.png' width='14' height='14'> </a> </span>" + selected[i].innerHTML;
                }
                selected[i].classList.add("tlte_added");
            }
        }
    }
}

function UpdateSettings() {
    usingRARBG = document.getElementById("RARBGCheckbox").checked; //saving the changes to runtime variable
    usingTP = document.getElementById("TPCheckbox").checked;
    usingTPB = document.getElementById("TPBCheckbox").checked;
    usingTorz2 = document.getElementById("Torz2Checkbox").checked;
    using1337x = document.getElementById("Checkbox1337x").checked;
    orderBySeeds = document.getElementById("CheckboxOrderBySeeds").checked;
    SearchRes = document.getElementById("SearchResSelect").value;
    usingSnahp = document.getElementById("CheckboxSnahp").checked;
    if(usingSnahp && !url_Snahp.length) {
        url_Snahp = prompt("It appears you enabled Snahp links. As per the rules of the forums, the url should not be shared publically, so you will have to povide it yourself. You will only need to give the url once. It is then stored locally.\nGive url in this format: [https://*.*.*] (without brackets)", "");
        GM_setValue("url_Snahp", url_Snahp);
    }
    GM_setValue("usingRARBG", usingRARBG); //storing the new values to local storage
    GM_setValue("usingTP", usingTP);
    GM_setValue("usingTPB", usingTPB);
    GM_setValue("usingTorz2", usingTorz2);
    GM_setValue("using1337x", using1337x);
    GM_setValue("orderBySeeds", orderBySeeds);
    GM_setValue("SearchRes", SearchRes);
    GM_setValue("usingSnahp", usingSnahp);
}

function CleanSomeSymbols(string)
{
    string = string.replace(/&/g, "and");
    string = string.replace("'", "%27");
    return string;
}

