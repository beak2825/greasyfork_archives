// ==UserScript==
// @name		   Reddit comment faces helper
// @description	Allows you to easily add comment faces from those subreddits: r/awwnime, r/pantsu, r/Moescape, r/TwoDeeArt, r/Patchuu, r/visualnovels, r/kemonomimi, r/manga, r/anime, r/SuperSonico, r/KanMusu, r/KanMusuNights, r/SchoolIdolFestival, r/LoveLive, r/OneTrueIdol, r/fatestaynight, r/saber, r/Nisekoi, r/OneTrueBiribiri, r/gamindustri, r/Esdeath, r/OneTrueTohsaka, r/kancolle,  r/leagueoflegends and r/Chibi
// @namespace	  https://greasyfork.org/users/98-jonnyrobbie
// @author		 JonnyRobbie
// @include		http*://*.reddit.com/r/awwnime/*
// @include		http*://*.reddit.com/r/pantsu/*
// @include		http*://*.reddit.com/r/Moescape/*
// @include		http*://*.reddit.com/r/TwoDeeArt/*
// @include		http*://*.reddit.com/r/Patchuu/*
// @include		http*://*.reddit.com/r/anime/*
// @include		http*://*.reddit.com/r/visualnovels/*
// @include		http*://*.reddit.com/r/kemonomimi/*
// @include		http*://*.reddit.com/r/manga/*
// @include		http*://*.reddit.com/r/SuperSonico/*
// @include		http*://*.reddit.com/r/KanMusu/*
// @include		http*://*.reddit.com/r/KanMusuNights/*
// @include		http*://*.reddit.com/r/SchoolIdolFestival/*
// @include		http*://*.reddit.com/r/LoveLive/*
// @include		http*://*.reddit.com/r/OneTrueIdol/*
// @include		http*://*.reddit.com/r/fatestaynight/*
// @include		http*://*.reddit.com/r/saber/*
// @include		http*://*.reddit.com/r/Nisekoi/*
// @include		http*://*.reddit.com/r/OneTrueBiribiri/*
// @include		http*://*.reddit.com/r/gamindustri/*
// @include		http*://*.reddit.com/r/Esdeath/*
// @include		http*://*.reddit.com/r/OneTrueTohsaka/*
// @include		http*://*.reddit.com/r/kancolle/*
// @include		http*://*.reddit.com/r/leagueoflegends/*
// @include		http*://*.reddit.com/r/karanokyoukai/*
// @include		http*://*.reddit.com/r/Chibi/*
// @grant		  none
// @version		1.27.1
// @downloadURL https://update.greasyfork.org/scripts/1256/Reddit%20comment%20faces%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/1256/Reddit%20comment%20faces%20helper.meta.js
// ==/UserScript==
		
var selectedFace = "";
var faceIdChar = "";
var thumbDialWidth = "150px";
var thumbDialHeight = "100px";
var divAlreadyShown = false;
var settingsAlreadyShown = false;
var showSearch = false;
var bbCodeFunction = null;
var textBoxNr = 1;
var selectedText = {
	start: 0, lenghth: 0, boxIndex: 0
};

var storageSettings = {
	top: Math.round((window.innerHeight-500)/2),
	left: Math.round((window.innerWidth-842)/2),
	width: 842,
	height: 500,
	bg: "white",
	text: "#31363B",
	high: "#F9401A",
	colA: "#EFF0F1",
	colB: "gray"
};
var loadingIcon = "data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAFACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";
var settingsIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIxSURBVHjapFO5iiJRFL3l1iIq7hi4NIgKIjSCiqCgDYbm/oCYGhqq/2Bi2KGZgaHgDAqtKEhj5pooiLuRuE+dh8oMMx3Ng1t16t5zXt165xZXKBTom5XlI3PHufvzX0twvV4pGo0Sf8/yUQW+P2e+wVVw75i4fD7/fJvP56PhcEgajYbUajVptVq63W60Xq9ps9mwu81mo1ar9exKdLlc8BD2er2k0+lIqVQy4mKxYBgLGBtarVaSSCTk8Xio3W6H2Sdgg1gs9t7v92m/35NAIGBku91OYrGYBTByqIEDLjTQis7nM3uLQqGg+XxOer2eXl5eqNFoUL1eZ7VQKESBQIAOhwPrBlwsaAX8JVssFm9IoigUCtEe4kc6neYQwMih9tgAGmixQSYej5PRaCSz2UwikYi63S6lUqn3h1XAyKEGDrjQQCs6nU40mUz+8PbR4r9y4MMRBLAwGAxyg8EgghOfTqdkMBhILpfT5+dnxOFwfEBULperbrf7VSqVsu5weLVaDXOQY2eQSCS45XLJhLvdjtnlcrkilUrlhgBGDjVwwIUG2qcLOByTycQcmM1mzDZMGxbaRU4mk7ENYOPDBaHf76dms1l1Op2vGKbRaMTIvV6Pjscjs/br64tZiNb5T6HtdkulUinCT+nHYxJ/8jZFgMfjMXu7SqWi32dktVoRf1as/U6nwzTPSQyHw1n+noPfb29vnMVigffsZ0EAI4caOODeNcQlk8n/+p1/CTAASVxppUgA6l4AAAAASUVORK5CYII=";
var searchIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAsJJREFUeNqMk8tPE1EUxu+dmU6n04dDKVAaQBowBYq0RDAQGkOC0QRjoujCx14TV8Z/gLB0Z8CNunGJJhJdGd8pkKALSdVoIIISiOE1JWPbofO6cz2jYKR1wUm+nJm53/nlnjvnYkopcmJkZEKCdB10BpRAf+ID6DHo1vDwkIL+E9gBQHHSMQYqA1VH+9rUrvZwFYMxmv2yJk+9+uhRc6rsgAGSKQWwGHdIAEm39bZJxwcS3vqw3yu6GcyxGAUl0ROLH+Tymo3ktexQOj13v7+/VfsXwJimdsMX8oWi0TqfQahtWNQqGralgXSTmvButiebAi6BCzne0h0wur59vqalUdFMuq2bdhYK5YJG5FyRyADaBMCGSehGJNa47nhLARwhRmsR+3Nyzlx0u7DOscTEmGVZBiGLUKKZtqVqNkuFQMTxlgEMYxvxbqysyHqGYVDeK3gE6F90sZiFdcMmNLe6ZWxvbqmd4G0qAxQKyiKmP4nbJa0GRK4AB4i8AsvzHGZMixKT2Hq15EKzk59Nx1t2Boqy/vrTi5d1VUHGV1vB03AF7zkgsrUenmkOiGykRuLFoMd2Z5fnjjneMkAmM3V7ZX4+J8tfLzCsVQmFHvheD3L6rbd0vWJ8Yuxa12lZTFx+23f1Lk7uGSSnjXi8+2IslrgZaYr6U6dOLCSboiyPsHdy5v369Jt0ezH4UGg8rLnODp5DT54/UNezq6k7V2jm7yRijH2hULgnmUxd8vulXvgHLc4iIWQun1dmvjOPBlq7aUNHp4AGTzagp8+W1c2s9huCd+8CQDhIdaAQyLezwwJIrj2CUmI1utccR0JHN0Y9KRa9myaqotAUt9sLgCxISzvae2EwlmsSSFhAaEw3qADDhiKHRG/R0KY5tI8AeAEg487zCkAMzRZ+rGrIz9Nv+wKUQmDERtUcWfJxaPSXAAMAqY5Ou20jwNAAAAAASUVORK5CYII=";
//elements section

function initializeSettings() {
	if (!settingsAlreadyShown) buildSettingsDiv();
	textSett["awwSettingsHeight"].value = parseInt(awwFacedDialogObj.style.height, 10);
	textSett["awwSettingsWidth"].value = parseInt(awwFacedDialogObj.style.width, 10);
	textSett["awwSettingsTop"].value = parseInt(awwFacedDialogObj.style.top, 10);
	textSett["awwSettingsLeft"].value = parseInt(awwFacedDialogObj.style.left, 10);
	
	textSett["awwSettingsLeft"].style.color = "#31363B";
	textSett["awwSettingsTop"].style.color = "#31363B";
	textSett["awwSettingsHeight"].style.color = "#31363B";
	textSett["awwSettingsWidth"].style.color = "#31363B";
	
	textSett["awwSettingsBGCol"].value = storageSettings.bg;
	textSett["awwSettingsTextCol"].value = storageSettings.text;
	textSett["awwSettingsHighCol"].value = storageSettings.high;
	textSett["awwSettingsACol"].value = storageSettings.colA;
	textSett["awwSettingsBCol"].value = storageSettings.colB;
	window.settingsWrapper.style.display = "inline";
}

function addSettRow(description, elemName) {
	rowSett = document.createElement("tr");
	spanSettWr = document.createElement("td");
		spanSettWr.style.width = "170px";
	textSettWr = document.createElement("td");
		textSettWr.style.padding = "5px";
	spanSett = document.createElement("span");
		spanSett.innerHTML = description;
		textSett[elemName] = new Object();
		textSett[elemName] = document.createElement("input");
		textSett[elemName].type = "text";
		textSett[elemName].id = elemName;
		textSett[elemName].style.border = "1px solid lightgray";
		textSett[elemName].style.height = "20px";
		textSett[elemName].style.width = "100%";
		textSett[elemName].oninput = function(){settingTextChange(this);};
	spanSettWr.appendChild(spanSett);
	textSettWr.appendChild(textSett[elemName]);
	rowSett.appendChild(spanSettWr);
	rowSett.appendChild(textSettWr);
	return rowSett;
}

function isNormalInteger(str) {
	var n = ~~Number(str);
	return String(n) === str && n >= 0;
 }

function settingTextChange(txtBox){
	var throwErr = false;
	if (isNormalInteger(textSett["awwSettingsTop"].value) == false) {
		textSett["awwSettingsTop"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (parseInt(textSett["awwSettingsTop"].value, 10) <= 0) {
		textSett["awwSettingsTop"].style.color = "storageSettings.text";
		throwErr = true;
	}
	else {
		textSett["awwSettingsTop"].style.color = "#31363B";
		textSett["awwSettingsTop"].value = parseInt(textSett["awwSettingsTop"].value, 10)
	}
	//check left
	if (isNormalInteger(textSett["awwSettingsLeft"].value, 10) == false) {
		textSett["awwSettingsLeft"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (parseInt(textSett["awwSettingsLeft"].value, 10) <= 0) {
		textSett["awwSettingsLeft"].style.color = "#FF0000";
		throwErr = true;
	}
	else {
		textSett["awwSettingsLeft"].style.color = "#31363B";
	}
	//check Width
	if (isNormalInteger(textSett["awwSettingsWidth"].value, 10) == false) {
		textSett["awwSettingsWidth"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (parseInt(textSett["awwSettingsWidth"].value, 10) <= 0) {
		textSett["awwSettingsWidth"].style.color = "#FF0000";
		throwErr = true;
	}
	else {
		textSett["awwSettingsWidth"].style.color = "#31363B";
	}
	//check　height
	if (isNormalInteger(textSett["awwSettingsHeight"].value, 10) == false) {
		textSett["awwSettingsHeight"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (parseInt(textSett["awwSettingsHeight"].value, 10) <= 0) {
		textSett["awwSettingsHeight"].style.color = "#FF0000";
		throwErr = true;
	}
	else {
		textSett["awwSettingsHeight"].style.color = "#31363B";
	}
	
	if (parseInt(textSett["awwSettingsHeight"].value, 10) + parseInt(textSett["awwSettingsTop"].value, 10) > window.innerHeight) {
		textSett["awwSettingsHeight"].style.color = "#FF0000";
		textSett["awwSettingsTop"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (throwErr == false) {
		textSett["awwSettingsHeight"].style.color = "#31363B";
		textSett["awwSettingsTop"].style.color = "#31363B";
	}
	if (parseInt(textSett["awwSettingsWidth"].value, 10) + parseInt(textSett["awwSettingsLeft"].value, 10) > window.innerWidth) {
		textSett["awwSettingsWidth"].style.color = "#FF0000";
		textSett["awwSettingsLeft"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (throwErr == false) {
		textSett["awwSettingsWidth"].style.color = "#31363B";
		textSett["awwSettingsLeft"].style.color = "#31363B";
	}
	
	if (throwErr == false) {
		storageSettings.bg = textSett["awwSettingsBGCol"].value;
		storageSettings.text = textSett["awwSettingsTextCol"].value;
		storageSettings.high = textSett["awwSettingsHighCol"].value;
		storageSettings.colA = textSett["awwSettingsACol"].value;
		storageSettings.colB = textSett["awwSettingsBCol"].value;
		changeSize(parseInt(textSett["awwSettingsTop"].value, 10), parseInt(textSett["awwSettingsLeft"].value, 10), parseInt(textSett["awwSettingsWidth"].value, 10), parseInt(textSett["awwSettingsHeight"].value, 10));
	}
}

function buildSettingsDiv() {
		//settings window
		window.settingsWrapper = document.createElement("div");
			settingsWrapper.id = "settingsWrapper";
			settingsWrapper.style.display = "none";
			settingsWrapper.style.position = "fixed"
			settingsWrapper.style.zIndex = "201";
			settingsWrapper.style.width = "250px";
			settingsWrapper.style.height = "auto";
			settingsWrapper.style.backgroundColor = "#FFFFFF";
			settingsWrapper.style.boxShadow = "0px 0px 20px 2px #000000";
			settingsWrapper.style.top = window.innerHeight/2 - 173 + "px";
			settingsWrapper.style.left = window.innerWidth/2 - 125 + "px";
			settingsWrapper.style.padding = "10px";
		//generating table
		var settingsTable = document.createElement("table");
			settingsTable.id = "settingsTable";
			settingsTable.style.width = "100%";
		window.textSett = {};
		settingsTable.appendChild(addSettRow("Dialog width (px): ", "awwSettingsWidth"));
		settingsTable.appendChild(addSettRow("Dialog height (px): ", "awwSettingsHeight"));
		settingsTable.appendChild(addSettRow("Position form left (px): ", "awwSettingsLeft"));
		settingsTable.appendChild(addSettRow("Position from top (px): ", "awwSettingsTop"));
		settingsTable.appendChild(addSettRow("Background color: ", "awwSettingsBGCol"));
		settingsTable.appendChild(addSettRow("Text color: ", "awwSettingsTextCol"));
		settingsTable.appendChild(addSettRow("Highlight color: ", "awwSettingsHighCol"));
		settingsTable.appendChild(addSettRow("Button color: ", "awwSettingsACol"));
		settingsTable.appendChild(addSettRow("Border color: ", "awwSettingsBCol"));
		var settingsButtonWrapper = document.createElement("div");
		
		var settingsCancel = document.createElement("input");
			settingsCancel.type = "button";
			settingsCancel.value = "Cancel";
			settingsCancel.style.margin = "5px";
			settingsCancel.style.width = "70px";
			settingsCancel.style.height = "28px";
			settingsCancel.style.border = "1px solid gray";
			settingsCancel.style.cssFloat = "right";
			settingsCancel.onclick = function(){settingsWrapper.style.display = "none";}
		settingsButtonWrapper.appendChild(settingsCancel);
		
		var settingsOK = document.createElement("input");
			settingsOK.type = "button";
			settingsOK.value = "OK";
			settingsOK.style.margin = "5px";
			settingsOK.style.width = "70px";
			settingsOK.style.height = "28px";
			settingsOK.style.border = "1px solid gray";
			settingsOK.style.cssFloat = "right";
			settingsOK.onclick = function(){okchangeSize();}
		settingsButtonWrapper.appendChild(settingsOK);
		
		settingsWrapper.appendChild(settingsTable);
		settingsWrapper.appendChild(settingsButtonWrapper);
		settingsAlreadyShown = true;
		document.body.appendChild(settingsWrapper);
}

function okchangeSize() {
	var errorMsg = "Error:\n";
	var throwErr = false;
	//check top
	if (isNormalInteger(textSett["awwSettingsTop"].value, 10) == false) {
		errorMsg = errorMsg + "Value in 'Top' is not a number.\n";
		textSett["awwSettingsTop"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (parseInt(textSett["awwSettingsTop"].value, 10) <= 0) {
		errorMsg = errorMsg + "Value in 'Top' has to be greater than 0.\n";
		textSett["awwSettingsTop"].style.color = "#FF0000";
		throwErr = true;
	}
	else {
		textSett["awwSettingsTop"].style.color = "#31363B";
	}
	//check left
	if (isNormalInteger(textSett["awwSettingsLeft"].value, 10) == false) {
		errorMsg = errorMsg + "Value in 'Left' is not a number.\n";
		textSett["awwSettingsLeft"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (parseInt(textSett["awwSettingsLeft"].value, 10) <= 0) {
		errorMsg = errorMsg + "Value in 'Left' has to be greater than 0.\n";
		textSett["awwSettingsLeft"].style.color = "#FF0000";
		throwErr = true;
	}
	else {
		textSett["awwSettingsLeft"].style.color = "#31363B";
	}
	//check Width
	if (isNormalInteger(textSett["awwSettingsWidth"].value, 10) == false) {
		errorMsg = errorMsg + "Value in 'Width' is not a number.\n";
		textSett["awwSettingsWidth"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (parseInt(textSett["awwSettingsWidth"].value, 10) <= 0) {
		errorMsg = errorMsg + "Value in 'Width' has to be greater than 0.\n";
		textSett["awwSettingsWidth"].style.color = "#FF0000";
		throwErr = true;
	}
	else {
		textSett["awwSettingsWidth"].style.color = "#31363B";
	}
	//check　height
	if (isNormalInteger(textSett["awwSettingsHeight"].value, 10) == false) {
		errorMsg = errorMsg + "Value in 'Height' is not a number.\n";
		textSett["awwSettingsHeight"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (parseInt(textSett["awwSettingsHeight"].value, 10) <= 0) {
		errorMsg = errorMsg + "Value in 'Height' has to be greater than 0.\n";
		textSett["awwSettingsHeight"].style.color = "#FF0000";
		throwErr = true;
	}
	else {
		textSett["awwSettingsHeight"].style.color = "#31363B";
	}
	if (parseInt(textSett["awwSettingsHeight"].value, 10) + parseInt(textSett["awwSettingsTop"].value, 10) > window.innerHeight) {
		errorMsg = errorMsg + "Dialog cannot be out of borders.\n";
		textSett["awwSettingsHeight"].style.color = "#FF0000";
		textSett["awwSettingsTop"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (throwErr == false) {
		textSett["awwSettingsHeight"].style.color = "#31363B";
		textSett["awwSettingsTop"].style.color = "#31363B";
	}
	if (parseInt(textSett["awwSettingsWidth"].value, 10) + parseInt(textSett["awwSettingsLeft"].value, 10) > window.innerWidth) {
		errorMsg = errorMsg + "Dialog cannot be out of borders.\n";
		textSett["awwSettingsWidth"].style.color = "#FF0000";
		textSett["awwSettingsLeft"].style.color = "#FF0000";
		throwErr = true;
	}
	else if (throwErr == false) {
		textSett["awwSettingsWidth"].style.color = "#31363B";
		textSett["awwSettingsLeft"].style.color = "#31363B";
	}
	if (throwErr == false) {
		changeSize(parseInt(textSett["awwSettingsTop"].value, 10), parseInt(textSett["awwSettingsLeft"].value, 10), parseInt(textSett["awwSettingsWidth"].value, 10), parseInt(textSett["awwSettingsHeight"].value, 10), textSett["awwSettingsBGCol"].value, textSett["awwSettingsTextCol"].value, textSett["awwSettingsHighCol"].value, textSett["awwSettingsACol"].value, textSett["awwSettingsBCol"].value);
		//SET
		setStorage("width", parseInt(textSett["awwSettingsWidth"].value, 10));
		setStorage("height", parseInt(textSett["awwSettingsHeight"].value, 10));
		setStorage("top", parseInt(textSett["awwSettingsTop"].value, 10));
		setStorage("left", parseInt(textSett["awwSettingsLeft"].value, 10));
		
		setStorage("bg", textSett["awwSettingsBGCol"].value);
		setStorage("text", textSett["awwSettingsTextCol"].value);
		setStorage("high", textSett["awwSettingsHighCol"].value);
		setStorage("colA", textSett["awwSettingsACol"].value);
		setStorage("colB", textSett["awwSettingsBCol"].value);
		settingsWrapper.style.display = "none";
	}
	else {
		alert(errorMsg);
	}
	
}

function changeSize(top, left, width, height){
	console.log("changing size...");
	if (width < 350) width = 350;
	if (height < 100) height = 100;
	width = Math.floor((parseInt(width, 10) - (20+getScrollBarWidth()))/(parseInt(thumbDialWidth, 10)+10))*(parseInt(thumbDialWidth, 10)+10)+40;
	awwFacedDialogObj.style.top = top + "px";
	awwFacedDialogObj.style.left = left + "px";
	awwFacedDialogObj.style.width = width + "px";
	awwFacedDialogObj.style.height = height + "px";
	tableWrap.style.height = (height - (82+(showSearch*22))) + "px";
	searchWrap.style.display = showSearch ? "block" : "none";
	if (textBoxNr == 1) {
		titleFace.style.width = (width - 323) + "px";
	} else if (textBoxNr == 3) {
		titleFace.style.width = ((width - 318)/3)-12 + "px";
		upperCaption.style.width = ((width - 318)/3)-12 + "px";
		lowerCaption.style.width = ((width - 318)/3)-12 + "px";
		upperCaption.style.display = "inline";
		lowerCaption.style.display = "inline";
	}
	awwFacedDialogObj.style.backgroundColor = storageSettings.bg;
	titleFace.style.backgroundColor = storageSettings.bg;
	upperCaption.style.backgroundColor = storageSettings.bg;
	lowerCaption.style.backgroundColor = storageSettings.bg;
	searchBox.style.backgroundColor = storageSettings.bg;
	
	titleFace.style.color = storageSettings.text;
	upperCaption.style.color = storageSettings.text;
	lowerCaption.style.color = storageSettings.text;
	searchBox.style.color = storageSettings.text;
	addFaceB.style.color = storageSettings.text;
	cancel.style.color = storageSettings.text;
	
	addFaceB.style.backgroundColor = storageSettings.colA;
	cancel.style.backgroundColor = storageSettings.colA;
	
	titleFace.style.borderColor = storageSettings.colB;
	upperCaption.style.borderColor = storageSettings.colB;
	lowerCaption.style.borderColor = storageSettings.colB;
	searchBox.style.borderColor = storageSettings.colB;
	addFaceB.style.borderColor = storageSettings.colB;
	cancel.style.borderColor = storageSettings.colB;
	wikiLink.style.color = storageSettings.colB;
	
	//textSett.style.backgroundColor = storageSettings.bg;
}

function getScrollBarWidth() {
	//http://www.alexandre-gomes.com/?p=115
  var inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  var outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild (inner);

  document.body.appendChild (outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild (outer);

  return (w1 - w2);
}

function createFacesDiv() {
	console.log("AWWFACES");
	var objTo = document.body;
	window.awwFacedDialogObj = document.createElement("div");
	window.tableWrap = document.createElement("div");
	var controls = document.createElement("div");
	controls.style.margin = "10px";
	controls.style.cssFloat = "left";
	window.searchWrap = document.createElement("div");
	searchWrap.style.margin = "0px 10px";
	searchWrap.style.cssFloat = "right";
	tableWrap.id = "awwFacesTableWrapper";
	tableWrap.className = "md";
	tableWrap.style.overflowY = "scroll";
	tableWrap.style.margin = "10px";
	tableWrap.style.padding = "10px 0px";
	tableWrap.style.maxWidth = "500em";
	awwFacedDialogObj.appendChild(tableWrap);
	
	window.searchBox = document.createElement("input");
	searchBox.type = "text";
	searchBox.id = "searchBoxId";
	searchBox.style.margin = "0px";
	searchBox.placeholder = "Search face...";
	searchBox.style.height = "20px";
	searchBox.style.width = "200px";
	searchBox.style.paddingLeft = "3px";
	searchBox.style.border = "1px solid lightgray";
	searchBox.style.cssFloat = "right";
	searchBox.oninput = function(){searchFilter(this);};
	searchWrap.appendChild(searchBox);
	awwFacedDialogObj.appendChild(searchWrap);
	
	window.titleFace = document.createElement("input");
	titleFace.type = "text";
	titleFace.id = "awwFaceId";
	titleFace.style.margin = "0px 5px 0px 0px";
	titleFace.placeholder = "Mouse-over text";
	titleFace.style.height = "20px";
	titleFace.style.paddingLeft = "3px";
	titleFace.style.border = "1px solid lightgray";
	titleFace.style.cssFloat = "left";
	controls.appendChild(titleFace);
	
	window.upperCaption = document.createElement("input");
	upperCaption.type = "text";
	upperCaption.id = "upperCaption";
	upperCaption.style.margin = "0px 5px 0px 5px";
	upperCaption.placeholder = "Top caption";
	upperCaption.style.height = "20px";
	upperCaption.style.paddingLeft = "3px";
	upperCaption.style.border = "1px solid lightgray";
	upperCaption.style.cssFloat = "left";
	upperCaption.style.display = "none";
	controls.appendChild(upperCaption);
	
	window.lowerCaption = document.createElement("input");
	lowerCaption.type = "text";
	lowerCaption.id = "lowerCaption";
	lowerCaption.style.margin = "0px 5px 0px 5px";
	lowerCaption.placeholder = "Bottom caption";
	lowerCaption.style.height = "20px";
	lowerCaption.style.paddingLeft = "3px";
	lowerCaption.style.border = "1px solid lightgray";
	lowerCaption.style.cssFloat = "left";
	lowerCaption.style.display = "none";
	controls.appendChild(lowerCaption);
	
	window.addFaceB = document.createElement("input");
	addFaceB.type = "button";
	addFaceB.value = "Add face"
	addFaceB.style.margin = "-3px 5px";
	addFaceB.style.border = "1px solid gray";
	addFaceB.style.height = "28px";
	addFaceB.style.cssFloat = "left";
	addFaceB.style.width = "80px";
	addFaceB.onclick = function(){addFace();return false;};
	addFaceB.style.padding = "2px";
	controls.appendChild(addFaceB);
	
	window.cancel = document.createElement("input");
	cancel.type = "button";
	cancel.value = "Cancel"
	cancel.style.margin = "-3px 5px";
	cancel.style.border = "1px solid gray";
	cancel.style.height = "28px";
	cancel.style.cssFloat = "left";
	cancel.style.width = "80px";
	cancel.onclick = function(){hideSelect()};
	cancel.style.padding = "2px";
	controls.appendChild(cancel);
	
	window.wikiLink = document.createElement("a");
	wikiLink.href = "http://www.reddit.com/r/awwnime/wiki/commentfaces";
	wikiLink.innerHTML = "Faces wiki";
	wikiLink.style.margin = "5px 5px";
	wikiLink.style.height = "12px";
	wikiLink.style.width = "55px";
	wikiLink.style.cssFloat = "left";
	controls.appendChild(wikiLink);
	
	var search = document.createElement("img");
	search.src = searchIcon;
	search.alt = "search";
	search.style.margin = "3px 5px";
	search.style.cssFloat = "left";
	search.style.cursor = "pointer";
	//search.style.position = "absolute";
	search.title = "Search faces...";
	search.onclick = function(){toggleSearch();}
	controls.appendChild(search);
	
	var settings = document.createElement("img");
	settings.src = settingsIcon;
	settings.alt = "settings";
	settings.style.margin = "3px 0px 3px 5px";
	settings.style.cssFloat = "left";
	settings.style.cursor = "pointer";
	//settings.style.position = "absolute";
	settings.title = "Settings...";
	settings.onclick = function(){initializeSettings();}
	controls.appendChild(settings);
	buildSettingsDiv();
	
	awwFacedDialogObj.appendChild(controls)
	objTo.appendChild(awwFacedDialogObj);
	awwFacedDialogObj.id = "awwFacesDialog";
	awwFacedDialogObj.style.position = "fixed";
	awwFacedDialogObj.style.top = "200px";
	awwFacedDialogObj.style.width = "835px";
	awwFacedDialogObj.style.backgroundColor = "#FFFFFF";
	awwFacedDialogObj.style.display = "none"; //diaply none
	awwFacedDialogObj.style.boxShadow = "0px 0px 20px 2px #000000";
	awwFacedDialogObj.style.zIndex = "200";
	appendFaces();
	console.log("scrollbar width: " + getScrollBarWidth());
	divAlreadyShown = true;
}

function toggleSearch() {
	showSearch = !showSearch;
	searchBox.value = "";
	searchFilter(searchBox);
	//GET
	changeSize(getStorage("top"), getStorage("left"), getStorage("width"), getStorage("height"));
}

function searchFilter(box) {
	searchThumbs = tableWrap.getElementsByTagName("div");
	for (i=0; i<searchThumbs.length; i++) {
		console.log(box.value);
		if (searchThumbs[i].getElementsByTagName("a")[0].id.toLowerCase().search(box.value.toLowerCase()) == -1) {
			searchThumbs[i].style.display = "none";
		} else {
			searchThumbs[i].style.display = "block";
		}
	}
}

function addFace() {
	var faceCode = "";
	var inputEvent = new Event('input');
	var title = document.getElementById("awwFaceId").value;
	var upperCapt = document.getElementById("upperCaption").value;
	var lowerCapt = document.getElementById("lowerCaption").value;
	if (selectedFace == "") {
		alert("You have not selected any face.");
		return;
	}
	document.getElementById("awwFaceId").value = "";
	document.getElementById("upperCaption").value = "";
	document.getElementById("lowerCaption").value = "";
	console.log("title reset");
	 //[](#name_of_face "Your text")
	var bbCode = ""
	var startText = document.getElementsByTagName("textarea")[selectedText.boxIndex].value;

	bbCode = bbCodeFunction(selectedFace, title, upperCapt, lowerCapt);
	console.log(bbCode);
	var endText = startText.substr(0, selectedText.start) + bbCode + startText.substring(selectedText.start + selectedText.length, startText.length);
	console.log(endText);
	document.getElementsByTagName("textarea")[selectedText.boxIndex].value = endText;
	awwFacedDialogObj.style.display = "none";
	document.getElementsByTagName("textarea")[selectedText.boxIndex].dispatchEvent(inputEvent);
}

function appendFaceThumb(name, new_width, new_height) {
	var col = document.createElement("div");
	var divtest = document.createElement("a");
	divtest.innerHTML = "";
	divtest.title = "[](" + faceIdChar + name + ")";
	divtest.href = faceIdChar + name;
	divtest.id = name;
	divtest.style.margin = "auto";
	divtest.style.display = "block";
	divtest.style.position = "absolute";
	divtest.style.top = "0px";
	divtest.style.left = "0px";
	divtest.style.right = "0px";
	divtest.style.bottom = "0px";
	if (new_width != "" && new_height != "") {
		divtest.style.setProperty("background-size", new_width + "px " + new_height + "px", "important");
		divtest.style.setProperty("height", new_height + "px", "important");
		divtest.style.setProperty("width", new_width + "px", "important");
	}
	divtest.onclick=function(){faceClick(divtest.id);return false;};
	divtest.ondblclick=function(){faceClick(divtest.id);addFace();return false;};
	var gifLoad = document.createElement("img");
	gifLoad.src = loadingIcon;
	gifLoad.style.position = "absolute";
	gifLoad.style.top = (Math.round((parseInt(thumbDialHeight.substr(0, thumbDialHeight.length-2), 10)/2)-8)) +"px";
	gifLoad.style.left = (Math.round((parseInt(thumbDialWidth.substr(0, thumbDialWidth.length-2), 10)/2)-8)) +"px";
	gifLoad.style.zIndex = "-1";
	col.appendChild(divtest);
	col.appendChild(gifLoad);
	col.style.width = thumbDialWidth;
	col.style.height = thumbDialHeight;
	col.style.position = "relative";
	col.style.margin = "5px";
	col.style.cssFloat = "left";
	return col;
}

function faceClick(faceId) {
	var allFaces = awwFacedDialogObj.getElementsByTagName("a");
	for (var i = 0; i < allFaces.length; i++) {
		allFaces[i].style.boxShadow = "";
	}
	document.getElementById(faceId).style.boxShadow = "0px 0px 20px 10px " + storageSettings.high;
	selectedFace = faceId;
	//alert(faceId);
}

function appendFaces() {
	var objTo = tableWrap;
	var regex = /https?:\/\/((www\.)?|(pay\.)?|(.{2}\.)?)reddit\.com\/r\/(\w+)\/.*/;
	var subreddit = document.URL.replace(regex, "$5").toLowerCase();
	if (subreddit == "awwnime") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/awwnime/wiki/commentfaces";
		thumbDialWidth = "165px";
		thumbDialHeight = "115px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("grr"));
		objTo.appendChild(appendFaceThumb("o-o"));
		objTo.appendChild(appendFaceThumb("trollin"));
		objTo.appendChild(appendFaceThumb("oniichan"));
		objTo.appendChild(appendFaceThumb("waa"));
		objTo.appendChild(appendFaceThumb("thumbsup"));
		objTo.appendChild(appendFaceThumb("butwhat"));
		objTo.appendChild(appendFaceThumb("disapproval"));
		objTo.appendChild(appendFaceThumb("catsmile"));
		objTo.appendChild(appendFaceThumb("waow"));
		objTo.appendChild(appendFaceThumb("darksad"));
		objTo.appendChild(appendFaceThumb("hnng"));
		objTo.appendChild(appendFaceThumb("nosebleed"));
		objTo.appendChild(appendFaceThumb("awyeah"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("somad"));
		objTo.appendChild(appendFaceThumb("hana"));
		objTo.appendChild(appendFaceThumb("tears"));
		objTo.appendChild(appendFaceThumb("megane"));
		objTo.appendChild(appendFaceThumb("cry"));
		objTo.appendChild(appendFaceThumb("squee"));
		objTo.appendChild(appendFaceThumb("sparkle"));
		objTo.appendChild(appendFaceThumb("yes"));
		objTo.appendChild(appendFaceThumb("therethere"));
		objTo.appendChild(appendFaceThumb("concentrate"));
		objTo.appendChild(appendFaceThumb("WAHAHAHA"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("pleased"));
		objTo.appendChild(appendFaceThumb("shock"));
		objTo.appendChild(appendFaceThumb("facepalm"));
		objTo.appendChild(appendFaceThumb("itai"));
		objTo.appendChild(appendFaceThumb("airen"));
		objTo.appendChild(appendFaceThumb("laugh"));
		objTo.appendChild(appendFaceThumb("fwaa"));
		objTo.appendChild(appendFaceThumb("dealwithit"));
		objTo.appendChild(appendFaceThumb("pissed"));
		objTo.appendChild(appendFaceThumb("tsuntsun"));
		objTo.appendChild(appendFaceThumb("deredere"));
		objTo.appendChild(appendFaceThumb("bii"));
		objTo.appendChild(appendFaceThumb("impossibiru"));
		objTo.appendChild(appendFaceThumb("just-no"));
		objTo.appendChild(appendFaceThumb("superb"));
		objTo.appendChild(appendFaceThumb("contented"));
		objTo.appendChild(appendFaceThumb("Lewd"));
		objTo.appendChild(appendFaceThumb("go-on!"));
		objTo.appendChild(appendFaceThumb("happy"));
		objTo.appendChild(appendFaceThumb("pout"));
		objTo.appendChild(appendFaceThumb("RARR"));
		objTo.appendChild(appendFaceThumb("blushing"));
		objTo.appendChild(appendFaceThumb("headpat"));
		objTo.appendChild(appendFaceThumb("heyyou"));
		objTo.appendChild(appendFaceThumb("hug"));
		objTo.appendChild(appendFaceThumb("kyaa"));
		objTo.appendChild(appendFaceThumb("omnom"));
		objTo.appendChild(appendFaceThumb("peek"));
		objTo.appendChild(appendFaceThumb("sigh"));
		objTo.appendChild(appendFaceThumb("trynottopurr"));
		objTo.appendChild(appendFaceThumb("uguu"));
		objTo.appendChild(appendFaceThumb("baka"));
		objTo.appendChild(appendFaceThumb("shiny"));
		objTo.appendChild(appendFaceThumb("watchadoin"));
		objTo.appendChild(appendFaceThumb("curious"));
		objTo.appendChild(appendFaceThumb("clap"));
		objTo.appendChild(appendFaceThumb("Tiriniz"));
		objTo.appendChild(appendFaceThumb("silence"));
		objTo.appendChild(appendFaceThumb("doteyes"));
		objTo.appendChild(appendFaceThumb("oi!"));
		objTo.appendChild(appendFaceThumb("dontmesswithme"));
		objTo.appendChild(appendFaceThumb("nooo"));
		objTo.appendChild(appendFaceThumb("ah"));
		objTo.appendChild(appendFaceThumb("ehehe"));
		objTo.appendChild(appendFaceThumb("robot"));
		objTo.appendChild(appendFaceThumb("crying"));
		objTo.appendChild(appendFaceThumb("jumpforjoy"));
		objTo.appendChild(appendFaceThumb("funky"));
		objTo.appendChild(appendFaceThumb("grin"));
        objTo.appendChild(appendFaceThumb("smug"));
		objTo.appendChild(appendFaceThumb("SuperLewd", 78, 100)) //Two additional parametres force-resize the image. Try to fit it in 150px*100px
	}
	else if (subreddit == "pantsu") {
		faceIdChar = "#";
		wikiLink.href = "https://www.reddit.com/r/pantsu/wiki/commentfaces";
		thumbDialWidth = "170px";
		thumbDialHeight = "140px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("lovemyhat"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("shakedat"));
		objTo.appendChild(appendFaceThumb("nowai"));
		objTo.appendChild(appendFaceThumb("delight"));
		objTo.appendChild(appendFaceThumb("drool"));
		objTo.appendChild(appendFaceThumb("sparkle"));
		objTo.appendChild(appendFaceThumb("disapproval"));
		objTo.appendChild(appendFaceThumb("mmm"));
		objTo.appendChild(appendFaceThumb("nooo"));
		objTo.appendChild(appendFaceThumb("lolipolice"));
	}
	else if (subreddit == "manga") {
		faceIdChar = "//#";
		wikiLink.href = "http://www.reddit.com/r/manga";
		thumbDialWidth = "200px";
		thumbDialHeight = "160px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
					return "[](//#" + bbFace + ")";
			} else {
					return "[](//#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("lolwut"));
		objTo.appendChild(appendFaceThumb("yotsuba"));
		objTo.appendChild(appendFaceThumb("bossun"));
		objTo.appendChild(appendFaceThumb("wat"));
		objTo.appendChild(appendFaceThumb("hiramaru"));
		objTo.appendChild(appendFaceThumb("thumbsup"));
		objTo.appendChild(appendFaceThumb("kobato"));
		objTo.appendChild(appendFaceThumb("mashiro"));
		objTo.appendChild(appendFaceThumb("kamo"));
		objTo.appendChild(appendFaceThumb("nagi"));
		objTo.appendChild(appendFaceThumb("lewd"));
	}
	else if (subreddit == "moescape") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/awwnime/wiki/commentfaces";
		thumbDialWidth = "150px";
		thumbDialHeight = "115px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("grr"));
		objTo.appendChild(appendFaceThumb("o-o"));
		objTo.appendChild(appendFaceThumb("trollin"));
		objTo.appendChild(appendFaceThumb("oniichan"));
		objTo.appendChild(appendFaceThumb("waa"));
		objTo.appendChild(appendFaceThumb("thumbsup"));
		objTo.appendChild(appendFaceThumb("butwhat"));
		objTo.appendChild(appendFaceThumb("disapproval"));
		objTo.appendChild(appendFaceThumb("catsmile"));
		objTo.appendChild(appendFaceThumb("waow"));
		objTo.appendChild(appendFaceThumb("darksad"));
		objTo.appendChild(appendFaceThumb("hnng"));
		objTo.appendChild(appendFaceThumb("nosebleed"));
		objTo.appendChild(appendFaceThumb("awyeah"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("somad"));
		objTo.appendChild(appendFaceThumb("hana"));
		objTo.appendChild(appendFaceThumb("tears"));
		objTo.appendChild(appendFaceThumb("megane"));
		objTo.appendChild(appendFaceThumb("cry"));
		objTo.appendChild(appendFaceThumb("squee"));
		objTo.appendChild(appendFaceThumb("sparkle"));
		objTo.appendChild(appendFaceThumb("yes"));
		objTo.appendChild(appendFaceThumb("therethere"));
		objTo.appendChild(appendFaceThumb("concentrate"));
		objTo.appendChild(appendFaceThumb("WAHAHAHA"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("pleased"));
		objTo.appendChild(appendFaceThumb("shock"));
		objTo.appendChild(appendFaceThumb("facepalm"));
		objTo.appendChild(appendFaceThumb("itai"));
		objTo.appendChild(appendFaceThumb("airen"));
		objTo.appendChild(appendFaceThumb("laugh"));
		objTo.appendChild(appendFaceThumb("fwaa"));
		objTo.appendChild(appendFaceThumb("dealwithit"));
		objTo.appendChild(appendFaceThumb("pissed"));
		objTo.appendChild(appendFaceThumb("tsuntsun"));
		objTo.appendChild(appendFaceThumb("deredere"));
		objTo.appendChild(appendFaceThumb("bii"));
		objTo.appendChild(appendFaceThumb("impossibiru"));
		objTo.appendChild(appendFaceThumb("just-no"));
		objTo.appendChild(appendFaceThumb("superb"));
		objTo.appendChild(appendFaceThumb("contented"));
		objTo.appendChild(appendFaceThumb("Lewd"));
		objTo.appendChild(appendFaceThumb("go-on!"));
		objTo.appendChild(appendFaceThumb("happy"));
		objTo.appendChild(appendFaceThumb("pout"));
		objTo.appendChild(appendFaceThumb("RARR"));
		objTo.appendChild(appendFaceThumb("blushing"));
		objTo.appendChild(appendFaceThumb("headpat"));
		objTo.appendChild(appendFaceThumb("heyyou"));
		objTo.appendChild(appendFaceThumb("hug"));
		objTo.appendChild(appendFaceThumb("kyaa"));
		objTo.appendChild(appendFaceThumb("omnom"));
		objTo.appendChild(appendFaceThumb("peek"));
		objTo.appendChild(appendFaceThumb("sigh"));
		objTo.appendChild(appendFaceThumb("trynottopurr"));
		objTo.appendChild(appendFaceThumb("uguu"));
		objTo.appendChild(appendFaceThumb("baka"));
		objTo.appendChild(appendFaceThumb("shiny"));
		objTo.appendChild(appendFaceThumb("watchadoin"));
		objTo.appendChild(appendFaceThumb("curious"));
		objTo.appendChild(appendFaceThumb("clap"));
		objTo.appendChild(appendFaceThumb("Tiriniz"));
		objTo.appendChild(appendFaceThumb("silence"));
		objTo.appendChild(appendFaceThumb("doteyes"));
		objTo.appendChild(appendFaceThumb("renge"));
		objTo.appendChild(appendFaceThumb("dontmesswithrenge"));
		objTo.appendChild(appendFaceThumb("asuka"));
		objTo.appendChild(appendFaceThumb("nooo"));
		objTo.appendChild(appendFaceThumb("ah"));
		objTo.appendChild(appendFaceThumb("ehehe"));
		objTo.appendChild(appendFaceThumb("robot"));
		objTo.appendChild(appendFaceThumb("shinobu"));
		objTo.appendChild(appendFaceThumb("oniichan_anim"));
		objTo.appendChild(appendFaceThumb("jumpforjoy"));
		objTo.appendChild(appendFaceThumb("doteyes"));
		objTo.appendChild(appendFaceThumb("funky"));
	}
	else if (subreddit == "twodeeart") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/awwnime/wiki/commentfaces";
		thumbDialWidth = "150px";
		thumbDialHeight = "115px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("grr"));
		objTo.appendChild(appendFaceThumb("o-o"));
		objTo.appendChild(appendFaceThumb("trollin"));
		objTo.appendChild(appendFaceThumb("oniichan"));
		objTo.appendChild(appendFaceThumb("waa"));
		objTo.appendChild(appendFaceThumb("thumbsup"));
		objTo.appendChild(appendFaceThumb("butwhat"));
		objTo.appendChild(appendFaceThumb("disapproval"));
		objTo.appendChild(appendFaceThumb("catsmile"));
		objTo.appendChild(appendFaceThumb("waow"));
		objTo.appendChild(appendFaceThumb("darksad"));
		objTo.appendChild(appendFaceThumb("hnng"));
		objTo.appendChild(appendFaceThumb("nosebleed"));
		objTo.appendChild(appendFaceThumb("awyeah"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("somad"));
		objTo.appendChild(appendFaceThumb("hana"));
		objTo.appendChild(appendFaceThumb("tears"));
		objTo.appendChild(appendFaceThumb("megane"));
		objTo.appendChild(appendFaceThumb("cry"));
		objTo.appendChild(appendFaceThumb("squee"));
		objTo.appendChild(appendFaceThumb("sparkle"));
		objTo.appendChild(appendFaceThumb("yes"));
		objTo.appendChild(appendFaceThumb("therethere"));
		objTo.appendChild(appendFaceThumb("concentrate"));
		objTo.appendChild(appendFaceThumb("WAHAHAHA"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("pleased"));
		objTo.appendChild(appendFaceThumb("shock"));
		objTo.appendChild(appendFaceThumb("facepalm"));
		objTo.appendChild(appendFaceThumb("itai"));
		objTo.appendChild(appendFaceThumb("airen"));
		objTo.appendChild(appendFaceThumb("laugh"));
		objTo.appendChild(appendFaceThumb("fwaa"));
		objTo.appendChild(appendFaceThumb("dealwithit"));
		objTo.appendChild(appendFaceThumb("pissed"));
		objTo.appendChild(appendFaceThumb("tsuntsun"));
		objTo.appendChild(appendFaceThumb("deredere"));
		objTo.appendChild(appendFaceThumb("bii"));
		objTo.appendChild(appendFaceThumb("impossibiru"));
		objTo.appendChild(appendFaceThumb("just-no"));
		objTo.appendChild(appendFaceThumb("superb"));
		objTo.appendChild(appendFaceThumb("contented"));
		objTo.appendChild(appendFaceThumb("Lewd"));
		objTo.appendChild(appendFaceThumb("go-on!"));
		objTo.appendChild(appendFaceThumb("happy"));
		objTo.appendChild(appendFaceThumb("pout"));
		objTo.appendChild(appendFaceThumb("RARR"));
		objTo.appendChild(appendFaceThumb("blushing"));
		objTo.appendChild(appendFaceThumb("headpat"));
		objTo.appendChild(appendFaceThumb("heyyou"));
		objTo.appendChild(appendFaceThumb("hug"));
		objTo.appendChild(appendFaceThumb("kyaa"));
		objTo.appendChild(appendFaceThumb("omnom"));
		objTo.appendChild(appendFaceThumb("peek"));
		objTo.appendChild(appendFaceThumb("sigh"));
		objTo.appendChild(appendFaceThumb("trynottopurr"));
		objTo.appendChild(appendFaceThumb("uguu"));
		objTo.appendChild(appendFaceThumb("baka"));
		objTo.appendChild(appendFaceThumb("shiny"));
		objTo.appendChild(appendFaceThumb("watchadoin"));
		objTo.appendChild(appendFaceThumb("curious"));
		objTo.appendChild(appendFaceThumb("clap"));
		objTo.appendChild(appendFaceThumb("Tiriniz"));
		objTo.appendChild(appendFaceThumb("silence"));
		objTo.appendChild(appendFaceThumb("doteyes"));
		objTo.appendChild(appendFaceThumb("renge"));
		objTo.appendChild(appendFaceThumb("dontmesswithrenge"));
		objTo.appendChild(appendFaceThumb("asuka"));
		objTo.appendChild(appendFaceThumb("nooo"));
		objTo.appendChild(appendFaceThumb("ah"));
		objTo.appendChild(appendFaceThumb("ehehe"));
		objTo.appendChild(appendFaceThumb("robot"));
		objTo.appendChild(appendFaceThumb("shinobu"));
		objTo.appendChild(appendFaceThumb("oniichan_anim"));
		objTo.appendChild(appendFaceThumb("jumpforjoy"));
		objTo.appendChild(appendFaceThumb("doteyes"));
		objTo.appendChild(appendFaceThumb("funky"));
	}
	else if (subreddit == "patchuu") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/awwnime/wiki/commentfaces";
		thumbDialWidth = "150px";
		thumbDialHeight = "100px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("grr"));
		objTo.appendChild(appendFaceThumb("o-o"));
		objTo.appendChild(appendFaceThumb("trollin"));
		objTo.appendChild(appendFaceThumb("oniichan"));
		objTo.appendChild(appendFaceThumb("waa"));
		objTo.appendChild(appendFaceThumb("thumbsup"));
		objTo.appendChild(appendFaceThumb("butwhat"));
		objTo.appendChild(appendFaceThumb("disapproval"));
		objTo.appendChild(appendFaceThumb("catsmile"));
		objTo.appendChild(appendFaceThumb("waow"));
		objTo.appendChild(appendFaceThumb("darksad"));
		objTo.appendChild(appendFaceThumb("hnng"));
		objTo.appendChild(appendFaceThumb("nosebleed"));
		objTo.appendChild(appendFaceThumb("awyeah"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("somad"));
		objTo.appendChild(appendFaceThumb("hana"));
		objTo.appendChild(appendFaceThumb("tears"));
		objTo.appendChild(appendFaceThumb("megane"));
		objTo.appendChild(appendFaceThumb("cry"));
		objTo.appendChild(appendFaceThumb("squee"));
		objTo.appendChild(appendFaceThumb("sparkle"));
		objTo.appendChild(appendFaceThumb("yes"));
		objTo.appendChild(appendFaceThumb("therethere"));
		objTo.appendChild(appendFaceThumb("concentrate"));
		objTo.appendChild(appendFaceThumb("WAHAHAHA"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("pleased"));
		objTo.appendChild(appendFaceThumb("shock"));
		objTo.appendChild(appendFaceThumb("facepalm"));
		objTo.appendChild(appendFaceThumb("itai"));
		objTo.appendChild(appendFaceThumb("airen"));
		objTo.appendChild(appendFaceThumb("laugh"));
		objTo.appendChild(appendFaceThumb("fwaa"));
		objTo.appendChild(appendFaceThumb("dealwithit"));
		objTo.appendChild(appendFaceThumb("pissed"));
		objTo.appendChild(appendFaceThumb("tsuntsun"));
		objTo.appendChild(appendFaceThumb("deredere"));
		objTo.appendChild(appendFaceThumb("bii"));
		objTo.appendChild(appendFaceThumb("impossibiru"));
		objTo.appendChild(appendFaceThumb("just-no"));
		objTo.appendChild(appendFaceThumb("superb"));
		objTo.appendChild(appendFaceThumb("contented"));
		objTo.appendChild(appendFaceThumb("Lewd"));
		objTo.appendChild(appendFaceThumb("go-on!"));
		objTo.appendChild(appendFaceThumb("happy"));
		objTo.appendChild(appendFaceThumb("pout"));
		objTo.appendChild(appendFaceThumb("RARR"));
		objTo.appendChild(appendFaceThumb("blushing"));
		objTo.appendChild(appendFaceThumb("headpat"));
		objTo.appendChild(appendFaceThumb("heyyou"));
		objTo.appendChild(appendFaceThumb("hug"));
		objTo.appendChild(appendFaceThumb("kyaa"));
		objTo.appendChild(appendFaceThumb("omnom"));
		objTo.appendChild(appendFaceThumb("peek"));
		objTo.appendChild(appendFaceThumb("sigh"));
		objTo.appendChild(appendFaceThumb("trynottopurr"));
		objTo.appendChild(appendFaceThumb("uguu"));
		objTo.appendChild(appendFaceThumb("silence"));
		objTo.appendChild(appendFaceThumb("doteyes"));
		objTo.appendChild(appendFaceThumb("SuperLewd", 78, 100)) //Two additional parametres force-resize the image. Try to fit it in 150px*100px
	} else if (subreddit == "anime") {
		faceIdChar = "#";
		textBoxNr = 3;
		wikiLink.href = "http://www.reddit.com/r/anime/comments/izxos/comment_faces_for_ranime/";
		thumbDialWidth = "195px";
		thumbDialHeight = "180px";
		bbCodeFunction = function(bbFace, bbTitle, bbUpper, bbLower){
			var bbHover = "";
			var bbCapt = "";
			if (bbTitle != "") {
				bbHover = " \"" + bbTitle + "\"";
			}
			if (bbLower != "") {
				bbCapt = "**" + bbLower + "**";
			}
			if (bbUpper != "") {
				bbCapt = bbCapt + bbUpper;
			}
			return "[" + bbCapt + "](#" + bbFace + bbHover + ")";
		};
		objTo.appendChild(appendFaceThumb("akkotears"));
		objTo.appendChild(appendFaceThumb("aliens"));
		objTo.appendChild(appendFaceThumb("angrypout"));
		objTo.appendChild(appendFaceThumb("blankblink"));
		objTo.appendChild(appendFaceThumb("criticism"));
		objTo.appendChild(appendFaceThumb("emptyinside"));
		objTo.appendChild(appendFaceThumb("comfortfood"));
		objTo.appendChild(appendFaceThumb("trynottocry"));
		objTo.appendChild(appendFaceThumb("dekuhype"));
		objTo.appendChild(appendFaceThumb("emiliaohdear"));
		objTo.appendChild(appendFaceThumb("hugbear"));
		objTo.appendChild(appendFaceThumb("lolipolice"));
		objTo.appendChild(appendFaceThumb("mashiroglare"));
		objTo.appendChild(appendFaceThumb("lwahorror"));
		objTo.appendChild(appendFaceThumb("lwahorror2"));
		objTo.appendChild(appendFaceThumb("salt"));
		objTo.appendChild(appendFaceThumb("modabuse"));
		objTo.appendChild(appendFaceThumb("hisocuck"));
		objTo.appendChild(appendFaceThumb("salutegeo"));
		objTo.appendChild(appendFaceThumb("shitposting"));
		objTo.appendChild(appendFaceThumb("squee"));
		objTo.appendChild(appendFaceThumb("terror"));
		objTo.appendChild(appendFaceThumb("awe"));
		objTo.appendChild(appendFaceThumb("wow"));
		objTo.appendChild(appendFaceThumb("nyanpasu"));
		objTo.appendChild(appendFaceThumb("wallpunch"));
		objTo.appendChild(appendFaceThumb("doggo"));
		objTo.appendChild(appendFaceThumb("headpat"));
		objTo.appendChild(appendFaceThumb("budgetsmile"));
		objTo.appendChild(appendFaceThumb("elsiesigh"));
		objTo.appendChild(appendFaceThumb("hnng"));
		objTo.appendChild(appendFaceThumb("shittaste"));
		objTo.appendChild(appendFaceThumb("taigasigh"));
		objTo.appendChild(appendFaceThumb("woo"));
		objTo.appendChild(appendFaceThumb("yuitears"));
		objTo.appendChild(appendFaceThumb("kurisudisappointed"));
		objTo.appendChild(appendFaceThumb("kobeniblush"));
		objTo.appendChild(appendFaceThumb("moeshitarcher"));
		objTo.appendChild(appendFaceThumb("kinirohug"));
		objTo.appendChild(appendFaceThumb("panic"));
		objTo.appendChild(appendFaceThumb("frustration"));
		objTo.appendChild(appendFaceThumb("laughter"));
		objTo.appendChild(appendFaceThumb("oilup"));
		objTo.appendChild(appendFaceThumb("popcorn"));
		objTo.appendChild(appendFaceThumb("imdone"));
		objTo.appendChild(appendFaceThumb("unsure"));
		objTo.appendChild(appendFaceThumb("wallbang"));
		objTo.appendChild(appendFaceThumb("fistbump"));
		objTo.appendChild(appendFaceThumb("grouphug"));
		objTo.appendChild(appendFaceThumb("hahahawhat"));
		objTo.appendChild(appendFaceThumb("nosebleed"));
		objTo.appendChild(appendFaceThumb("elsienopesout"));
		objTo.appendChild(appendFaceThumb("feelsgoodman"));
		objTo.appendChild(appendFaceThumb("shutupandtakemymoney"));
		objTo.appendChild(appendFaceThumb("combo"));
		objTo.appendChild(appendFaceThumb("abandonthread"));
		objTo.appendChild(appendFaceThumb("shirouthumbsup"));
		objTo.appendChild(appendFaceThumb("kayosmile"));
		objTo.appendChild(appendFaceThumb("mandom"));
		objTo.appendChild(appendFaceThumb("megumin"));
		objTo.appendChild(appendFaceThumb("niconicono"));
		objTo.appendChild(appendFaceThumb("breakingnews"));
		objTo.appendChild(appendFaceThumb("brofist"));
		objTo.appendChild(appendFaceThumb("cokemasterrace"));
		objTo.appendChild(appendFaceThumb("curious"));
		objTo.appendChild(appendFaceThumb("evilgrin"));
		objTo.appendChild(appendFaceThumb("fedup"));
		objTo.appendChild(appendFaceThumb("flattered"));
		objTo.appendChild(appendFaceThumb("flyingbunsofdoom"));
		objTo.appendChild(appendFaceThumb("forgotkeys"));
		objTo.appendChild(appendFaceThumb("garlock"));
		objTo.appendChild(appendFaceThumb("giveuponlife"));
		objTo.appendChild(appendFaceThumb("helmetbro"));
		objTo.appendChild(appendFaceThumb("idoruwinkdesu"));
		objTo.appendChild(appendFaceThumb("justno"));
		objTo.appendChild(appendFaceThumb("missedthepoint"));
		objTo.appendChild(appendFaceThumb("hajimepout"));
		objTo.appendChild(appendFaceThumb("nuidideverythingright"));
		objTo.appendChild(appendFaceThumb("rerorero"));
		objTo.appendChild(appendFaceThumb("scrumptiouslymoe"));
		objTo.appendChild(appendFaceThumb("slapbet"));
		objTo.appendChild(appendFaceThumb("watchadoin"));
		objTo.appendChild(appendFaceThumb("torrentialdownpour"));
		objTo.appendChild(appendFaceThumb("slightoverreaction"));
		objTo.appendChild(appendFaceThumb("prelenny"));
		objTo.appendChild(appendFaceThumb("volibearQ"));
		objTo.appendChild(appendFaceThumb("mywaifumadeyouasandwich"));
		objTo.appendChild(appendFaceThumb("urbansmile"));
		objTo.appendChild(appendFaceThumb("anko"));
		objTo.appendChild(appendFaceThumb("hyoukawink"));
		objTo.appendChild(appendFaceThumb("yousaidsomethingdumb"));
		objTo.appendChild(appendFaceThumb("banjo"));
		objTo.appendChild(appendFaceThumb("peasants"));
		objTo.appendChild(appendFaceThumb("excitedyui"));
		objTo.appendChild(appendFaceThumb("adminsdidwhat"));
		objTo.appendChild(appendFaceThumb("airfist"));
		objTo.appendChild(appendFaceThumb("arresteddevelopment"));
		objTo.appendChild(appendFaceThumb("saikikek"));
		objTo.appendChild(appendFaceThumb("cooresto"));
		objTo.appendChild(appendFaceThumb("ero"));
		objTo.appendChild(appendFaceThumb("everythingisfine"));
		objTo.appendChild(appendFaceThumb("KUSOTTARE"));
		objTo.appendChild(appendFaceThumb("frockychou"));
		objTo.appendChild(appendFaceThumb("fujostare"));
		objTo.appendChild(appendFaceThumb("gabdisgust"));
		objTo.appendChild(appendFaceThumb("happykaoru"));
		objTo.appendChild(appendFaceThumb("mmmmyrgh"));
		objTo.appendChild(appendFaceThumb("naziloli"));
		objTo.appendChild(appendFaceThumb("mangaka"));
		objTo.appendChild(appendFaceThumb("ohfuck"));
		objTo.appendChild(appendFaceThumb("ohshit"));
		objTo.appendChild(appendFaceThumb("ok_hand"));
		objTo.appendChild(appendFaceThumb("peacepeace"));
		objTo.appendChild(appendFaceThumb("protest"));
		objTo.appendChild(appendFaceThumb("ptsd"));
		objTo.appendChild(appendFaceThumb("sadholo"));
		objTo.appendChild(appendFaceThumb("shh"));
		objTo.appendChild(appendFaceThumb("shhbabe"));
		objTo.appendChild(appendFaceThumb("sleepingcutie"));
		objTo.appendChild(appendFaceThumb("whatdidijustread"));
		objTo.appendChild(appendFaceThumb("wideeyed"));
		objTo.appendChild(appendFaceThumb("nottodisushittoagen"));
		objTo.appendChild(appendFaceThumb("megubeer"));
		objTo.appendChild(appendFaceThumb("instillfear"));
		objTo.appendChild(appendFaceThumb("rec"));
		objTo.appendChild(appendFaceThumb("sweating"));
		objTo.appendChild(appendFaceThumb("teekyuuhype"));
		objTo.appendChild(appendFaceThumb("whisperwhisper"));
		objTo.appendChild(appendFaceThumb("getout"));
		objTo.appendChild(appendFaceThumb("comfy"));
		objTo.appendChild(appendFaceThumb("annoyedkiki"));
		objTo.appendChild(appendFaceThumb("assman"));
		objTo.appendChild(appendFaceThumb("biiru"));
		objTo.appendChild(appendFaceThumb("blindinglight"));
		objTo.appendChild(appendFaceThumb("cantbehelped"));
		objTo.appendChild(appendFaceThumb("cateyes"));
		objTo.appendChild(appendFaceThumb("cup7"));
		objTo.appendChild(appendFaceThumb("cup8"));
		objTo.appendChild(appendFaceThumb("cup9"));
		objTo.appendChild(appendFaceThumb("datass"));
		objTo.appendChild(appendFaceThumb("dejected"));
		objTo.appendChild(appendFaceThumb("dubs"));
		objTo.appendChild(appendFaceThumb("eheheh"));
		objTo.appendChild(appendFaceThumb("etotamadunno"));
		objTo.appendChild(appendFaceThumb("eyythisguy"));
		objTo.appendChild(appendFaceThumb("feelingloved"));
		objTo.appendChild(appendFaceThumb("fingertwirl"));
		objTo.appendChild(appendFaceThumb("fujoship"));
		objTo.appendChild(appendFaceThumb("girlishploy"));
		objTo.appendChild(appendFaceThumb("happyrem"));
		objTo.appendChild(appendFaceThumb("hellopolice"));
		objTo.appendChild(appendFaceThumb("illyastare"));
		objTo.appendChild(appendFaceThumb("judgesucy"));
		objTo.appendChild(appendFaceThumb("kannathumbs"));
		objTo.appendChild(appendFaceThumb("kanyehidouyo"));
		objTo.appendChild(appendFaceThumb("killitwithfire"));
		objTo.appendChild(appendFaceThumb("kms"));
		objTo.appendChild(appendFaceThumb("konhug"));
		objTo.appendChild(appendFaceThumb("konosubawot3"));
		objTo.appendChild(appendFaceThumb("lewdgyaru"));
		objTo.appendChild(appendFaceThumb("lifeishard"));
		objTo.appendChild(appendFaceThumb("loli_ok"));
		objTo.appendChild(appendFaceThumb("loliwave"));
		objTo.appendChild(appendFaceThumb("makicry"));
		objTo.appendChild(appendFaceThumb("megushock"));
		objTo.appendChild(appendFaceThumb("mindblank"));
		objTo.appendChild(appendFaceThumb("modsalute"));
		objTo.appendChild(appendFaceThumb("morethanonewaifu"));
		objTo.appendChild(appendFaceThumb("mug10"));
		objTo.appendChild(appendFaceThumb("mug8"));
		objTo.appendChild(appendFaceThumb("mug9"));
		objTo.appendChild(appendFaceThumb("nerr"));
		objTo.appendChild(appendFaceThumb("nichijouthumbs"));
		objTo.appendChild(appendFaceThumb("nicoheart"));
		objTo.appendChild(appendFaceThumb("nicoisdone"));
		objTo.appendChild(appendFaceThumb("niconoo"));
		objTo.appendChild(appendFaceThumb("nosenpai"));
		objTo.appendChild(appendFaceThumb("ohdear"));
		objTo.appendChild(appendFaceThumb("selfcontrol"));
		objTo.appendChild(appendFaceThumb("sideeyes"));
		objTo.appendChild(appendFaceThumb("smugrose"));
		objTo.appendChild(appendFaceThumb("sowwy"));
		objTo.appendChild(appendFaceThumb("surprisedhifumi"));
		objTo.appendChild(appendFaceThumb("taigaheadache"));
		objTo.appendChild(appendFaceThumb("tomato"));
		objTo.appendChild(appendFaceThumb("towel"));
		objTo.appendChild(appendFaceThumb("urarahype"));
		objTo.appendChild(appendFaceThumb("usamiwink"));
		objTo.appendChild(appendFaceThumb("uwaa"));
		objTo.appendChild(appendFaceThumb("zetsuboushta"));
		objTo.appendChild(appendFaceThumb("amurodealwithit"));
		objTo.appendChild(appendFaceThumb("antabaka"));
		objTo.appendChild(appendFaceThumb("badtaste"));
		objTo.appendChild(appendFaceThumb("calmdown"));
		objTo.appendChild(appendFaceThumb("chinosmirk"));
		objTo.appendChild(appendFaceThumb("concealedexcitement"));
		objTo.appendChild(appendFaceThumb("brokenkokoro"));
		objTo.appendChild(appendFaceThumb("cup6"));
		objTo.appendChild(appendFaceThumb("didyouseriouslyjustsaythat"));
		objTo.appendChild(appendFaceThumb("displeasedasuka"));
		objTo.appendChild(appendFaceThumb("cup3"));
		objTo.appendChild(appendFaceThumb("exciteutawarerumono"));
		objTo.appendChild(appendFaceThumb("faito"));
		objTo.appendChild(appendFaceThumb("forbiddenlove"));
		objTo.appendChild(appendFaceThumb("edneedsdis"));
		objTo.appendChild(appendFaceThumb("goblet1"));
		objTo.appendChild(appendFaceThumb("happysaitama"));
		objTo.appendChild(appendFaceThumb("helmetgril"));
		objTo.appendChild(appendFaceThumb("ginapproves"));
		objTo.appendChild(appendFaceThumb("igiveup"));
		objTo.appendChild(appendFaceThumb("ilovethiskindofshit"));
		objTo.appendChild(appendFaceThumb("juice1"));
		objTo.appendChild(appendFaceThumb("howcouldyou"));
		objTo.appendChild(appendFaceThumb("konosubawot2"));
		objTo.appendChild(appendFaceThumb("kumikolook"));
		objTo.appendChild(appendFaceThumb("kumikotears"));
		objTo.appendChild(appendFaceThumb("konosubawot"));
		objTo.appendChild(appendFaceThumb("mug4"));
		objTo.appendChild(appendFaceThumb("mug5"));
		objTo.appendChild(appendFaceThumb("mug7"));
		objTo.appendChild(appendFaceThumb("miyamoriunimpressed"));
		objTo.appendChild(appendFaceThumb("notaccordingtokeikaku"));
		objTo.appendChild(appendFaceThumb("oooreally"));
		objTo.appendChild(appendFaceThumb("osomatsurage"));
		objTo.appendChild(appendFaceThumb("noice"));
		objTo.appendChild(appendFaceThumb("pleasetellmemore"));
		objTo.appendChild(appendFaceThumb("psh-mongrels"));
		objTo.appendChild(appendFaceThumb("saberawe"));
		objTo.appendChild(appendFaceThumb("papithumbsup"));
		objTo.appendChild(appendFaceThumb("saitamadeathstare"));
		objTo.appendChild(appendFaceThumb("salute"));
		objTo.appendChild(appendFaceThumb("schemingsaten"));
		objTo.appendChild(appendFaceThumb("smugasuna"));
		objTo.appendChild(appendFaceThumb("spookyglasses"));
		objTo.appendChild(appendFaceThumb("tamakoapple"));
		objTo.appendChild(appendFaceThumb("shinjimug"));
		objTo.appendChild(appendFaceThumb("thisisfine"));
		objTo.appendChild(appendFaceThumb("whatisthisguydoing"));
		objTo.appendChild(appendFaceThumb("yuishrug"));
		objTo.appendChild(appendFaceThumb("tearsofabestgirl"));
		objTo.appendChild(appendFaceThumb("annoyedmayaka"));
		objTo.appendChild(appendFaceThumb("annoyedsaber"));
		objTo.appendChild(appendFaceThumb("banhammer"));
		objTo.appendChild(appendFaceThumb("yunosunglasses"));
		objTo.appendChild(appendFaceThumb("cheekygahara"));
		objTo.appendChild(appendFaceThumb("crumblingdespair"));
		objTo.appendChild(appendFaceThumb("cup4"));
		objTo.appendChild(appendFaceThumb("bitchplease"));
		objTo.appendChild(appendFaceThumb("delicioustears"));
		objTo.appendChild(appendFaceThumb("donewiththisshit"));
		objTo.appendChild(appendFaceThumb("firstthinginthemorning"));
		objTo.appendChild(appendFaceThumb("cup5"));
		objTo.appendChild(appendFaceThumb("giveitback"));
		objTo.appendChild(appendFaceThumb("glasses-push"));
		objTo.appendChild(appendFaceThumb("hackadollthumbsup"));
		objTo.appendChild(appendFaceThumb("fuckyou"));
		objTo.appendChild(appendFaceThumb("hououinseesit"));
		objTo.appendChild(appendFaceThumb("justasplanned"));
		objTo.appendChild(appendFaceThumb("kaorusmile"));
		objTo.appendChild(appendFaceThumb("healthypasstimes"));
		objTo.appendChild(appendFaceThumb("killuadisgust"));
		objTo.appendChild(appendFaceThumb("konodioda"));
		objTo.appendChild(appendFaceThumb("kotourashock"));
		objTo.appendChild(appendFaceThumb("keikaku"));
		objTo.appendChild(appendFaceThumb("labmembernumber009"));
		objTo.appendChild(appendFaceThumb("lovenectar"));
		objTo.appendChild(appendFaceThumb("minoridenied"));
		objTo.appendChild(appendFaceThumb("kurokokek"));
		objTo.appendChild(appendFaceThumb("mug6"));
		objTo.appendChild(appendFaceThumb("overwhelmed"));
		objTo.appendChild(appendFaceThumb("peace"));
		objTo.appendChild(appendFaceThumb("mitsukishock"));
		objTo.appendChild(appendFaceThumb("poltears"));
		objTo.appendChild(appendFaceThumb("quality"));
		objTo.appendChild(appendFaceThumb("recoil"));
		objTo.appendChild(appendFaceThumb("plebgetawayfromme"));
		objTo.appendChild(appendFaceThumb("saesmile"));
		objTo.appendChild(appendFaceThumb("sciencebringspeopletogether"));
		objTo.appendChild(appendFaceThumb("schwing"));
		objTo.appendChild(appendFaceThumb("saehug"));
		objTo.appendChild(appendFaceThumb("shirayukidetermined"));
		objTo.appendChild(appendFaceThumb("shirayukidizzyblush"));
		objTo.appendChild(appendFaceThumb("shirayukidrunk"));
		objTo.appendChild(appendFaceThumb("shatteredsaten"));
		objTo.appendChild(appendFaceThumb("shirayukifuckinreally"));
		objTo.appendChild(appendFaceThumb("shirayukismile"));
		objTo.appendChild(appendFaceThumb("smughaikyuu"));
		objTo.appendChild(appendFaceThumb("shirayukieavesdrop"));
		objTo.appendChild(appendFaceThumb("takaradasalute"));
		objTo.appendChild(appendFaceThumb("takasakiapproves"));
		objTo.appendChild(appendFaceThumb("thinkingtoohard"));
		objTo.appendChild(appendFaceThumb("smugobi"));
		objTo.appendChild(appendFaceThumb("toradorasalute"));
		objTo.appendChild(appendFaceThumb("triggeredkillua"));
		objTo.appendChild(appendFaceThumb("trollnui"));
		objTo.appendChild(appendFaceThumb("toradorable"));
		objTo.appendChild(appendFaceThumb("waah"));
		objTo.appendChild(appendFaceThumb("watashihasdeclined"));
		objTo.appendChild(appendFaceThumb("watashiworried"));
		objTo.appendChild(appendFaceThumb("utahapraises"));
		objTo.appendChild(appendFaceThumb("meguminthumbsup"));
		objTo.appendChild(appendFaceThumb("smugpoint"));
		objTo.appendChild(appendFaceThumb("kukuku2"));
		objTo.appendChild(appendFaceThumb("whatamireading"));
		objTo.appendChild(appendFaceThumb("akyuusqueel"));
		objTo.appendChild(appendFaceThumb("arakawascream"));
		objTo.appendChild(appendFaceThumb("bestiacheckyourprivilage"));
		objTo.appendChild(appendFaceThumb("arakawascream"));
		objTo.appendChild(appendFaceThumb("disbelief"));
		objTo.appendChild(appendFaceThumb("asunanotamused"));
		objTo.appendChild(appendFaceThumb("arakawascream"));
		objTo.appendChild(appendFaceThumb("izananotthisshitagain"));
		objTo.appendChild(appendFaceThumb("dontdometh"));
		objTo.appendChild(appendFaceThumb("chiyomad"));
		objTo.appendChild(appendFaceThumb("barakamonnotcool"));
		objTo.appendChild(appendFaceThumb("rengehype"));
		objTo.appendChild(appendFaceThumb("gintamasunlight"));
		objTo.appendChild(appendFaceThumb("gintamacrushed"));
		objTo.appendChild(appendFaceThumb("head-tilt"));
		objTo.appendChild(appendFaceThumb("thoughtful"));
		objTo.appendChild(appendFaceThumb("kyonfacepalm"));
		objTo.appendChild(appendFaceThumb("katoupout"));
		objTo.appendChild(appendFaceThumb("ohmygod"));
		objTo.appendChild(appendFaceThumb("vashheadscratch"));
		objTo.appendChild(appendFaceThumb("nichijouqq"));
		objTo.appendChild(appendFaceThumb("gintamathispleasesme"));
		objTo.appendChild(appendFaceThumb("wow-really"));
		objTo.appendChild(appendFaceThumb("holdme"));
		objTo.appendChild(appendFaceThumb("sheerdisgust"));
		objTo.appendChild(appendFaceThumb("duckhue"));
		objTo.appendChild(appendFaceThumb("lewd"));
		objTo.appendChild(appendFaceThumb("badassmugi"));
		objTo.appendChild(appendFaceThumb("uglycry"));
		objTo.appendChild(appendFaceThumb("maidshock"));
		objTo.appendChild(appendFaceThumb("stare"));
		objTo.appendChild(appendFaceThumb("csikon"));
		objTo.appendChild(appendFaceThumb("ohnoudidnt"));
		objTo.appendChild(appendFaceThumb("yuruyuriapprove"));
		objTo.appendChild(appendFaceThumb("nico-heart"));
		objTo.appendChild(appendFaceThumb("gintamaspillage"));
		objTo.appendChild(appendFaceThumb("biribiricat"));
		objTo.appendChild(appendFaceThumb("comewithmeifyouwanttobebestgirl"));
		objTo.appendChild(appendFaceThumb("kumikouninterested"));
		objTo.appendChild(appendFaceThumb("hisokaclown"));
		objTo.appendChild(appendFaceThumb("cup2"));
		objTo.appendChild(appendFaceThumb("annoyedkirito"));
		objTo.appendChild(appendFaceThumb("mug1"));
		objTo.appendChild(appendFaceThumb("jibrilaww"));
		objTo.appendChild(appendFaceThumb("hanasakueurgh"));
		objTo.appendChild(appendFaceThumb("crazedlaugh"));
		objTo.appendChild(appendFaceThumb("manly-tears"));
		objTo.appendChild(appendFaceThumb("miiaembarassed"));
		objTo.appendChild(appendFaceThumb("hypeoverload"));
		objTo.appendChild(appendFaceThumb("elsieqq"));
		objTo.appendChild(appendFaceThumb("shock"));
		objTo.appendChild(appendFaceThumb("araragi-1"));
		objTo.appendChild(appendFaceThumb("katoupls"));
		objTo.appendChild(appendFaceThumb("haruhiisnotamused"));
		objTo.appendChild(appendFaceThumb("gendo-pls"));
		objTo.appendChild(appendFaceThumb("embarassedisla"));
		objTo.appendChild(appendFaceThumb("misakiteehee"));
		objTo.appendChild(appendFaceThumb("infernocopu"));
		objTo.appendChild(appendFaceThumb("nanami-hug"));
		objTo.appendChild(appendFaceThumb("happypoi"));
		objTo.appendChild(appendFaceThumb("niatilt"));
		objTo.appendChild(appendFaceThumb("mechablush"));
		objTo.appendChild(appendFaceThumb("what"));
		objTo.appendChild(appendFaceThumb("marikalewd"));
		objTo.appendChild(appendFaceThumb("SPORTS"));
		objTo.appendChild(appendFaceThumb("misakiwink"));
		objTo.appendChild(appendFaceThumb("thumbs-up"));
		objTo.appendChild(appendFaceThumb("trollarcher"));
		objTo.appendChild(appendFaceThumb("tiredfate"));
		objTo.appendChild(appendFaceThumb("nononkek"));
		objTo.appendChild(appendFaceThumb("gintamaspillage"));
		objTo.appendChild(appendFaceThumb("WRYYY"));
		objTo.appendChild(appendFaceThumb("not-raining"));
		objTo.appendChild(appendFaceThumb("teehee"));
		objTo.appendChild(appendFaceThumb("nosepick"));
		objTo.appendChild(appendFaceThumb("misakaheh"));
		objTo.appendChild(appendFaceThumb("heart-thumbs-up"));
		objTo.appendChild(appendFaceThumb("ok"));
		objTo.appendChild(appendFaceThumb("whowouldathunkit"));
		objTo.appendChild(appendFaceThumb("deadpan"));
		objTo.appendChild(appendFaceThumb("nocomment"));
		objTo.appendChild(appendFaceThumb("mug2"));
		objTo.appendChild(appendFaceThumb("scaredmio"));
		objTo.appendChild(appendFaceThumb("mug3"));
		objTo.appendChild(appendFaceThumb("bestiathumbsup"));
		objTo.appendChild(appendFaceThumb("ohgodwhathaveidone"));
		objTo.appendChild(appendFaceThumb("cup1"));
		objTo.appendChild(appendFaceThumb("happydera"));
		objTo.appendChild(appendFaceThumb("hunchedover"));
		objTo.appendChild(appendFaceThumb("kukuku"));
		objTo.appendChild(appendFaceThumb("jibrilfetish"));
		objTo.appendChild(appendFaceThumb("chitogheh"));
		objTo.appendChild(appendFaceThumb("yandereyuno"));
		objTo.appendChild(appendFaceThumb("k-on-hug"));
		objTo.appendChild(appendFaceThumb("yui-crying"));
		objTo.appendChild(appendFaceThumb("facepalm"));
		objTo.appendChild(appendFaceThumb("gununu"));
	}
	else if (subreddit == "kemonomimi") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/kemonomimi/wiki/commentfaces";
		thumbDialWidth = "180px";
		thumbDialHeight = "160px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("catsmile"));
		objTo.appendChild(appendFaceThumb("cry"));
		objTo.appendChild(appendFaceThumb("embarrassed"));
		objTo.appendChild(appendFaceThumb("yes!"));
		objTo.appendChild(appendFaceThumb("grin"));
		objTo.appendChild(appendFaceThumb("content"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("bored"));
		objTo.appendChild(appendFaceThumb("happy"));
		objTo.appendChild(appendFaceThumb("nyaa"));
		objTo.appendChild(appendFaceThumb("notpleased"));
		objTo.appendChild(appendFaceThumb("pleased"));
		objTo.appendChild(appendFaceThumb("ohmy"));
		objTo.appendChild(appendFaceThumb("excited"));
		objTo.appendChild(appendFaceThumb("sunglasses"));
		objTo.appendChild(appendFaceThumb("surprised"));
		objTo.appendChild(appendFaceThumb("dontstare"));
		objTo.appendChild(appendFaceThumb("waaa"));
		objTo.appendChild(appendFaceThumb("deredere"));
		objTo.appendChild(appendFaceThumb("blushing"));
		objTo.appendChild(appendFaceThumb("smile"));
		objTo.appendChild(appendFaceThumb("nosebleed"));
		objTo.appendChild(appendFaceThumb("nuu"));
		objTo.appendChild(appendFaceThumb("sleepy"));
		objTo.appendChild(appendFaceThumb("pout"));
		objTo.appendChild(appendFaceThumb("poke"));
		objTo.appendChild(appendFaceThumb("lick"));
		objTo.appendChild(appendFaceThumb("pet"));
		objTo.appendChild(appendFaceThumb("headpat"));
		objTo.appendChild(appendFaceThumb("giggle"));
		objTo.appendChild(appendFaceThumb("chuu"));
		objTo.appendChild(appendFaceThumb("frustrated"));
		objTo.appendChild(appendFaceThumb("glassespush"));
	}
	else if (subreddit == "visualnovels") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/visualnovels/wiki/commentfaces";
		thumbDialWidth = "150px";
		thumbDialHeight = "110px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("ballin"));
		objTo.appendChild(appendFaceThumb("hnng"));
		objTo.appendChild(appendFaceThumb("lewd"));
		objTo.appendChild(appendFaceThumb("omnom"));
		objTo.appendChild(appendFaceThumb("oniichan"));
		objTo.appendChild(appendFaceThumb("somad"));
		objTo.appendChild(appendFaceThumb("trollin"));
		objTo.appendChild(appendFaceThumb("uguu"));
		objTo.appendChild(appendFaceThumb("WAHAHAHA"));
		objTo.appendChild(appendFaceThumb("yandere"));
	}
	else if (subreddit == "supersonico") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/SuperSonico/wiki/commentfaces";
		thumbDialWidth = "140px";
		thumbDialHeight = "140px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("happy"));
		objTo.appendChild(appendFaceThumb("kungfu"));
		objTo.appendChild(appendFaceThumb("nekomimi"));
		objTo.appendChild(appendFaceThumb("fancywink"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("sleepy"));
		objTo.appendChild(appendFaceThumb("nom"));
		objTo.appendChild(appendFaceThumb("huh"));
		objTo.appendChild(appendFaceThumb("hmm"));
		objTo.appendChild(appendFaceThumb("drool"));
		objTo.appendChild(appendFaceThumb("wat"));
		objTo.appendChild(appendFaceThumb("excited"));
		objTo.appendChild(appendFaceThumb("suzuhappy"));
		objTo.appendChild(appendFaceThumb("angry"));
		objTo.appendChild(appendFaceThumb("smirk"));
		objTo.appendChild(appendFaceThumb("manager"));
		objTo.appendChild(appendFaceThumb("blush_1"));
		objTo.appendChild(appendFaceThumb("exhausted"));
		objTo.appendChild(appendFaceThumb("blush_2"));
		objTo.appendChild(appendFaceThumb("blush_3"));
		objTo.appendChild(appendFaceThumb("blush_4"));
		objTo.appendChild(appendFaceThumb("blush_5"));
		objTo.appendChild(appendFaceThumb("blush_6"));
		objTo.appendChild(appendFaceThumb("blush_7"));
		objTo.appendChild(appendFaceThumb("yes"));
		objTo.appendChild(appendFaceThumb("blush_8"));
		objTo.appendChild(appendFaceThumb("blush_9"));
		objTo.appendChild(appendFaceThumb("blush_10"));
		objTo.appendChild(appendFaceThumb("tihi"));
		objTo.appendChild(appendFaceThumb("worried"));
		objTo.appendChild(appendFaceThumb("smile"));
		objTo.appendChild(appendFaceThumb("car"));
		objTo.appendChild(appendFaceThumb("cheese"));
		objTo.appendChild(appendFaceThumb("blush_11"));
		objTo.appendChild(appendFaceThumb("blush_12"));
		objTo.appendChild(appendFaceThumb("surprise"));
		objTo.appendChild(appendFaceThumb("give"));
		objTo.appendChild(appendFaceThumb("really"));
		objTo.appendChild(appendFaceThumb("sleep"));
		objTo.appendChild(appendFaceThumb("alarm_cats"));
		objTo.appendChild(appendFaceThumb("cats"));
		objTo.appendChild(appendFaceThumb("cheer"));
		objTo.appendChild(appendFaceThumb("drowzy"));
		objTo.appendChild(appendFaceThumb("megane"));
		objTo.appendChild(appendFaceThumb("lurk"));
		objTo.appendChild(appendFaceThumb("what"));
		objTo.appendChild(appendFaceThumb("peek"));
		objTo.appendChild(appendFaceThumb("lurk_shock"));
		objTo.appendChild(appendFaceThumb("shock"));
		objTo.appendChild(appendFaceThumb("blush_13"));
		objTo.appendChild(appendFaceThumb("blush_14"));
		objTo.appendChild(appendFaceThumb("blush_15"));
		objTo.appendChild(appendFaceThumb("blush_16"));
		objTo.appendChild(appendFaceThumb("cheerful"));
		objTo.appendChild(appendFaceThumb("droppedthesoap"));
		objTo.appendChild(appendFaceThumb("ohh"));
		objTo.appendChild(appendFaceThumb("peace"));
		objTo.appendChild(appendFaceThumb("clap"));
		objTo.appendChild(appendFaceThumb("scared"));
		objTo.appendChild(appendFaceThumb("drown"));
		objTo.appendChild(appendFaceThumb("zombie"));
		objTo.appendChild(appendFaceThumb("camera"));
		objTo.appendChild(appendFaceThumb("oldman"));
		objTo.appendChild(appendFaceThumb("oldman2"));
		objTo.appendChild(appendFaceThumb("f_scared"));
		objTo.appendChild(appendFaceThumb("f_okashi"));
		objTo.appendChild(appendFaceThumb("f_smile"));
		objTo.appendChild(appendFaceThumb("f_hug"));
		objTo.appendChild(appendFaceThumb("f_surprise"));
		objTo.appendChild(appendFaceThumb("f_peek"));
		objTo.appendChild(appendFaceThumb("f_drool"));
		objTo.appendChild(appendFaceThumb("f_grin"));
		objTo.appendChild(appendFaceThumb("f_excited"));
		objTo.appendChild(appendFaceThumb("f_peace"));
		objTo.appendChild(appendFaceThumb("f_clap"));
		objTo.appendChild(appendFaceThumb("f_cry"));
		objTo.appendChild(appendFaceThumb("f_pocky"));
		objTo.appendChild(appendFaceThumb("f_huh"));
		objTo.appendChild(appendFaceThumb("f_drown"));
		objTo.appendChild(appendFaceThumb("k_grin"));
		objTo.appendChild(appendFaceThumb("lewd"));
		objTo.appendChild(appendFaceThumb("k_mad"));
		objTo.appendChild(appendFaceThumb("k_cool"));
		objTo.appendChild(appendFaceThumb("g_wasabi"));
		objTo.appendChild(appendFaceThumb("g_cats"));
		objTo.appendChild(appendFaceThumb("o_what"));
		objTo.appendChild(appendFaceThumb("o_really"));
		objTo.appendChild(appendFaceThumb("o_chuu2"));
		objTo.appendChild(appendFaceThumb("o_tired"));
		objTo.appendChild(appendFaceThumb("o_smile"));
		objTo.appendChild(appendFaceThumb("o_sparkle"));
		objTo.appendChild(appendFaceThumb("o_tada"));
		objTo.appendChild(appendFaceThumb("o_small"));
		objTo.appendChild(appendFaceThumb("senpai2"));
		objTo.appendChild(appendFaceThumb("senpai3"));
		objTo.appendChild(appendFaceThumb("s_hmm"));
		objTo.appendChild(appendFaceThumb("s_kick"));
		objTo.appendChild(appendFaceThumb("s_ponder"));
		objTo.appendChild(appendFaceThumb("s_grin"));
		objTo.appendChild(appendFaceThumb("s_heh"));
		objTo.appendChild(appendFaceThumb("s_really"));
		objTo.appendChild(appendFaceThumb("s_no"));
		objTo.appendChild(appendFaceThumb("s_cross"));
		objTo.appendChild(appendFaceThumb("s_wink"));
		objTo.appendChild(appendFaceThumb("s_shock"));
		objTo.appendChild(appendFaceThumb("s_eh"));
		objTo.appendChild(appendFaceThumb("s_what"));
		objTo.appendChild(appendFaceThumb("s_drown"));
	}
	else if (subreddit == "kanmusu") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/kanmusu/wiki/commentfaces";
		thumbDialWidth = "180px";
		thumbDialHeight = "180px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbFace == "source" || bbFace == "album" || bbFace == "sourcensfw" || bbFace == "albumnsfw" || bbFace == "BBSource" || bbFace == "BBAlbum" || bbFace == "BBNSFW" || bbFace == "BBNSFWAlbum" || bbFace == "CASource" || bbFace == "CAAlbum" || bbFace == "CANSFW" || bbFace == "CANSFWAlbum" || bbFace == "CLSource" || bbFace == "CLAlbum" || bbFace == "CLNSFW" || bbFace == "CLNSFWAlbum" || bbFace == "CVSource" || bbFace == "CVAlbum" || bbFace == "CVNSFW" || bbFace == "CVNSFWAlbum" || bbFace == "DDSource" || bbFace == "DDAlbum" || bbFace == "DDNSFW" || bbFace == "DDNSFWAlbum" || bbFace == "AVSource" || bbFace == "AVAlbum" || bbFace == "AVNSFW" || bbFace == "AVNSFWAlbum" || bbFace == "SSSource" || bbFace == "SSAlbum" || bbFace == "SSNSFW" || bbFace == "SSNSFWAlbum" || bbFace == "OtherSource" || bbFace == "OtherAlbum" || bbFace == "OtherNSFW" || bbFace == "OtherNSFWAlbum") {
				return "[Source](" + bbTitle + "#" + bbFace + ")";
			}
			else {
				if (bbTitle == "") {
					return "[](#" + bbFace + ")";
				} else {
					return "[](#" + bbFace + " \"" + bbTitle + "\")";
				}
			}
		};
		objTo.appendChild(appendFaceThumb("happy"));
		objTo.appendChild(appendFaceThumb("shock"));
		objTo.appendChild(appendFaceThumb("yosh"));
		objTo.appendChild(appendFaceThumb("facepalm"));
		objTo.appendChild(appendFaceThumb("wat"));
		objTo.appendChild(appendFaceThumb("itai"));
		objTo.appendChild(appendFaceThumb("smug"));
		objTo.appendChild(appendFaceThumb("yes"));
		objTo.appendChild(appendFaceThumb("naka"));
		objTo.appendChild(appendFaceThumb("upgrade"));
		objTo.appendChild(appendFaceThumb("megane"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("kongou"));
		objTo.appendChild(appendFaceThumb("damage"));
		objTo.appendChild(appendFaceThumb("tears"));
		objTo.appendChild(appendFaceThumb("nooo"));
		objTo.appendChild(appendFaceThumb("oh"));
		objTo.appendChild(appendFaceThumb("ah"));
		objTo.appendChild(appendFaceThumb("smile"));
		objTo.appendChild(appendFaceThumb("pyon"));
		objTo.appendChild(appendFaceThumb("uwaa"));
		objTo.appendChild(appendFaceThumb("sad"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("found"));
		objTo.appendChild(appendFaceThumb("laugh"));
		objTo.appendChild(appendFaceThumb("hontou"));
		objTo.appendChild(appendFaceThumb("hmmm"));
		objTo.appendChild(appendFaceThumb("pleased"));
		objTo.appendChild(appendFaceThumb("why"));
		objTo.appendChild(appendFaceThumb("contented"));
		objTo.appendChild(appendFaceThumb("bii"));
		objTo.appendChild(appendFaceThumb("huh"));
		objTo.appendChild(appendFaceThumb("evil"));
		objTo.appendChild(appendFaceThumb("thoughtful"));
		objTo.appendChild(appendFaceThumb("ohhh"));
		objTo.appendChild(appendFaceThumb("eh"));
		objTo.appendChild(appendFaceThumb("renblush"));
		objTo.appendChild(appendFaceThumb("relax"));
		objTo.appendChild(appendFaceThumb("wistful"));
		objTo.appendChild(appendFaceThumb("renshock"));
		objTo.appendChild(appendFaceThumb("rencontent"));
		objTo.appendChild(appendFaceThumb("renchan"));
		objTo.appendChild(appendFaceThumb("pain"));
		objTo.appendChild(appendFaceThumb("smirk"));
		objTo.appendChild(appendFaceThumb("raburabu"));
		objTo.appendChild(appendFaceThumb("kunsad"));
		objTo.appendChild(appendFaceThumb("tear"));
		objTo.appendChild(appendFaceThumb("renkun"));
		objTo.appendChild(appendFaceThumb("akagi"));
		objTo.appendChild(appendFaceThumb("fire"));
		objTo.appendChild(appendFaceThumb("excited"));
		objTo.appendChild(appendFaceThumb("akatsuki"));
		objTo.appendChild(appendFaceThumb("running"));
		objTo.appendChild(appendFaceThumb("kyun"));
		objTo.appendChild(appendFaceThumb("dancing"));
		objTo.appendChild(appendFaceThumb("cheer"));
		objTo.appendChild(appendFaceThumb("bonk"));
		objTo.appendChild(appendFaceThumb("fall"));
		objTo.appendChild(appendFaceThumb("dance"));
		objTo.appendChild(appendFaceThumb("swing"));
		objTo.appendChild(appendFaceThumb("blink"));
		objTo.appendChild(appendFaceThumb("blink2"));
		//SOURCES
		objTo.appendChild(appendFaceThumb("source"));
		objTo.appendChild(appendFaceThumb("album"));
		objTo.appendChild(appendFaceThumb("sourcensfw"));
		objTo.appendChild(appendFaceThumb("albumnsfw"));
		//SIMPLE SOURCE
		objTo.appendChild(appendFaceThumb("BBSource"));
		objTo.appendChild(appendFaceThumb("CASource"));
		objTo.appendChild(appendFaceThumb("CLSource"));
		objTo.appendChild(appendFaceThumb("CVSource"));
		objTo.appendChild(appendFaceThumb("DDSource"));
		objTo.appendChild(appendFaceThumb("AVSource"));
		objTo.appendChild(appendFaceThumb("SSSource"));
		objTo.appendChild(appendFaceThumb("OtherSource"));
		//ALBUM SOURCE
		objTo.appendChild(appendFaceThumb("BBAlbum"));
		objTo.appendChild(appendFaceThumb("CAAlbum"));
		objTo.appendChild(appendFaceThumb("CLAlbum"));
		objTo.appendChild(appendFaceThumb("CVAlbum"));
		objTo.appendChild(appendFaceThumb("DDAlbum"));
		objTo.appendChild(appendFaceThumb("AVAlbum"));
		objTo.appendChild(appendFaceThumb("SSAlbum"));
		objTo.appendChild(appendFaceThumb("OtherAlbum"));
		//NSFW SOURCE
		objTo.appendChild(appendFaceThumb("BBNSFW"));
		objTo.appendChild(appendFaceThumb("CANSFW"));
		objTo.appendChild(appendFaceThumb("CLNSFW"));
		objTo.appendChild(appendFaceThumb("CVNSFW"));
		objTo.appendChild(appendFaceThumb("DDNSFW"));
		objTo.appendChild(appendFaceThumb("AVNSFW"));
		objTo.appendChild(appendFaceThumb("SSNSFW"));
		objTo.appendChild(appendFaceThumb("OtherNSFW"));
		//NSFW ALBUM
		objTo.appendChild(appendFaceThumb("BBNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("CANSFWAlbum"));
		objTo.appendChild(appendFaceThumb("CLNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("CVNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("DDNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("AVNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("SSNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("OtherNSFWAlbum"));
	}
	else if (subreddit == "kanmusunights") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/kanmusu/wiki/commentfaces";
		thumbDialWidth = "180px";
		thumbDialHeight = "180px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbFace == "source" || bbFace == "album" || bbFace == "sourcensfw" || bbFace == "albumnsfw" || bbFace == "BBSource" || bbFace == "BBAlbum" || bbFace == "BBNSFW" || bbFace == "BBNSFWAlbum" || bbFace == "CASource" || bbFace == "CAAlbum" || bbFace == "CANSFW" || bbFace == "CANSFWAlbum" || bbFace == "CLSource" || bbFace == "CLAlbum" || bbFace == "CLNSFW" || bbFace == "CLNSFWAlbum" || bbFace == "CVSource" || bbFace == "CVAlbum" || bbFace == "CVNSFW" || bbFace == "CVNSFWAlbum" || bbFace == "DDSource" || bbFace == "DDAlbum" || bbFace == "DDNSFW" || bbFace == "DDNSFWAlbum" || bbFace == "AVSource" || bbFace == "AVAlbum" || bbFace == "AVNSFW" || bbFace == "AVNSFWAlbum" || bbFace == "SSSource" || bbFace == "SSAlbum" || bbFace == "SSNSFW" || bbFace == "SSNSFWAlbum" || bbFace == "OtherSource" || bbFace == "OtherAlbum" || bbFace == "OtherNSFW" || bbFace == "OtherNSFWAlbum") {
				return "[Source](" + bbTitle + "#" + bbFace + ")";
			}
			else {
				if (bbTitle == "") {
					return "[](#" + bbFace + ")";
				} else {
					return "[](#" + bbFace + " \"" + bbTitle + "\")";
				}
			}
		};
		objTo.appendChild(appendFaceThumb("happy"));
		objTo.appendChild(appendFaceThumb("shock"));
		objTo.appendChild(appendFaceThumb("yosh"));
		objTo.appendChild(appendFaceThumb("facepalm"));
		objTo.appendChild(appendFaceThumb("wat"));
		objTo.appendChild(appendFaceThumb("itai"));
		objTo.appendChild(appendFaceThumb("smug"));
		objTo.appendChild(appendFaceThumb("yes"));
		objTo.appendChild(appendFaceThumb("naka"));
		objTo.appendChild(appendFaceThumb("upgrade"));
		objTo.appendChild(appendFaceThumb("megane"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("kongou"));
		objTo.appendChild(appendFaceThumb("damage"));
		objTo.appendChild(appendFaceThumb("tears"));
		objTo.appendChild(appendFaceThumb("nooo"));
		objTo.appendChild(appendFaceThumb("oh"));
		objTo.appendChild(appendFaceThumb("ah"));
		objTo.appendChild(appendFaceThumb("smile"));
		objTo.appendChild(appendFaceThumb("pyon"));
		objTo.appendChild(appendFaceThumb("uwaa"));
		objTo.appendChild(appendFaceThumb("sad"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("found"));
		objTo.appendChild(appendFaceThumb("laugh"));
		objTo.appendChild(appendFaceThumb("hontou"));
		objTo.appendChild(appendFaceThumb("hmmm"));
		objTo.appendChild(appendFaceThumb("pleased"));
		objTo.appendChild(appendFaceThumb("why"));
		objTo.appendChild(appendFaceThumb("contented"));
		objTo.appendChild(appendFaceThumb("bii"));
		objTo.appendChild(appendFaceThumb("huh"));
		objTo.appendChild(appendFaceThumb("evil"));
		objTo.appendChild(appendFaceThumb("thoughtful"));
		objTo.appendChild(appendFaceThumb("ohhh"));
		objTo.appendChild(appendFaceThumb("eh"));
		objTo.appendChild(appendFaceThumb("renblush"));
		objTo.appendChild(appendFaceThumb("relax"));
		objTo.appendChild(appendFaceThumb("wistful"));
		objTo.appendChild(appendFaceThumb("renshock"));
		objTo.appendChild(appendFaceThumb("rencontent"));
		objTo.appendChild(appendFaceThumb("renchan"));
		objTo.appendChild(appendFaceThumb("pain"));
		objTo.appendChild(appendFaceThumb("smirk"));
		objTo.appendChild(appendFaceThumb("raburabu"));
		objTo.appendChild(appendFaceThumb("kunsad"));
		objTo.appendChild(appendFaceThumb("tear"));
		objTo.appendChild(appendFaceThumb("renkun"));
		objTo.appendChild(appendFaceThumb("akagi"));
		objTo.appendChild(appendFaceThumb("fire"));
		objTo.appendChild(appendFaceThumb("excited"));
		objTo.appendChild(appendFaceThumb("akatsuki"));
		objTo.appendChild(appendFaceThumb("running"));
		objTo.appendChild(appendFaceThumb("kyun"));
		objTo.appendChild(appendFaceThumb("dancing"));
		objTo.appendChild(appendFaceThumb("cheer"));
		objTo.appendChild(appendFaceThumb("bonk"));
		objTo.appendChild(appendFaceThumb("fall"));
		objTo.appendChild(appendFaceThumb("dance"));
		objTo.appendChild(appendFaceThumb("swing"));
		objTo.appendChild(appendFaceThumb("blink"));
		objTo.appendChild(appendFaceThumb("blink2"));
		//SOURCES
		objTo.appendChild(appendFaceThumb("source"));
		objTo.appendChild(appendFaceThumb("album"));
		objTo.appendChild(appendFaceThumb("sourcensfw"));
		objTo.appendChild(appendFaceThumb("albumnsfw"));
				
		//SIMPLE SOURCE
		objTo.appendChild(appendFaceThumb("BBSource"));
		objTo.appendChild(appendFaceThumb("CASource"));
		objTo.appendChild(appendFaceThumb("CLSource"));
		objTo.appendChild(appendFaceThumb("CVSource"));
		objTo.appendChild(appendFaceThumb("DDSource"));
		objTo.appendChild(appendFaceThumb("AVSource"));
		objTo.appendChild(appendFaceThumb("SSSource"));
		objTo.appendChild(appendFaceThumb("OtherSource"));
		//ALBUM SOURCE
		objTo.appendChild(appendFaceThumb("BBAlbum"));
		objTo.appendChild(appendFaceThumb("CAAlbum"));
		objTo.appendChild(appendFaceThumb("CLAlbum"));
		objTo.appendChild(appendFaceThumb("CVAlbum"));
		objTo.appendChild(appendFaceThumb("DDAlbum"));
		objTo.appendChild(appendFaceThumb("AVAlbum"));
		objTo.appendChild(appendFaceThumb("SSAlbum"));
		objTo.appendChild(appendFaceThumb("OtherAlbum"));
		//NSFW SOURCE
		objTo.appendChild(appendFaceThumb("BBNSFW"));
		objTo.appendChild(appendFaceThumb("CANSFW"));
		objTo.appendChild(appendFaceThumb("CLNSFW"));
		objTo.appendChild(appendFaceThumb("CVNSFW"));
		objTo.appendChild(appendFaceThumb("DDNSFW"));
		objTo.appendChild(appendFaceThumb("AVNSFW"));
		objTo.appendChild(appendFaceThumb("SSNSFW"));
		objTo.appendChild(appendFaceThumb("OtherNSFW"));
		//NSFW ALBUM
		objTo.appendChild(appendFaceThumb("BBNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("CANSFWAlbum"));
		objTo.appendChild(appendFaceThumb("CLNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("CVNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("DDNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("AVNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("SSNSFWAlbum"));
		objTo.appendChild(appendFaceThumb("OtherNSFWAlbum"));
	}
	else if (subreddit == "schoolidolfestival") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/SchoolIdolFestival/wiki/commentfaces";
		thumbDialWidth = "240px";
		thumbDialHeight = "150px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("umida"));
		objTo.appendChild(appendFaceThumb("iyada"));
		objTo.appendChild(appendFaceThumb("tsun"));
		objTo.appendChild(appendFaceThumb("headpat"));
		objTo.appendChild(appendFaceThumb("kawaii"));
		objTo.appendChild(appendFaceThumb("rekt"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("niconi"));
		objTo.appendChild(appendFaceThumb("rinya"));
		objTo.appendChild(appendFaceThumb("nope"));
		objTo.appendChild(appendFaceThumb("baka"));
		objTo.appendChild(appendFaceThumb("haa"));
		objTo.appendChild(appendFaceThumb("flick"));
		objTo.appendChild(appendFaceThumb("nrekt"));
		objTo.appendChild(appendFaceThumb("dere"));
		objTo.appendChild(appendFaceThumb("ikinya"));
		objTo.appendChild(appendFaceThumb("pillow"));
		objTo.appendChild(appendFaceThumb("fine"));
		objTo.appendChild(appendFaceThumb("clap"));
		objTo.appendChild(appendFaceThumb("pengi"));
		objTo.appendChild(appendFaceThumb("waa"));
		objTo.appendChild(appendFaceThumb("huhu"));
	}
		else if (subreddit == "lovelive") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/LoveLive/wiki/index";
		thumbDialWidth = "190px";
		thumbDialHeight = "115px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("harasho"));
		objTo.appendChild(appendFaceThumb("weird"));
		objTo.appendChild(appendFaceThumb("strange"));
		objTo.appendChild(appendFaceThumb("rinwink"));
		objTo.appendChild(appendFaceThumb("predictable"));
		objTo.appendChild(appendFaceThumb("snack"));
		objTo.appendChild(appendFaceThumb("bang"));
		objTo.appendChild(appendFaceThumb("niconii"));
		objTo.appendChild(appendFaceThumb("washi"));
		objTo.appendChild(appendFaceThumb("rice"));
	}
		else if (subreddit == "onetrueidol") {
		faceIdChar = "#";
		wikiLink.href = "http://www.reddit.com/r/LoveLive/wiki/index";
		thumbDialWidth = "260px";
		thumbDialHeight = "155px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("makibday"));
		objTo.appendChild(appendFaceThumb("makigif"));
		objTo.appendChild(appendFaceThumb("bang"));
		objTo.appendChild(appendFaceThumb("makilove"));
		objTo.appendChild(appendFaceThumb("makipout"));
	}
		else if (subreddit == "fatestaynight") {
		faceIdChar = "#";
		textBoxNr = 3;
		wikiLink.href = "http://www.reddit.com/r/fatestaynight/comments/2vuwdc/comment_faces_guide_v2/";
		thumbDialWidth = "160px";
		thumbDialHeight = "160px";
		bbCodeFunction = function(bbFace, bbTitle, bbUpper, bbLower){
			var bbHover = "";
			var bbCapt = "";
			if (bbTitle != "") {
				bbHover = " \"" + bbTitle + "\"";
			}
			if (bbLower != "") {
				bbCapt = "**" + bbLower + "**";
			}
			if (bbUpper != "") {
				bbCapt = bbCapt + bbUpper;
			}
			return "[" + bbCapt + "](#" + bbFace + bbHover + ")";
		};
		objTo.appendChild(appendFaceThumb("lmao"));
		objTo.appendChild(appendFaceThumb("fistpump"));
		objTo.appendChild(appendFaceThumb("smirk"));
		objTo.appendChild(appendFaceThumb("skeptical"));
		objTo.appendChild(appendFaceThumb("engarde"));
		objTo.appendChild(appendFaceThumb("armorengarde"));
		objTo.appendChild(appendFaceThumb("hmm"));
		objTo.appendChild(appendFaceThumb("hurt"));
		objTo.appendChild(appendFaceThumb("notamused"));
		objTo.appendChild(appendFaceThumb("angry"));
		objTo.appendChild(appendFaceThumb("bored"));
		objTo.appendChild(appendFaceThumb("roar"));
		objTo.appendChild(appendFaceThumb("raspberry"));
		objTo.appendChild(appendFaceThumb("infodump"));
		objTo.appendChild(appendFaceThumb("senpainoticedme"));
		objTo.appendChild(appendFaceThumb("smile"));
		objTo.appendChild(appendFaceThumb("seriously"));
		objTo.appendChild(appendFaceThumb("crying"));
		objTo.appendChild(appendFaceThumb("rejoice"));
		objTo.appendChild(appendFaceThumb("yorokobe"));
		objTo.appendChild(appendFaceThumb("trouble"));
		objTo.appendChild(appendFaceThumb("tooearly"));
		objTo.appendChild(appendFaceThumb("pleased"));
		objTo.appendChild(appendFaceThumb("lol"));
		objTo.appendChild(appendFaceThumb("scared"));
		objTo.appendChild(appendFaceThumb("facepalm"));
		objTo.appendChild(appendFaceThumb("meanie"));
		objTo.appendChild(appendFaceThumb("shocked"));
		objTo.appendChild(appendFaceThumb("coat"));
		objTo.appendChild(appendFaceThumb("cough"));
		objTo.appendChild(appendFaceThumb("pray"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("denied"));
		objTo.appendChild(appendFaceThumb("eyyy"));
		objTo.appendChild(appendFaceThumb("haha"));
		objTo.appendChild(appendFaceThumb("hug"));
		objTo.appendChild(appendFaceThumb("ohoho"));
		objTo.appendChild(appendFaceThumb("please"));
		objTo.appendChild(appendFaceThumb("realization"));
		objTo.appendChild(appendFaceThumb("tch"));
		objTo.appendChild(appendFaceThumb("baka"));
		objTo.appendChild(appendFaceThumb("sigh"));
		objTo.appendChild(appendFaceThumb("success"));
		objTo.appendChild(appendFaceThumb("andmyaxe"));
		objTo.appendChild(appendFaceThumb("messyeater"));
		objTo.appendChild(appendFaceThumb("surpriseblush"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("moar"));
		objTo.appendChild(appendFaceThumb("sly"));
		objTo.appendChild(appendFaceThumb("tickmark"));
		objTo.appendChild(appendFaceThumb("ugh"));
		objTo.appendChild(appendFaceThumb("rip"));
		objTo.appendChild(appendFaceThumb("scary"));
	}
		else if (subreddit == "saber") {
		faceIdChar = "#";
		textBoxNr = 3;
		wikiLink.href = "http://www.reddit.com/r/Saber/comments/2w1g5n/rejoice_you_can_now_have_text_on_sabers_lovely/";
		thumbDialWidth = "160px";
		thumbDialHeight = "160px";
		bbCodeFunction = function(bbFace, bbTitle, bbUpper, bbLower){
			var bbHover = "";
			var bbCapt = "";
			if (bbTitle != "") {
				bbHover = " \"" + bbTitle + "\"";
			}
			if (bbLower != "") {
				bbCapt = "**" + bbLower + "**";
			}
			if (bbUpper != "") {
				bbCapt = bbCapt + bbUpper;
			}
			return "[" + bbCapt + "](#" + bbFace + bbHover + ")";
		};
		objTo.appendChild(appendFaceThumb("saber"));
		objTo.appendChild(appendFaceThumb("hidden"));
		objTo.appendChild(appendFaceThumb("sad"));
		objTo.appendChild(appendFaceThumb("surprised"));
		objTo.appendChild(appendFaceThumb("annoyed"));
		objTo.appendChild(appendFaceThumb("sigh"));
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("sweat"));
		objTo.appendChild(appendFaceThumb("struggle"));
		objTo.appendChild(appendFaceThumb("no"));
		objTo.appendChild(appendFaceThumb("embarrassed"));
		objTo.appendChild(appendFaceThumb("angry"));
		objTo.appendChild(appendFaceThumb("smile"));
		objTo.appendChild(appendFaceThumb("lecture"));
		objTo.appendChild(appendFaceThumb("shocked"));
		objTo.appendChild(appendFaceThumb("worried"));
		objTo.appendChild(appendFaceThumb("casual"));
		objTo.appendChild(appendFaceThumb("bashful"));
		objTo.appendChild(appendFaceThumb("smile2"));
		objTo.appendChild(appendFaceThumb("dayum"));
		objTo.appendChild(appendFaceThumb("flustered"));
		objTo.appendChild(appendFaceThumb("graceful"));
		objTo.appendChild(appendFaceThumb("uninterested"));
		objTo.appendChild(appendFaceThumb("irritated"));
		objTo.appendChild(appendFaceThumb("disappointed"));
		objTo.appendChild(appendFaceThumb("moar"));
		objTo.appendChild(appendFaceThumb("cry"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("furious"));
		objTo.appendChild(appendFaceThumb("hurt"));
		objTo.appendChild(appendFaceThumb("anxious"));
		objTo.appendChild(appendFaceThumb("ashamed"));
		objTo.appendChild(appendFaceThumb("hmm"));
		objTo.appendChild(appendFaceThumb("speechless"));
		objTo.appendChild(appendFaceThumb("engarde"));
		objTo.appendChild(appendFaceThumb("skeptical"));
		objTo.appendChild(appendFaceThumb("ehehe"));
		objTo.appendChild(appendFaceThumb("wary"));
		objTo.appendChild(appendFaceThumb("sad2"));
		objTo.appendChild(appendFaceThumb("saber2"));
		objTo.appendChild(appendFaceThumb("solemn"));
		objTo.appendChild(appendFaceThumb("shocked2"));
		objTo.appendChild(appendFaceThumb("irked"));
		objTo.appendChild(appendFaceThumb("angry2"));
		objTo.appendChild(appendFaceThumb("annoyed2"));
		objTo.appendChild(appendFaceThumb("lecture2"));
		objTo.appendChild(appendFaceThumb("worried2"));
		objTo.appendChild(appendFaceThumb("irritated2"));
		objTo.appendChild(appendFaceThumb("sweat2"));
		objTo.appendChild(appendFaceThumb("smirk"));
		objTo.appendChild(appendFaceThumb("alter"));
		objTo.appendChild(appendFaceThumb("unamused"));
		objTo.appendChild(appendFaceThumb("yesplease"));
    } else if (subreddit == "karanokyoukai") {
		faceIdChar = "#";
		textBoxNr = 3;
		wikiLink.href = "http://www.reddit.com/r/Saber/comments/2w1g5n/rejoice_you_can_now_have_text_on_sabers_lovely/";
		thumbDialWidth = "205px";
		thumbDialHeight = "120px";
		bbCodeFunction = function(bbFace, bbTitle, bbUpper, bbLower){
			var bbHover = "";
			var bbCapt = "";
			if (bbTitle != "") {
				bbHover = " \"" + bbTitle + "\"";
			}
			if (bbLower != "") {
				bbCapt = "**" + bbLower + "**";
			}
			if (bbUpper != "") {
				bbCapt = bbCapt + bbUpper;
			}
			return "[" + bbCapt + "](#" + bbFace + bbHover + ")";
		};
		objTo.appendChild(appendFaceThumb("blush"));
		objTo.appendChild(appendFaceThumb("ohno"));
		objTo.appendChild(appendFaceThumb("face"));
		objTo.appendChild(appendFaceThumb("peace"));
		objTo.appendChild(appendFaceThumb("glum"));
		objTo.appendChild(appendFaceThumb("psychotic"));
		objTo.appendChild(appendFaceThumb("grump"));
		objTo.appendChild(appendFaceThumb("rekt"));
		objTo.appendChild(appendFaceThumb("horror"));
		objTo.appendChild(appendFaceThumb("seensomeshit"));
		objTo.appendChild(appendFaceThumb("itsjustketchup"));
		objTo.appendChild(appendFaceThumb("shipitlikefedex"));
		objTo.appendChild(appendFaceThumb("kawaii"));
		objTo.appendChild(appendFaceThumb("shutuplad"));
		objTo.appendChild(appendFaceThumb("madlaugh"));
		objTo.appendChild(appendFaceThumb("smileforthecamera"));
		objTo.appendChild(appendFaceThumb("memes"));
		objTo.appendChild(appendFaceThumb("tmi"));
		objTo.appendChild(appendFaceThumb("needahug"));
		objTo.appendChild(appendFaceThumb("toukojoestar"));
		objTo.appendChild(appendFaceThumb("notamused"));
		objTo.appendChild(appendFaceThumb("what"));
		objTo.appendChild(appendFaceThumb("bestguy"));
		objTo.appendChild(appendFaceThumb("nonononono"));
		objTo.appendChild(appendFaceThumb("fitemeirl"));
		objTo.appendChild(appendFaceThumb("pray"));
		objTo.appendChild(appendFaceThumb("levelup"));
		objTo.appendChild(appendFaceThumb("punchi"));
		objTo.appendChild(appendFaceThumb("lifepilesup"));
		objTo.appendChild(appendFaceThumb("thankyou"));
		objTo.appendChild(appendFaceThumb("mana"));
		objTo.appendChild(appendFaceThumb("waitwhat"));
		objTo.appendChild(appendFaceThumb("neverturnback"));
		objTo.appendChild(appendFaceThumb("zoom"));
	} else if (subreddit == "nisekoi") {
		faceIdChar = "#";
				textBoxNr = 1;
		wikiLink.href = "http://www.reddit.com/r/Saber/comments/2w1g5n/rejoice_you_can_now_have_text_on_sabers_lovely/";
		thumbDialWidth = "180px";
		thumbDialHeight = "230px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("cute"));
		objTo.appendChild(appendFaceThumb("blaze"));
		objTo.appendChild(appendFaceThumb("nono"));
		objTo.appendChild(appendFaceThumb("blushing"));
		objTo.appendChild(appendFaceThumb("pff"));
		objTo.appendChild(appendFaceThumb("eh"));
		objTo.appendChild(appendFaceThumb("smirk"));
		objTo.appendChild(appendFaceThumb("rain"));
		objTo.appendChild(appendFaceThumb("misunderstood"));
		objTo.appendChild(appendFaceThumb("flustered"));
		objTo.appendChild(appendFaceThumb("embarrassed"));
		objTo.appendChild(appendFaceThumb("alright"));
		objTo.appendChild(appendFaceThumb("stutter"));
		objTo.appendChild(appendFaceThumb("moping"));
		objTo.appendChild(appendFaceThumb("mmmm"));
		objTo.appendChild(appendFaceThumb("kawaii"));
		objTo.appendChild(appendFaceThumb("couch"));
		objTo.appendChild(appendFaceThumb("ohmy"));
		objTo.appendChild(appendFaceThumb("chibi"));
		objTo.appendChild(appendFaceThumb("ontheway"));
		objTo.appendChild(appendFaceThumb("tooembarrassed"));
		objTo.appendChild(appendFaceThumb("turnaround"));
		objTo.appendChild(appendFaceThumb("shush"));
		objTo.appendChild(appendFaceThumb("outofit"));
		objTo.appendChild(appendFaceThumb("smile"));
		objTo.appendChild(appendFaceThumb("thumbsup"));
		objTo.appendChild(appendFaceThumb("grin"));
		objTo.appendChild(appendFaceThumb("yougotthis"));
		objTo.appendChild(appendFaceThumb("ah"));
		objTo.appendChild(appendFaceThumb("yay"));
	} else if (subreddit == "onetruebiribiri") {
		faceIdChar = "#";
		textBoxNr = 1;
		wikiLink.href = "http://www.reddit.com/r/OneTrueBiribiri/comments/2eyml8/110_subscribers_yay_comment_faces_and_spoiler/";
		thumbDialWidth = "125px";
		thumbDialHeight = "90px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
			objTo.appendChild(appendFaceThumb("angry"));
			objTo.appendChild(appendFaceThumb("crying"));
			objTo.appendChild(appendFaceThumb("curious"));
			objTo.appendChild(appendFaceThumb("eh?"));
			objTo.appendChild(appendFaceThumb("electricity"));
			objTo.appendChild(appendFaceThumb("flower-blush"));
			objTo.appendChild(appendFaceThumb("not-amused"));
			objTo.appendChild(appendFaceThumb("railgun"));
			objTo.appendChild(appendFaceThumb("right"));
			objTo.appendChild(appendFaceThumb("worried"));
	} else if (subreddit == "onetruetohsaka") {
		faceIdChar = "#";
		textBoxNr = 1;
		wikiLink.href = "https://www.reddit.com/r/OneTrueTohsaka";
		thumbDialWidth = "160px";
		thumbDialHeight = "160px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
			objTo.appendChild(appendFaceThumb("agitated"));
			objTo.appendChild(appendFaceThumb("angry"));
			objTo.appendChild(appendFaceThumb("bigblush"));
			objTo.appendChild(appendFaceThumb("bigglare"));
			objTo.appendChild(appendFaceThumb("bigsmile"));
			objTo.appendChild(appendFaceThumb("blush"));
			objTo.appendChild(appendFaceThumb("carefree"));
			objTo.appendChild(appendFaceThumb("embarrased"));
			objTo.appendChild(appendFaceThumb("enraged"));
			objTo.appendChild(appendFaceThumb("facepalm"));
			objTo.appendChild(appendFaceThumb("frown"));
			objTo.appendChild(appendFaceThumb("ignore"));
			objTo.appendChild(appendFaceThumb("nervous"));
			objTo.appendChild(appendFaceThumb("ponder"));
			objTo.appendChild(appendFaceThumb("serious"));
			objTo.appendChild(appendFaceThumb("sigh"));
			objTo.appendChild(appendFaceThumb("hug"));
			objTo.appendChild(appendFaceThumb("stop"));
			objTo.appendChild(appendFaceThumb("straightface"));
			objTo.appendChild(appendFaceThumb("suprised"));
	} else if (subreddit == "esdeath") {
		faceIdChar = "#";
		textBoxNr = 1;
		wikiLink.href = "https://www.reddit.com/r/Esdeath/comments/2iebyh/comment_faces/";
		thumbDialWidth = "160px";
		thumbDialHeight = "160px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
			objTo.appendChild(appendFaceThumb("pleased"));
			objTo.appendChild(appendFaceThumb("followme"));
			objTo.appendChild(appendFaceThumb("smug"));
			objTo.appendChild(appendFaceThumb("grin"));
			objTo.appendChild(appendFaceThumb("notamused"));
			objTo.appendChild(appendFaceThumb("hug"));
			objTo.appendChild(appendFaceThumb("blush"));
			objTo.appendChild(appendFaceThumb("kiss"));
			objTo.appendChild(appendFaceThumb("blush2"));
			objTo.appendChild(appendFaceThumb("listenhere"));
			objTo.appendChild(appendFaceThumb("hmm"));
			objTo.appendChild(appendFaceThumb("shocked"));
			objTo.appendChild(appendFaceThumb("forgiveness"));
			objTo.appendChild(appendFaceThumb("stabby"));
			objTo.appendChild(appendFaceThumb("notamused2"));
			objTo.appendChild(appendFaceThumb("yadonefuckedup"));
			objTo.appendChild(appendFaceThumb("lol"));
			objTo.appendChild(appendFaceThumb("sad"));
			
	} else if (subreddit == "gamindustri") {
		faceIdChar = "#";
		textBoxNr = 3;
		wikiLink.href = "http://www.reddit.com/r/gamindustri/comments/8sjxmk/the_new_comment_faces_are_here/";
		thumbDialWidth = "160px";
		thumbDialHeight = "160px";
		bbCodeFunction = function(bbFace, bbTitle, bbUpper, bbLower){
			var bbHover = "";
			var bbCapt = "";
			if (bbTitle != "") {
				bbHover = " \"" + bbTitle + "\"";
			}
			if (bbLower != "") {
				bbCapt = "**" + bbLower + "**";
			}
			if (bbUpper != "") {
				bbCapt = bbCapt + bbUpper;
			}
			return "[" + bbCapt + "](#" + bbFace + bbHover + ")";
		};
		objTo.appendChild(appendFaceThumb("trollface"));
		objTo.appendChild(appendFaceThumb("disappointed"));
		objTo.appendChild(appendFaceThumb("oooh"));
		objTo.appendChild(appendFaceThumb("sad"));
		objTo.appendChild(appendFaceThumb("shock"));
		objTo.appendChild(appendFaceThumb("smile"));
		objTo.appendChild(appendFaceThumb("smirk"));
		objTo.appendChild(appendFaceThumb("wink"));
		objTo.appendChild(appendFaceThumb("awman"));
		objTo.appendChild(appendFaceThumb("bear"));
		objTo.appendChild(appendFaceThumb("chu"));
		objTo.appendChild(appendFaceThumb("crying"));
		objTo.appendChild(appendFaceThumb("eh"));
		objTo.appendChild(appendFaceThumb("er"));
		objTo.appendChild(appendFaceThumb("holdme"));
		objTo.appendChild(appendFaceThumb("peace"));
		objTo.appendChild(appendFaceThumb("rage"));
		objTo.appendChild(appendFaceThumb("raspberry"));
		objTo.appendChild(appendFaceThumb("really"));
		objTo.appendChild(appendFaceThumb("saywhat"));
		objTo.appendChild(appendFaceThumb("shock2"));
		objTo.appendChild(appendFaceThumb("sigh"));
		objTo.appendChild(appendFaceThumb("trouble"));
		objTo.appendChild(appendFaceThumb("uhoh"));
		objTo.appendChild(appendFaceThumb("smug"));
		objTo.appendChild(appendFaceThumb("cry"));
		objTo.appendChild(appendFaceThumb("salute"));
		objTo.appendChild(appendFaceThumb("puddingasm"));
		objTo.appendChild(appendFaceThumb("moe"));
		objTo.appendChild(appendFaceThumb("ababababa"));
		objTo.appendChild(appendFaceThumb("angry"));
		objTo.appendChild(appendFaceThumb("jealous"));
		objTo.appendChild(appendFaceThumb("triggered"));
		objTo.appendChild(appendFaceThumb("terrified"));
		objTo.appendChild(appendFaceThumb("mad"));
		objTo.appendChild(appendFaceThumb("snide"));
	} else if (subreddit == "kancolle") {
		faceIdChar = "#";
		textBoxNr = 1;
		wikiLink.href = "https://www.reddit.com/r/kancolle/wiki/commentflair";
		thumbDialWidth = "240px";
		thumbDialHeight = "190px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("akagi"));
		objTo.appendChild(appendFaceThumb("aki"));
		objTo.appendChild(appendFaceThumb("dai"));
		objTo.appendChild(appendFaceThumb("dead"));
		objTo.appendChild(appendFaceThumb("den"));
		objTo.appendChild(appendFaceThumb("goya1"));
		objTo.appendChild(appendFaceThumb("goya2"));
		objTo.appendChild(appendFaceThumb("goya3"));
		objTo.appendChild(appendFaceThumb("hachi1"));
		objTo.appendChild(appendFaceThumb("hatsu"));
		objTo.appendChild(appendFaceThumb("hiei1"));
		objTo.appendChild(appendFaceThumb("hiei2"));
		objTo.appendChild(appendFaceThumb("hiei3"));
		objTo.appendChild(appendFaceThumb("iku1"));
		objTo.appendChild(appendFaceThumb("iku2"));
		objTo.appendChild(appendFaceThumb("iku3"));
		objTo.appendChild(appendFaceThumb("imuya"));
		objTo.appendChild(appendFaceThumb("jintsuu"));
		objTo.appendChild(appendFaceThumb("junyou"));
		objTo.appendChild(appendFaceThumb("kaga"));
		objTo.appendChild(appendFaceThumb("kaga2"));
		objTo.appendChild(appendFaceThumb("kongou"));
		objTo.appendChild(appendFaceThumb("lessbait"));
		objTo.appendChild(appendFaceThumb("maruyu"));
		objTo.appendChild(appendFaceThumb("naka"));
		objTo.appendChild(appendFaceThumb("no"));
		objTo.appendChild(appendFaceThumb("okay"));
		objTo.appendChild(appendFaceThumb("ooyodo"));
		objTo.appendChild(appendFaceThumb("patches"));
		objTo.appendChild(appendFaceThumb("pjsalt"));
		objTo.appendChild(appendFaceThumb("pot"));
		objTo.appendChild(appendFaceThumb("sendai"));
		objTo.appendChild(appendFaceThumb("shima"));
		objTo.appendChild(appendFaceThumb("shioi"));
		objTo.appendChild(appendFaceThumb("shioi2"));
		objTo.appendChild(appendFaceThumb("sleep"));
		objTo.appendChild(appendFaceThumb("sleep2"));
		objTo.appendChild(appendFaceThumb("ttk"));
		objTo.appendChild(appendFaceThumb("ura"));
		objTo.appendChild(appendFaceThumb("yari"));
		objTo.appendChild(appendFaceThumb("yayoi"));
		objTo.appendChild(appendFaceThumb("yes"));
		objTo.appendChild(appendFaceThumb("yuki"));
		objTo.appendChild(appendFaceThumb("yuudachi1"));
		objTo.appendChild(appendFaceThumb("yuudachi2"));
		objTo.appendChild(appendFaceThumb("akaensei"));
		objTo.appendChild(appendFaceThumb("beaver"));
		objTo.appendChild(appendFaceThumb("bubbles"));
		objTo.appendChild(appendFaceThumb("chikumask"));
		objTo.appendChild(appendFaceThumb("dokan"));
		objTo.appendChild(appendFaceThumb("elephant"));
		objTo.appendChild(appendFaceThumb("hibishrug"));
		objTo.appendChild(appendFaceThumb("idlebunny"));
		objTo.appendChild(appendFaceThumb("kenka"));
		objTo.appendChild(appendFaceThumb("kuchikumaru"));
		objTo.appendChild(appendFaceThumb("monitor"));
		objTo.appendChild(appendFaceThumb("passagro"));
		objTo.appendChild(appendFaceThumb("raiden"));
		objTo.appendChild(appendFaceThumb("whackamyou"));
		objTo.appendChild(appendFaceThumb("yamaintro"));
		objTo.appendChild(appendFaceThumb("zuicocky"));
	} else if (subreddit == "leagueoflegends") {
		faceIdChar = "#";
		textBoxNr = 1;
		wikiLink.href = "https://www.reddit.com/r/kancolle/wiki/commentflair";
		thumbDialWidth = "110px";
		thumbDialHeight = "110px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("face-wink"));
		objTo.appendChild(appendFaceThumb("face-ok"));
		objTo.appendChild(appendFaceThumb("face-palm"));
		objTo.appendChild(appendFaceThumb("face-angry"));
		objTo.appendChild(appendFaceThumb("face-cry"));
		objTo.appendChild(appendFaceThumb("face-success"));
		objTo.appendChild(appendFaceThumb("face-draaaven"));
		objTo.appendChild(appendFaceThumb("face-fiteme"));
		objTo.appendChild(appendFaceThumb("face-love"));
		objTo.appendChild(appendFaceThumb("face-yuck"));
		objTo.appendChild(appendFaceThumb("face-dwi"));
		objTo.appendChild(appendFaceThumb("face-flip"));
		objTo.appendChild(appendFaceThumb("face-party"));
		objTo.appendChild(appendFaceThumb("face-tear"));
		objTo.appendChild(appendFaceThumb("face-troll"));
		objTo.appendChild(appendFaceThumb("face-support"));
		objTo.appendChild(appendFaceThumb("face-yeah"));
		objTo.appendChild(appendFaceThumb("face-eww"));
		objTo.appendChild(appendFaceThumb("face-wat"));
		objTo.appendChild(appendFaceThumb("face-yandere"));
		objTo.appendChild(appendFaceThumb("face-popcorn"));
		objTo.appendChild(appendFaceThumb("face-happy"));
		objTo.appendChild(appendFaceThumb("face-fabulous"));
		objTo.appendChild(appendFaceThumb("face-sleepy"));
		objTo.appendChild(appendFaceThumb("face-whoa"));
		objTo.appendChild(appendFaceThumb("face-aliens"));
		objTo.appendChild(appendFaceThumb("face-hmm"));
		objTo.appendChild(appendFaceThumb("face-crickets"));
	} else if (subreddit == "chibi") {
		faceIdChar = "#";
		wikiLink.href = "https://www.reddit.com/r/Chibi/comments/6d63kk/comment_faces_are_on_the_way/";
		thumbDialWidth = "140px";
		thumbDialHeight = "140px";
		bbCodeFunction = function(bbFace, bbTitle){
			if (bbTitle == "") {
				return "[](#" + bbFace + ")";
			} else {
				return "[](#" + bbFace + " \"" + bbTitle + "\")";
			}
		};
		objTo.appendChild(appendFaceThumb("flustered"));
		objTo.appendChild(appendFaceThumb("itai"));
		objTo.appendChild(appendFaceThumb("listening"));
		objTo.appendChild(appendFaceThumb("bleh"));
		objTo.appendChild(appendFaceThumb("senpai"));
		objTo.appendChild(appendFaceThumb("ooo"));
		objTo.appendChild(appendFaceThumb("fufu"));
		objTo.appendChild(appendFaceThumb("uhoh"));
		objTo.appendChild(appendFaceThumb("gab"));
	}
}

function hideSelect() {
	awwFacedDialogObj.style.display = "none";
}

function getStorage(key) {
	if (localStorage.getItem("commentfaces_settings") == null) {
		localStorage.setItem("commentfaces_settings", JSON.stringify(storageSettings));
	}
	storageSettings = JSON.parse(localStorage.getItem("commentfaces_settings"));
	return storageSettings[key];
}

function setStorage(key, value) {
	if (localStorage.getItem("commentfaces_settings") == null) {
		localStorage.setItem("commentfaces_settings", JSON.stringify(storageSettings));
	}
	storageSettings = JSON.parse(localStorage.getItem("commentfaces_settings"));
	storageSettings[key] = value;
	localStorage.setItem("commentfaces_settings", JSON.stringify(storageSettings));
}

function showSelect(thisLink) {
	var inputTextFields = document.getElementsByTagName("textarea");
	for (var i = 0; i < inputTextFields.length; i++) {
		if (thisLink.parentNode.previousSibling.firstChild == inputTextFields[i]) selectedText.boxIndex = i;
	}
	selectedText.start = inputTextFields[selectedText.boxIndex].selectionStart;
	selectedText.length = inputTextFields[selectedText.boxIndex].selectionEnd - inputTextFields[selectedText.boxIndex].selectionStart;
	console.log("Box index: " + selectedText.boxIndex + ", selection start: " + selectedText.start + ", selection length: " + selectedText.length);
	if (divAlreadyShown == false) createFacesDiv();
	/*if (localStorage.getItem("aww2_top") == null || localStorage.getItem("aww2_left") == null || localStorage.getItem("aww2_width") == null || localStorage.getItem("aww2_height") == null) {
		localStorage.setItem("aww2_width", 842);
		localStorage.setItem("aww2_height", 500);
		localStorage.setItem("aww2_top", Math.round((window.innerHeight-500)/2));
		localStorage.setItem("aww2_left", Math.round((window.innerWidth-842)/2));
		changeSize(localStorage.getItem("aww2_top"), localStorage.getItem("aww2_left"), localStorage.getItem("aww2_width"), localStorage.getItem("aww2_height"));
	}*/
	if (((getStorage("top") + getStorage("height")) < window.innerHeight) && ((getStorage("left") + getStorage("width")) < window.innerWidth)) {
		changeSize(getStorage("top"), getStorage("left"), getStorage("width"), getStorage("height"));
	}
	else {
		console.log("Faces dialog cannot fit into the browser window. Temporarily sizing and moving the dialog...");
		changeSize((window.innerHeight-350)/2, (window.innerWidth-692)/2, "692", "350");
	}
	console.log("Window width: " + window.innerWidth + "px");
	awwFacedDialogObj.style.display = "block";
}

function main() {
	//if user changed dialog properties...
	console.log("Awwfaces begin")
	var bottomArea = document.getElementsByClassName("bottom-area");
	console.log("bottom area: " + bottomArea.length);
	for (var i = 0; i < bottomArea.length; i++) {
		var showDialogLink = document.createElement("a");
		showDialogLink.innerHTML = "Add a comment face";
		showDialogLink.style.cursor = "pointer";
		showDialogLink.className = "addFaceLink reddiquette";
		bottomArea[i].insertBefore(showDialogLink, bottomArea[i].childNodes[3]);
	}
	appendListenerToLink();
	appendListenerToReply();
}

function appendListenerToLink() {
	console.log("Appending listener to 'Add Faces' links");
	var links = document.getElementsByClassName("addFaceLink");
	console.log("Found " + links.length + " 'add' link(s)");
	for (var i = 0; i < links.length; i++) {
		//also known as I have no fucking idea how this fixed the issue, I was just mashing my keyboard and refreshing the page.
		//most likely still to newbie wannabe to understand what `this` keyword really means.
		var xthis = links[i];
		links[i].addEventListener("click", function(){showSelect(xthis)});
	}
}

function appendListenerToReply() {
	console.log("Appending listener to 'reply' links");
	var links = document.getElementsByClassName("reply-button");
	console.log("reply-button length: " + links.length);
	for (var i = 0; i < links.length; i++) {
		console.log("appending listener to reply...")
		links[i].childNodes[0].addEventListener("click", function(){appendListenerToLink();});
	}
}

main();
