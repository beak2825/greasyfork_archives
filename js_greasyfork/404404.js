// ==UserScript==
// @name         Redbubble Get Promotional Image URLs
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Gets urls for all promo images from a RedBubble promotion page and saves a txt file contianing urls
// @author       Dylan Banta
// @match        https://www.redbubble.com/studio/promote/*
// @require 	 https://greasyfork.org/scripts/404462-my-logger-util/code/My_Logger_Util.js?version=812560
// @require 	 https://greasyfork.org/scripts/404600-my-general-utils/code/My_General_Utils.js?version=812567
// @require 	 https://greasyfork.org/scripts/404687-file-saver-util/code/File_Saver_Util.js?version=812568
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require 	 https://greasyfork.org/scripts/404687-file-saver-util/code/File_Saver_Util.js?version=812564
// @resource 	 customCSS https://raw.githubusercontent.com/DylanBanta/Tampermonkey/master/RedBubble_Get_Promotional_Image_URLs/savebtn.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/404404/Redbubble%20Get%20Promotional%20Image%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/404404/Redbubble%20Get%20Promotional%20Image%20URLs.meta.js
// ==/UserScript==

var productNum = 1;
var urlArr = [];

//Custom css
var cssTxt = GM_getResourceText("customCSS");
GM_addStyle(cssTxt);

//Calls custom log util
function log(logs, forceOn) {
    var call = log.caller.name; //get caller function
    var debug = true;
    logger(logs, debug, call, forceOn);
}

//will be run when script loads
function run() {
    log("run Enter", true);

    var settingsBtns = ".node_modules--redbubble-design-system-react-Box-styles__box--206r9.node_modules--redbubble-design-system-react-Text-styles__text--NLf2i.node_modules--redbubble-design-system-react-Text-styles__display1--2XY2m";
    waitForElement(settingsBtns, createSaveBtn);
}

//Creates the save button on the page
function createSaveBtn(select) {
    log("createSaveBtn Enter", true);
    var saveButtonElement = '<div><input type="button" value="Save All" class="saveBtn"/></div>'; //saveBtn html
    //run createElements with saveButtonElement as element, and select as append location
    createElements(saveButtonElement, select);
    //Add save() function to btn click
    $('.saveBtn').click(function () {
        save(); //save button function
    });
}

async function save() {
    log("save Enter", true);

    // Select the buttons that open the download menu from the DOM
    const buttons = document.querySelectorAll(".node_modules--redbubble-design-system-react-Button-styles__small--127Kw");
    // For every button found, run the following

    const productArr = [1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 15, 16, 17, 18, 21, 23, 27, 29, 47, 31, 32, 41, 43, 48, 49, 50, 55, 56, 58, 63, 65, 67, 70];

    for (var i = 0; i < buttons.length; i++) {
        if (i != 0) {
            for (var j = 0; j < productArr.length; j++) {
                if (i == productArr[j]) {
                    buttons[i].click();
                    await sleep(50);
                    const download = document.querySelector("li[id$=item-0]");
                    download.click();
                    await modal();
                    await sleep(50);
                }
            }
        }
    }

	var outputTxt;
    for (var k = 0; k < urlArr.length; k++) {
        log("urlArr["+k+"]" + urlArr[k]);
		if(k == 0){
			outputTxt = urlArr[k];
			/*
			outputTxt.push(urlArr[k]);
			outputTxt.push("\n");
			*/
		} else {
			outputTxt = outputTxt + "\n" + urlArr[k];
		}
    }

	const urlData = window.location.href.split("/");
	const productID = urlData[urlData.length-1];

	saveLocalFile(outputTxt, productID + "_urls.txt");
}

async function modal() {
    const modal = document.querySelector(".node_modules--redbubble-design-system-react-Modal-ModalCard-styles__card--zujT9");
    await sleep(2000); //Wait for modal to load
    var productTitle = $(".node_modules--redbubble-design-system-react-Box-styles__box--206r9.node_modules--redbubble-design-system-react-Text-styles__text--NLf2i.node_modules--redbubble-design-system-react-Text-styles__display2--3ZwPH.node_modules--redbubble-design-system-react-Box-styles__display-block--2XANJ").text();
    log("Product #" + productNum + " | " + productTitle);
    const images = modal.querySelector("img");
    const sourceImg = images.getAttribute("src");
    urlArr.push(sourceImg);
    const close = document.querySelector("button[aria-label='Dismiss modal']");
    close.click();
    productNum++;
}

//When script loads run();
run();
