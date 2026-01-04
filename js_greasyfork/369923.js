// ==UserScript==
// @name         [KissAnime] Captcha Solver
// @namespace    https://greasyfork.org/en/users/193865-westleym
// @author       WestleyM
// @version      2019.4.3
// @icon         http://kissanime.ru/Content/images/favicon.ico
// @description  Saves initial responses to KissAnime captcha and auto-selects images if it knows the answer.
// @grant        none
// @include      *://kissanime.ru/Special/AreYouHuman2*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369923/%5BKissAnime%5D%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/369923/%5BKissAnime%5D%20Captcha%20Solver.meta.js
// ==/UserScript==

function main() {
    //Variable declarations
    var currentVersion = "2018.10.15";
    var installText = "Thank you for installing [KissAnime] Captcha Solver!";
    var updateText = "Updated to version 2019.4.3.  I no longer actively update this script.  I can't guarantee support if KA changes things again.\nThe best way to reach me is on Reddit @WarriorSolution";
    var $ = window.jQuery;
    var formVerify = document.getElementById("formVerify1");
    var words = [], undefinedWords = [], unknownWords = [], knownWords = [],
        imageSrc = [], clickImage = [], imageData = [], imageElements = [], multiImageFlag = [];
    var matchFound = 0, count = 0, impExpFlag = 0, askedForHelp = 0, PHObjFlag = 0;
    var wordImagePairs = {}, wordsObj = {}, imageObj = {}, clickedImgs = {}, placeholderObjOne = {}, placeholderObjTwo = {};
    var dataURL = "";
    var impExpButton, inputSubmit, exportButton,
        firstDiv, PElements, thirdPElement, alertBoxDiv,
        alertBoxText, importExport, inputJSON, lineSeparator,
        exportDirections, exportBox; //Variables used for created HTML elements

    if (formVerify === null) {
        var link = document.getElementsByTagName("a");
        link = link[0];
        if (localStorage.getItem("KCS-lastDescriptions") != null) {
            wordsObj = JSON.parse(localStorage.getItem("KCS-lastDescriptions"));
            localStorage.removeItem(wordsObj.firstWord);
            localStorage.removeItem(wordsObj.secondWord);
            localStorage.removeItem("KCS-lastDescriptions");
            console.log("Deleted the last two entries.");
        }
        console.log("Redirecting page. . . .");
        link.click();
    }


    if (formVerify != null) { //User is on the regular captcha page
        //Alerts for initial install or update of the script
        if (localStorage.getItem("KCS-version") === null && localStorage.getItem("version") === null) { messagePusher("install"); }
        if (localStorage.getItem("KCS-version") != currentVersion && localStorage.getItem("KCS-version") != null) { messagePusher("update"); }
        if (localStorage.getItem("KCS-version") === null && localStorage.getItem("version") != null) { messagePusher("update"); }

        //Image onclick events
        imageElements = $("#formVerify1").find("img").toArray();
        imageElements.forEach(function(currentImage, imageIndex) { currentImage.onclick = function() { onClickEvents("image", currentImage, imageIndex); } });

        //Create custom HTML
        customHTML();

        //Import/Export onclick function calls
        impExpButton.onclick = function() { onClickEvents("impExpButton") };
        inputSubmit.onclick = function() { onClickEvents("inputSubmit") };
        exportButton.onclick = function() { onClickEvents("exportButton") };

        //Avoid conflicts, start main processes
        this.$ = this.jQuery = jQuery.noConflict(true);
        $(document).ready(function() {
            wordGrabber();
            unknownWordGrabber();
            knownWordGrabber();
            imageGrabber();
            clickImages();

            console.log("Unknown words: " + unknownWords);
            console.log("Known words: " + knownWords);
            if (unknownWords[0] != undefined) { //Ask for help with the first unknown word
                askForHelp(unknownWords[0]);
            }
        });
    }



    //Functions
    function askForHelp(word) { //Asks you to select an answer when the script doesn't know.
        alertBoxText.innerText = "Please select image: " + word;
        localStorage.setItem("KCS-helpWord", word);
    }

    function unknownWordGrabber() { //Finds the words that the script doesn't know the answer to
        words.forEach(function(word) {
            if(!localStorage.getItem("KCS-" + word)) { //If the solution isn't found in the local storage, it will be added to the "unknownWords" array
                unknownWords.push(word);
            }
        });
    }

    function knownWordGrabber() { //Finds the words that the script knows the answer to
        words.forEach(function(word) {
            if(localStorage.getItem("KCS-" + word)) { //If solution is found in the local storage, it will be added to the "knownWords" array
                knownWords.push(word);
            }
        });
    }

    function wordGrabber() { //Grabs span elements that are children of the "formVerify" form.  This will include the two sections saying what to select.  Ex: "cat, glasses, 0"
        var pElements = $("#formVerify1").find("p").toArray();
        var finalPElement, wordElements;

        pElements.forEach(function(pElement) { //Grabs the p element that contains 2 span elements in it.
            if ($(pElement).find("span").toArray().length === 2) {
                wordElements = $(pElement).find("span").toArray();
            }
        });
        words = [wordElements[0].innerText, wordElements[1].innerText];

        //Saves the descriptions to local Storage
        var lastDescriptions = { "firstWord":wordElements[0].innerText, "secondWord":wordElements[1].innerText };
        var DescJSON = JSON.stringify(lastDescriptions);
        localStorage.setItem("KCS-lastDescriptions", DescJSON);
    }

    function imageGrabber() {
        imageElements.forEach(function(image, index) {
            var objKey = "image" + index.toString();
            var imageData = convertToDataUrl(image);
            imageData = minimiseDataUrl(minimiseDataUrl(minimiseDataUrl(imageData, 5), 4), 3);
            imageObj[objKey] = imageData;
        });
    }

    function convertToDataUrl(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    function minimiseDataUrl(dataUrl,jump) {
        var a = "";
        for(var i = 0; i < dataUrl.length; i=i+jump) {
            a += dataUrl.charAt(i);
        }
        return a;
    }

    function clickImages() {
        knownWords.forEach(function(word) {
            var i = 0;
            for (var key in imageObj) {
                if (localStorage.getItem("KCS-" + word) == imageObj[key]) {
                    $("[indexValue='" + i + "']").click();
                    break;
                } else if (i === Object.keys(imageObj).length-1) {
                    var multiImageDesc = localStorage.getItem("KCS-" + word);
                    var foundFlag = 0;
                    try {
                        JSON.parse(multiImageDesc);
                        for (var j = 0; j < Object.keys(multiImageDesc).length; j++) {
                            if (multiImageDesc[j] === imageObj[key]) {
                                console.log("Description with multiple images found and clicked: " + word);
                                $("[indexValue='" + i + "']").click();
                                foundFlag = 1;
                            }
                        }
                    }
                    catch(err) {}
                    if (foundFlag === 0) {
                        console.log("Description with multiple images found.  Solution unknown: " + word);
                        multiImageFlag.push(word);
                        unknownWords.push(word);
                        knownWords.splice(knownWords.indexOf(word), 1);
                    }
                }
                i++;
            }
        });
    }

    function convertSolutions() {
        var tempVarKey = "";
        var tempVarDesc = "";
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) != "KCS-helpWord" && localStorage.key(i) != "KCS-lastDescriptions" && localStorage.key(i) != "KCS-version") {
                tempVarKey = localStorage.key(i);
                tempVarKey = tempVarKey.replace(/KCS-/g, "");
                tempVarDesc = localStorage.getItem(localStorage.key(i));
                localStorage.removeItem(localStorage.key(i));
                localStorage.setItem("KCS-" + tempVarKey, tempVarDesc);
            }
        }
    }

    function removeBrokenSolutions() {
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.getItem(localStorage.key(i))[0] === "[" || localStorage.getItem(localStorage.key(i)) === undefined || localStorage.getItem(localStorage.key(i)) === "undefined") {
                localStorage.removeItem(localStorage.key(i));
            }
        }
    }

    function messagePusher(type) {
        switch(type) {
            case "install":
                console.log(installText);
                localStorage.removeItem("version");
                localStorage.removeItem("lastDescriptions");
                localStorage.removeItem("helpWord");
                localStorage.setItem("KCS-version", currentVersion);
                break;
            case "update":
                //alert("(You will only see this message once per update)\n\n" + updateText);
                localStorage.removeItem("version");
                localStorage.removeItem("lastDescriptions");
                localStorage.removeItem("helpWord");
                localStorage.setItem("KCS-version", currentVersion);
                convertSolutions();
                removeBrokenSolutions();
                break;
        }
    }

    function customHTML() {
        //Message box
        firstDiv = $("#formVerify1").find("div").toArray()[0];
        firstDiv.style.cssText = "width:100%;"; //The box holding the information at the top was not wide enough originally

        PElements = $(firstDiv).find("p").toArray();
        if (PElements.length === 2) {
            PElements[0].style.cssText = "opacity:0; height:0px; width:100%; line-height:0px; font-size:0px;";
        }
        if (PElements.length === 3) {
            PElements[0].style.cssText = "display: none;";
            PElements[1].style.cssText = "opacity:0; height:0px; width:100%; line-height:0px; font-size:0px;";
        }

        thirdPElement = PElements[PElements.length-1];
        thirdPElement.style.cssText = "opacity:0; height:0px; width:100%; line-height:0px; font-size:0px;"; //Hides where it lists both selection choices.  This is to insure users select the images in the correct order.

        alertBoxDiv = document.createElement("div"); //Creation of div element which will contain the below text element
        alertBoxDiv.style.cssText = "background:#518203; color:white; height:30px; width:100%; line-height:30px; text-align:center;";

        alertBoxText = document.createElement("h3"); //Creation of text element which will say the descriptions of images the script doesn't know the answer to
        alertBoxText.innerText = "Checking data. . . .";
        alertBoxText.style.cssText = "background:#518203; color:white; height:100%; width:100%; text-align:center; font-size: 20px; margin-top:0px;";

        alertBoxDiv.insertAdjacentElement("afterbegin", alertBoxText); //Inserting "alertBoxText" into "alertBoxDiv" at the top
        thirdPElement.insertAdjacentElement("afterend", alertBoxDiv); //Placing "alertBoxDiv" at the end of "mainBlock"

        //Import/Export area
        importExport = document.createElement("div");
        importExport.style.cssText = "display:block; background: #111111; color:white; width:970px; padding:2px; text-align:center; margin-left:auto; margin-right:auto; border:1px solid #2f2f2f;";
        importExport.id = "importExport";

        impExpButton = document.createElement("p");
        impExpButton.style.cssText = "background:#518203; color:white; height:15px; width:960px; margin-top:5px; margin-bottom:5px; text-align:center; font-size: 15px; padding:5px; cursor:pointer;";
        impExpButton.innerText = "[+] Solution List Importing/Exporting";
        impExpButton.id = "impExpButton";

        inputJSON = document.createElement("input");
        inputJSON.type = "text";
        inputJSON.name = "JSON input";
        inputJSON.id = "inputJSON";
        inputJSON.placeholder = "Paste solution here";
        inputJSON.style.cssText = "display:none; width:50%; margin-left:auto; margin-right:auto; margin-bottom:5px;";

        inputSubmit = document.createElement("div");
        inputSubmit.style.cssText = "display:none; background:#518203; color:white; height:20px; width:50%; margin-left:auto; margin-right:auto; margin-bottom:5px; border:1px solid #5a5a5a; cursor:pointer;";
        inputSubmit.innerText = "Submit";
        inputSubmit.id = "inputSubmit";

        lineSeparator = document.createElement("div");
        lineSeparator.style.cssText = "display:none; background:#5f5f5f; height:3px; width:100%; margin-left:auto; margin-right:auto; margin-bottom:5px;";
        lineSeparator.id = "lineSeparator";

        exportButton = document.createElement("div");
        exportButton.style.cssText = "display:none; background:#518203; color:white; height:20px; width:50%; margin-left:auto; margin-right:auto; margin-bottom:5px; border:1px solid #5a5a5a; cursor:pointer;";
        exportButton.innerText = "Export list";
        exportButton.id = "exportButton";

        exportDirections = document.createElement("div");
        exportDirections.style.cssText = "display:none; background:#518203; color:white; height:20px; width:50%; margin-left:auto; margin-right:auto; margin-bottom:5px; border:1px solid #5a5a5a;";
        exportDirections.innerText = "Copy the below data: (triple click to select all)";
        exportDirections.id = "exportDirections";

        exportBox = document.createElement("p");
        exportBox.style.cssText = "display:none; #111111; color:white; width:75%; margin-left:auto; margin-right:auto; margin-top:0px; margin-bottom:5px; text-align:center; font-size:10px; border:1px solid #2f2f2f; word-wrap: break-word; overflow:auto; max-height:500px;";
        exportBox.innerText = "";
        exportBox.id = "exportBox";

        importExport.insertAdjacentElement("afterbegin", impExpButton);
        importExport.insertAdjacentElement("beforeend", inputSubmit);
        inputSubmit.insertAdjacentElement("afterend", lineSeparator);
        lineSeparator.insertAdjacentElement("afterend", exportButton);
        exportButton.insertAdjacentElement("afterend", exportDirections);
        exportDirections.insertAdjacentElement("afterend", exportBox);
        impExpButton.insertAdjacentElement("afterend", inputJSON);
        document.getElementById("containerRoot").insertAdjacentElement("afterend", importExport);
    }

    function onClickEvents(clickedItem, clickedImage, imageIndexValue) {
        switch(clickedItem) {
            case "impExpButton":
                if (impExpFlag === 0) {
                    impExpButton.innerText = "[-] Solution List Importing/Exporting";
                    inputJSON.style.display = "block";
                    inputSubmit.style.display = "block";
                    lineSeparator.style.display = "block";
                    exportButton.style.display = "block";
                    impExpFlag = 1;
                } else {
                    impExpButton.innerText = "[+] Solution List Importing/Exporting";
                    inputJSON.style.display = "none";
                    inputSubmit.style.display = "none";
                    lineSeparator.style.display = "none";
                    exportButton.style.display = "none";
                    exportDirections.style.display = "none";
                    exportBox.style.display = "none";
                    impExpFlag = 0;
                }
                break;
            case "exportButton":
                //Grab data from local storage and convert to JSON string
                for (var i = 0; i < localStorage.length; i++) {
                    if (localStorage.key(i) != "KCS-helpWord" && localStorage.key(i) != "KCS-lastDescriptions" && localStorage.key(i) != "KCS-version") {
                        wordImagePairs[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
                    }
                }
                var wordImagePairsJSON = JSON.stringify(wordImagePairs);
                exportBox.innerText = wordImagePairsJSON;
                exportDirections.style.display = "block";
                exportBox.style.display = "block";
                break;
            case "inputSubmit":
                var inputData = inputJSON.value;
                var currentTemp = "";
                var oldListLength = localStorage.length.toString();
                try {
                    var newCaptchaData = JSON.parse(inputData);
                    Object.keys(newCaptchaData).forEach(function(current) {
                        currentTemp = current.replace(/KCS-/g, ""); //Allows for compatibility between old export lists and new ones.
                        localStorage.setItem("KCS-" + currentTemp, newCaptchaData[current]);
                    });
                    inputSubmit.innerText = "Submitted successfully!  Old/new/changed solutions: " + oldListLength + "/" + localStorage.length.toString() + "/" + Object.keys(newCaptchaData).length;
                    console.log("Solution list has been updated.");
                }
                catch(err) {
                    inputSubmit.innerText = "There was an issue.  Check the console.";
                    console.log("Issue with list upload: " + err);
                }
                removeBrokenSolutions();
                convertSolutions();
                break;
            case "image":
                if ($(clickedImage).attr("class") === "imgCapSelect") {
                    clickedImgs[localStorage.getItem("KCS-helpWord")] = imageIndexValue;
                } else {
                    words.forEach(function(word) {
                        if (imageIndexValue === clickedImgs[word]) {
                            delete clickedImgs[word];
                        }
                    });
                }
                if (Object.keys(clickedImgs).length === words.length) {
                    for (var key in clickedImgs) {
                        if (key !== multiImageFlag[0] && key !== multiImageFlag[1]) {
                            localStorage.setItem("KCS-" + key, imageObj["image" + clickedImgs[key].toString()]);
                        } else {
                            var currentSolution = localStorage.getItem(key);
                            try {
                                JSON.parse(currentSolution);
                                currentSolution[Object.keys(currentSolution).length] = imageObj["image" + clickedImgs[key].toString()];
                            }
                            catch(err) {
                                if (PHObjFlag === 0) {
                                    placeholderObjOne[0] = currentSolution;
                                    placeholderObjOne[1] = imageObj["image" + clickedImgs[key].toString()];
                                    currentSolution = placeholderObjOne;
                                    PHObjFlag = 1;
                                } else if (PHObjFlag === 1) {
                                    placeholderObjTwo[0] = currentSolution;
                                    placeholderObjTwo[1] = imageObj["image" + clickedImgs[key].toString()];
                                    currentSolution = placeholderObjTwo;
                                    PHObjFlag = 2;
                                }
                            }
                            JSON.stringify(currentSolution);
                            localStorage.setItem("KCS-" + key, currentSolution);
                        }
                    }
                    alertBoxText.innerText = "Selections complete.  Loading next page. . . .";
                }
                if (Object.keys(clickedImgs).length < words.length) {
                    words.forEach(function(word, index) {
                        if (clickedImgs[word] === undefined && askedForHelp === 0) {
                            askForHelp(word);
                            askedForHelp = 1;
                        }
                    });
                    askedForHelp = 0;
                }
        }
    }
}

main();
