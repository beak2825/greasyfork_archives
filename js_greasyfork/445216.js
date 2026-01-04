// ==UserScript==
// @name        Dim overly bright webpages (remove white background)
// @name:hu        Túlzottan világos weboldalak elhalványítása (fehér háttér eltávolítása)
// @description	Dims bright webpages. Intended to be used with a _light_ theme, i.e. the background should be lighter than the text (but it can be medium grey or anything). 
// @description:hu	Elsötétíti a világos weboldalakat. _Világos_ témával való használatra készült, azaz a háttérnek világosabbnak kell lennie, mint a szövegnek (de lehet középszürke vagy bármi).
// @version     18.2
// @grant       none
// @match	http://*/*
// @match	https://*/*
// @match	file://*/*
// @license	CC0
// @exclude	https://www.messenger.com*
// @exclude	https://gepigeny.hu/*
// @exclude	https://skribbl.io/*
// @exclude	https://open.spotify.com/*
// @exclude	https://discord.com/*
// Skribbl is excluded because the script is known to break that site (render the colors grey) and uh yeah.
// @namespace	me.adventuretc
// @homepage	https://greasyfork.org/hu/scripts/445216-remove-ffffff-background/
// @run-at document-start
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @grant GM.registerMenuCommand
// @grant window.onurlchange
// Ezzel azt akarom elérni hogy a clipboard-ra teszem a generált CSS-t a popup alert helyett. // TODO
// @downloadURL https://update.greasyfork.org/scripts/445216/Dim%20overly%20bright%20webpages%20%28remove%20white%20background%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445216/Dim%20overly%20bright%20webpages%20%28remove%20white%20background%29.meta.js
// ==/UserScript==
// For userscript-specific things see:
//https://www.tampermonkey.net/documentation.php
//https://wiki.greasespot.net/GM.registerMenuCommand
//https://stackoverflow.com/questions/56024629/what-is-the-accesskey-parameter-of-gm-registermenucommand-and-how-to-use-it


//GM_registerMenuCommand(name, fn, accessKey);
	//Arguments

	//caption
	    //String The caption to display on the menu item.
	//commandFunc
	    //Function The function to call when this menu item is selected by the user.
	//accessKey
	    //String A single character that can be used to select command when the menu is open. It should be a letter in the caption. [1]

//GM_addStyle(css)
//Adds the given style to the document and returns the injected style element.
//GM_setValue(name, value)
//Set the value of 'name' to the storage.
//GM_getValue(name, defaultValue)
//Get the value of 'name' from storage.
//GM_deleteValue(name)
//Deletes 'name' from storage.


//GM_registerMenuCommand("Dsa d", learnThisPage, "d");
//GM_registerMenuCommand("Dsaa", learnThisPage, "s");
//GM_registerMenuCommand("Dsaaa", removeStoredDataForThisWebsite, "a");
//Egyáltalán nem működik ez. Ezt a hibát kapom: Legalábbis firefox alatt. Chrome alatt nem próbáltam.
//Uncaught (in promise) ReferenceError: GM_registerMenuCommand is not defined



var generateCssOutput = false;
//generateCssOutput = true;  // delete this line or comment it out

var generateLocalstorageCssOutput = true;
var forceReGenerateLocalstorageCss = false; //  This should be ran occasionally, when the saved CSS seems to be broken (e.g. the website has changed design).

var darkTheme = false;
if (darkTheme)
{
	//.... TODO 
}


const storageKey = "me.adventuretc.removeFFFFFFBg.userstyleCSS";

const brightestAcceptableFontColorSpecifiedAsAverageRgbValue = 100; // Igazából ezzel hibát vétesz, mert lehet hogy valaki sötét témát használ és annál ez rosszul fog működni.
const brightestAcceptableBackgroundColorSpecifiedAsAverageRgbValue = 230; // Igazából ezzel hibát vétesz, mert lehet hogy valaki sötét témát használ és annál ez rosszul fog működni.
const brightestAcceptableHyperlinkColorSpecifiedAsAverageRgbValue = 100; // Igazából ezzel hibát vétesz, mert lehet hogy valaki sötét témát használ és annál ez rosszul fog működni.

// Rájöttem, hogy ha csak 1x futtatom le és nem 2x, akkor sokkal kevesebb idő betölteni bizonyos honlapokat, pl. Alza, Viszlaysport. Azt hiszem, az az oka, hogy az első körben rámegy egy csomó attribútum az elemekre és a második körben ezeket mind újra feldolgozza a script. Ezt úgy lehetne kikerülni, hogy megcímkézem vagy kikerülöm valahogy azokat amiket már módosítottam.




setTimeout( addbuttons, 3000);

function addbuttons()
{
							
	// Create a button element
	var button = document.createElement('button');

	// Set the button text to 'Can you click me?'
	button.innerText = 'Learn';

	button.id = 'mainButton';
	// Attach the "click" event to your button
	button.addEventListener('click', learnThisPage);
	button.addEventListener('click', applyFixBasedOnPreGeneratedSavedCssProfile);

	// Add the button to your HTML <body> tag
	document.body.appendChild(button);
	
	// Create a button element
	button = document.createElement('button');

	// Set the button text to 'Can you click me?'
	button.innerText = 'Remove data (for this website)';

	button.id = 'mainButton';
	// Attach the "click" event to your button
	button.addEventListener('click', removeStoredDataForThisWebsite);

	// Add the button to your HTML <body> tag
	document.body.appendChild(button);
	

}



applyFixBasedOnPreGeneratedSavedCssProfile();

if (window.onurlchange === null)
{
    // feature is supported
    window.addEventListener('urlchange', (info) => applyFixBasedOnPreGeneratedSavedCssProfile());
}

async function applyFixBasedOnPreGeneratedSavedCssProfile()
{
	// If the key is already set, load the data from it. "The getItem method in the WebStorage specification, explicitly returns null if the item does not exist:"
	var alreadyHasEntryInLocalStorage = localStorage.getItem(storageKey) !== null;
	if (alreadyHasEntryInLocalStorage && !forceReGenerateLocalstorageCss)
	{
		var cssLoadedFromLocalstorage = localStorage.getItem(storageKey);
		
		addCSS(cssLoadedFromLocalstorage);
		
		//alert("loading");
		//alert(cssLoadedFromLocalstorage);
	}
	else
	{
		//https://stackoverflow.com/questions/3586775/what-is-the-correct-way-to-check-for-string-equality-in-javascript
		if (window.location.host.trim() == "telex.hu")
		{
			setTimeout(function () { 
					learnThisPage(); 
					applyFixBasedOnPreGeneratedSavedCssProfile();
				}, 3000);
		}
		else if (window.location.host.trim() == "discord.com")
		{
			setTimeout(function () { 
					learnThisPage(); 
					applyFixBasedOnPreGeneratedSavedCssProfile();
				}, 10000);
		}
		else if (window.location.host.trim() == "www.google.com")
		{
			setTimeout(function () { 
					learnThisPage(); 
					applyFixBasedOnPreGeneratedSavedCssProfile();
				}, 3000);
		}
		else if (window.location.host.trim() == "www.messenger.com")
		{
			setTimeout(function () { 
					learnThisPage(); 
					applyFixBasedOnPreGeneratedSavedCssProfile();
				}, 10000);
		}
		else 
		{
			//learnThisPage();
			
			// with the new CSS-appending method, it's important to wait for the whole website to load before starting.
			setTimeout(function () { 
					learnThisPage(); 
					applyFixBasedOnPreGeneratedSavedCssProfile();
				}, 3000);
		}
	}
}

// If it already has stored data for it, load it, then learn the current page and ADD data to the profile (ie extend it).
async function learnThisPage() // TODO split this method into two
{
	var cssOutput = "";
	var localstorageCssOutputcssOutput = "";
	
	
	var cssLoadedFromLocalstorage;
	
	
	var alreadyHasEntryInLocalStorage = localStorage.getItem(storageKey) !== null;
	if (alreadyHasEntryInLocalStorage && !forceReGenerateLocalstorageCss)
	{
		cssLoadedFromLocalstorage = localStorage.getItem(storageKey);
		
		addCSS(cssLoadedFromLocalstorage);
		
		cssOutput = cssLoadedFromLocalstorage;
		//alert("loading");
		//alert(cssLoadedFromLocalstorage);
	}
	
	
	var fixedTags = ["main", "article", "body", "div", "span", "html", "textarea", "input", "select", "code", "pre", "section", "li", "ul", "nav", "a", "table", "header", "ol"];

	for (var i = 0; i < fixedTags.length; ++i) {
		var v = fixedTags[i];


		for (var y = 0; y < gettag(v).length; ++y) {
			if (!gettag(v)[y])
			{
				continue;
			}

			// element to be observed
			var observed = gettag(v)[y];
			// element to be changed
			var changed = gettag(v)[y];

			var style = window.getComputedStyle(observed);
			//var defaultStyle = window.getDefaultComputedStyle(observed);

			var backgroundColor = style.getPropertyValue("background-color");
			//var defaultBackgroundColor = defaultStyle.getPropertyValue("background-color");



			if (backgroundColor === "transparent" && hasStyledBackground(observed) == false) {
				// Kapjuk meg az első színezett szülejét.
				var parent = findUpColoredBackground(observed); //find first parent with color

				// Ha volt színezett szülő.
				if (parent) {
					observed = parent;
				}
				else {
					continue;
				}
			}

			style = window.getComputedStyle(observed);
			//defaultStyle = window.getDefaultComputedStyle(observed);

			backgroundColor = style.getPropertyValue("background-color");
			var foregroundColor = style.getPropertyValue("color");
			//defaultBackgroundColor = defaultStyle.getPropertyValue("background-color");


			
			var statementText = "";
			
			if (average(rgbArray(backgroundColor)) >= brightestAcceptableBackgroundColorSpecifiedAsAverageRgbValue && average(rgbArray(foregroundColor)) >= brightestAcceptableHyperlinkColorSpecifiedAsAverageRgbValue )
			{
				// All links should be reset to color default.
				if (fixedTags[i] == "a") 
				{
					//changed.style.color = "initial"; Ezt ne használd.
					//changed.style.color = "-moz-hyperlinktext";
					
					statementText += "color: var(--var-dimbrightwebpages-hyperlink-color) !important; \n";
				}
			}
			// debug:
			//console.log(backgroundColor);

			//-// if the webpage specified some background and its bright white-ish or transparent.
			// if the webpage specified some background and its NOT transparent.
			if 
			(
				hasStyledBackground(observed) && average(rgbArray(backgroundColor)) >= brightestAcceptableBackgroundColorSpecifiedAsAverageRgbValue 
				//||
				//hasStyledBackground(observed) && backgroundColor === "transparent"
			)
			{
				// Mozilla Color Preference Extensions
				// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

				//changed.style.backgroundColor = "initial"; Ezt ne használd. Lásd a leírásomat.
				//changed.style.backgroundColor = "-moz-default-background-color";
				statementText += "background-color: var(--var-dimbrightwebpages-background-color) !important; \n";
				
				
				 
				if (average(rgbArray(foregroundColor)) >= brightestAcceptableFontColorSpecifiedAsAverageRgbValue )
				{
					//changed.style.color = "initial"; Ezt ne használd. Lásd a leírásomat.
					//changed.style.color = "-moz-default-color";
					statementText += "color: var(--var-dimbrightwebpages-font-color) !important; \n";
					
				}
				
				
				 if (generateCssOutput || generateLocalstorageCssOutput)
				 {
					//window.alert(changed.tagName);
					//window.alert(changed.id);
					//window.alert(changed.className);
					
					var selectorText = "";
					
					if (changed.id)
					{
						selectorText += `#${changed.id}`
					}
					else if (changed.className)
					{
						var classes = changed.className.replaceAll(" ",".");
						selectorText += `.${classes}`
						
					}
					else if (changed.tagName)
					{
						selectorText += `${changed.tagName}`
						// The problem here is, the CSS rule create isn't specific enough and sometimes colors all "A" or DIV tags on a page which breaks it.
						// So let's try to include the parent tag in the selector as well.
						
						var parent2 = changed.parentElement;
						
						if (parent2)
						{
							if (parent2.id)
							{
								selectorText = `#${parent2.id}>` + selectorText;
							}
							else if (parent2.className)
							{
								var classes2 = parent2.className.replaceAll(" ",".");
								selectorText = `.${classes2}>` + selectorText;
								
							}
							else if (parent2.tagName)
							{
								selectorText = `${parent2.tagName}>` + selectorText;
							}
						}
						
					}
					
					
	//background-color: initial !important;
	//color: initial !important;
					//var text = `${selectorText}
//{
	//background-color: -moz-default-background-color !important;
	//color: -moz-default-color !important;
//}`

					var text = `${selectorText}
{
	${statementText}
}`

					// I see duplicates. Remove them.
					if (cssOutput.includes(text) == false)
					{
						cssOutput = cssOutput + "\n"+ text;
					}
				 }
				 
				 



				//if (style.color === defaultStyle.color) //but not foreground
				//{
				//if ( average( rgbArray(backgroundColor) ) > 127  )
				//{
				//changed.style.color = "#000";
				//}
				//else
				//{
				//changed.style.color = "#FFF";
				//}

				//if (backgroundColor === "transparent")
				//{
				//changed.style.color = "#000";
				//}
				//}
			}

		}
	}
	
	 if (generateCssOutput)
	 {
		window.alert("paste this text into a blank userstyle:\n" +cssOutput);
	 }
	 if (generateLocalstorageCssOutput)
	 {
		localStorage.setItem(storageKey, cssOutput);
		 
		//alert("saving");
		//alert(cssOutput);
		 
		//return localStorage.getItem(storageKey);
	 }

}

function average(someArr) {
	var sum = 0;

	for (var i = 0; i < someArr.length; ++i) {
		sum += parseInt(someArr[i]);
	}

	return (sum / someArr.length);
}

function rgbArray(rgb)
{
	rgb = rgb.replace(/[^\d,]/g, '').split(',');

	return rgb;
}

function gettag(s)
{
	return document.getElementsByTagName(s);
}

 //-//Minden módosított háttérszínű elemet meg kell találni, akkor is ha a háttér színe "transparent".
// Minden módosított háttérszínű elemet meg kell találni, kivéve ha a háttér színe "transparent".
function findUpColoredBackground(el)
{
	while (el.parentNode)
	{
		el = el.parentNode;
		
		if (hasStyledBackground(el)) //webpage specified some background
		{
			//return el;
			var style = window.getComputedStyle(el);
			var backgroundColor = style.getPropertyValue("background-color");
			if (backgroundColor !== "transparent")
			{
				return el;
			}
		}
	}
	return null;
}

function hasStyledBackground(element)
{
	var style = window.getComputedStyle(element);
	var defaultStyle = window.getDefaultComputedStyle(element);

	var backgroundColor = style.getPropertyValue("background-color");
	var defaultBackgroundColor = defaultStyle.getPropertyValue("background-color");

	var backgroundImage = style.getPropertyValue("background-image");
	var defaultBackgroundImage = defaultStyle.getPropertyValue("background-image");

	if (backgroundColor !== defaultBackgroundColor) {
		return true;
	}

	if (backgroundImage !== defaultBackgroundImage) {
		return true;
	}

	return false;
}




function addCSS(css)
{
	
	
	// Usage: 
	//addCSS("body{ background:red; }")
	// https://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript

	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	} else if (typeof addStyle != "undefined") {
		addStyle(css);
	} 
	else 
	{
		if (document.head)
		{
			document.head.appendChild(document.createElement("style")).innerHTML=css;
		}
		//var node = document.createElement("style");
		//node.type = "text/css";
		//node.appendChild(document.createTextNode(css));
		//var heads = document.getElementsByTagName("head");
		//if (heads.length > 0) {
			//heads[0].appendChild(node);
		//} 
		else
		{
			// no head yet, stick it whereever
			document.documentElement.appendChild(document.createElement("style")).innerHTML=css;
		}
	}
}



function removeStoredDataForThisWebsite()
{
	localStorage.removeItem(storageKey);
}


