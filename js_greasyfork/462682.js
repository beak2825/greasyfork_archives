// ==UserScript==
// @name         Lectio Colors++
// @namespace    http://tampermonkey.net/
// @version      1.25.4.1
// @description  Tilpas dine modulers farver med Lectio Colors++
// @author       Rasmus S. J. (rasm472s)
// @match        https://www.lectio.dk/lectio/*
// @license      Do What The F*ck You Want To Public License
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/462682/Lectio%20Colors%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/462682/Lectio%20Colors%2B%2B.meta.js
// ==/UserScript==
/* eslint-disable */

const radMax = 34;

let rainbowEffect = false;

const opMax = 1;

const hScale = 5.73/1.5  //em per hour (module height pr hour)

const url = window.location.href;

const mobile = document.documentElement.style.getPropertyValue("--LectioJSUtils_Mobil") == "Desktop";

const studentPage = url.includes("?laererid") || url.includes("?elevid");

let fagListObj = JSON.parse(GM_getValue('keyFagListObj', JSON.stringify({size: 0})));

(function(){
    'use strict';
    //TODO: color-coordinate based on subjects or classroom id

    function blacklistBeskeder(blacklist){
        const msgs = document.getElementsByTagName('tr');
        if (url.includes("beskeder")){
            for (let i = 0; i < msgs.length; i++) {
                const cols = msgs[i].getElementsByTagName("td");

                if (cols.length > 5) { // Check if at least 5 TD elements exist
                    let msg = [cols[3].textContent.toLowerCase(), cols[4].textContent.toLowerCase(), cols[5].textContent.toLowerCase()];

                    for (let m = 0; m < msg.length; m++){
                        for (let b = 0; b < blacklist.length; b++){
                            if (msg[m].includes(blacklist[b].toLowerCase())){ // Check if the content includes any bad word
                                //msgs[i].remove(); // Remove the element from the DOM
                                msgs[i].style.display = "none";
                                break;
                            }
                        }
                    }
                }
            }
        } else if ((url.includes("forside"))){
            for (let i = 0; i < msgs.length; i++) {
                const cols = msgs[i].getElementsByTagName("td");

                if (cols.length > 2) {
                    let msg = [cols[1].textContent.toLowerCase(), cols[2].textContent.toLowerCase()];

                    for (let m = 0; m < msg.length; m++){
                        for (let b = 0; b < blacklist.length; b++){
                            if (msg[m].includes(blacklist[b].toLowerCase())){
                                //msgs[i].remove();
                                msgs[i].style.display = "none";
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    //blacklistBeskeder(["spørgeskema", "spørgesskema", "spørgsmål", "minut", "sekund", "Undersøgelse", "gym "]);

    //Replace pfp
    function replacePFP(newImg){
        if (newImg == null || studentPage){
            return;
        } else if (newImg.includes(" ")){
            alert("Der skal ikke være mellemrummer i dit link. Prøv igen.");
            return;
        }
        const imgHTML = document.getElementsByClassName("thumber");
        const img = imgHTML[0].querySelector("img");
        //const newImg = prompt("Input linket til det nye billede her:", getColor("pfp"));
        if (img){  //if exists
            updateColor("pfp", newImg);
            GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
            img.src = newImg;

            document.getElementById("s_m_HeaderContent_picctrlthumbimage").addEventListener("click", function() {  //listens for when the pfp is clicked
                //Makes sure that the larger image is also shown
                const bigImgParent = document.getElementById("thumbctrl_largeimg");
                const bigImg = bigImgParent.getElementsByTagName("img")[0];
                bigImg.src = newImg;
                if (bigImg.style.width < bigImg.style.height){
                    bigImg.style.width = "100%";
                } else {
                    bigImg.style.height = "100%";
                }
            });
        }
    }

    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    //replacePFP();
    //This function underlines the current date in the schedule table.
    function underlineCurrentDate() {
        const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
        const currentDate = new Date();
        const day = currentDate.getDate().toString();
        const month = (currentDate.getMonth() + 1).toString();
        const formattedDate = `${day}/${month}`;  //Formated as DD/MM

        $('td').each(function(){
            if ($(this).text().includes("("+formattedDate) && $(this).text().includes(days[currentDate.getDay()])) {
                $(this).css("text-decoration-line","underline")
                    .css("background-color", "#F0F0F0")
                    .css("color","black");
                return;
            }
        });
    }
    underlineCurrentDate();
    //colored subjects

    //This function takes an object 'fagListObj' as input and customizes the colors of the elements on the webpage based on the subject they belong to.
    function customizeColors(fagListObj){
        //Set the opacity of the color to the provided value or 1 by default.
        let opacity = fagListObj.opacity || 1;

        if (!mobile){
            //Iterate over all the divs with class 's2skemabrikcontent' on lectio.
            $('div.s2skemabrikcontent').each(function(){
                //Get the subject name from the span element and replace the spaces with underscore to match the format in the 'fagListObj'.
                const fag = $(this).find('span[data-lectiocontextcard]').first().text().replace(/ /g, "_");
                let textColor = 0;
                const date = new Date();
                let bColor = getColor(fag) + opacityToString(opacity);
                var bcImg;
                var bcColor;
                //If the subject is not present in the 'fagListObj', create a new color for it and add it to the object.
                if (!getColor(fag)){
                    updateColor(fag, getRandomColor());
                    GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
                }

                if (date.getMonth() == 3 && date.getDate() == 1){
                    bcImg = "url('https://rasj.dk/rickroll.gif')";
                } else {
                    bcImg = "none";
                }
                //if light enough
                if (getLuminance(getColor(fag)) < Math.sqrt(1.05 * 0.05) + 0.05){ //- 0.05
                    textColor = 1;
                }

                if ($(this).hasClass("s2cancelled") || $(this).hasClass("s2changed")){
                    $(this).closest(".lec-context-menu-instance").css("border-width",".175em");
                    bColor = $(this).closest(".lec-context-menu-instance").css("borderColor");
                    if ($(this).css("color") != "rgb(0, 0, 0)" && $(this).css("color") != "rgb(255, 255, 255)") {
                        bColor = $(this).css("color");
                    }

                    $(this).closest('.lec-context-menu-instance') //.s2skemabrikInnerContainer
                        .css("background-color", getColor(fag) + opacityToString(opacity))
                        .css("border-color", bColor)
                        .css("border-radius", fagListObj["size"]+"px")
                        .css("outline-style","none");
                }

                else {
                    $(this).closest('.lec-context-menu-instance') //.s2skemabrikInnerContainer
                        .css("background-color", getColor(fag) + opacityToString(opacity))
                        .css("border-color", getColor(fag) + opacityToString(opacity))
                        .css("border-radius", fagListObj["size"]+"px")
                        .css("outline-style","none");
                }
                $(this).closest(".s2skemabrikInnerContainer")
                    .css("background-color", "inherit")
                    .css("background-image", bcImg);

                //$(this).css("text-align", "center");
                //$(this).css("font-weight", "lighter");

                if (url.endsWith("/aktivitetforside2.aspx")) {
                    $(this).closest('.lec-context-menu-instance').css("pointer-events", "none")
                        .css("border-radius", "0px");
                } else if (url.includes("/forside.aspx")) {
                    $(this).closest('.lec-context-menu-instance').css("margin-bottom","3px");
                }

                if (textColor == 0){ //|| url.includes("/aktivitetforside2.aspx")
                    $(this).closest('.s2skemabrikcontent').css("color", "black");
                } else {
                    $(this).closest('.s2skemabrikcontent').css("color", "white");
                }
            });
        }
        else {
            //Iterate over all the divs with class 's2skemabrikcontent' on lectio.
            $('a.s2bgbox').each(function(){
                //Get the subject name from the div element and does fancy stuff to get the correct format in 'fagListObj'.
                const fag = $(this).find('div').first().text().split("▪")[0].replace("bookmark", "").replace("sms", "").split("\n")[1].trim().replace(/ /g, "_");
                let textColor = 0;
                const date = new Date();
                var bcImg;
                var bcColor;
                //If the subject is not present in the 'fagListObj', create a new color for it and add it to the object.
                if (!getColor(fag)){
                    updateColor(fag, getRandomColor());
                    GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
                }

                if (date.getMonth() == 3 && date.getDate() == 1){
                    bcImg = "url('https://rasj.dk/rickroll.gif')";
                } else {
                    bcImg = "none";
                }
                //if too dark
                if (getLuminance(getColor(fag)) < Math.sqrt(1.05 * 0.05) + 0.05){ //magic formula to detect if contrast between txt color and bc color is too low(dark on dark)
                    textColor = 1;
                }

                //Set the background color and remove the background image of the parent element.
                $(this) //.s2skemabrikInnerContainer
                    .css("background-color", getColor(fag) + opacityToString(opacity))
                    .css("border-radius", fagListObj["size"]+"px")
                    .css("border","none");

                $(this)
                    .css("background-color", getColor(fag) + opacityToString(opacity))
                    .css("background-image", bcImg);

                if (textColor == 0 || url.includes("/aktivitetforside2.aspx")){
                    $(this).css("color", "black");
                } else {
                    $(this).css("color", "white");
                }
            });
        }
    }

    function getColor(fag) {
        if (fagListObj[fag]){
            return fagListObj[fag];
        } else {
            return;
        }
    }

    function updateColor(fag, color) {
        fagListObj[fag] = color;
        GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
    }
    //This function converts an opacity value between 0 and 1 to a two-digit hexadecimal string.
    function opacityToString(opacity) {
        //Convert the opacity value to an integer between 0 and 255 using Math.round()
        //Convert the integer to a two-digit hexadecimal string using toString(16)
        //Pad the string with a leading zero if necessary using padStart(2, '0')
        return Math.round(opacity * 255).toString(16).padStart(2, '0');
    }

    //This function generates a random hexadecimal color string.
    function getRandomColor(){
        const letters = '0123456789ABCDEF';  //Define the hexadecimal digits
        let color = '#';
        //Generate a random digit 6 times and append it to the color string
        for (let i = 0; i < 6; i++) {
            color += letters[Math.random() * 16 | 0];
        }
        return color;
    }

    function showColorSettings() {
        //If the color settings panel already exists, toggle it
        const $colorSettingsPanel = $('#color-settings-panel');
        if ($colorSettingsPanel.length > 0) {
            $colorSettingsPanel.toggle();
            return;
        }

        //Create the color settings panel
        const settingsPanel = $('<div>', {
            id: 'color-settings-panel',
            css: {
                position: 'fixed',
                bottom: 'max(2%, 40px)',
                right: '10px',
                zIndex: 9999,
                backgroundColor: 'white',
                border: 'medium solid #0B72D8',
                padding: '10px',
                borderRadius: '7px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'right'
            },
        });
        const visibleSubjects = new Set();
        if (!mobile){
            //Collect the visible subjects
            $('div.s2skemabrikcontent').each(function() {
                const fag = $(this).find('span[data-lectiocontextcard]').first().text().replace(/ /g, '_');
                visibleSubjects.add(fag);
            });
        } else {
            $('a.s2bgbox').each(function() {
                const fag = $(this).find('div').first().text().split("▪")[0].replace("bookmark", "").replace("sms", "").split("\n")[1].trim().replace(/ /g, "_");
                if (fag.includes(".") || fag.includes(":")) {
                    return;
                }
                visibleSubjects.add(fag);
            });
        }
        const colorPickerContainer = $('<div>',{
            marginBottom: '10px',
            ["text-align"]: "center",
            ["vertical-align"]: "top",
        });

        const radInput = $('<input>', {
            type: 'number',
            step: "1",
            value: fagListObj["size"],
            css: { width: '50px'},
            min: "0",
            max: "34",
            change: function () {
                updateColor("size", $(this).val());
            },
        });
        const radLabel = $('<span>', {
            text: "Radius:",
            css: {
                marginRight: '10px',
                marginLeft:"4px",
                padding: '3px',
                fontWeight: "bold",
            },
        });

        const rainbowButton = $('<button>', {
            text: 'Rainbow',
            css: { marginLeft: '10px' }
        });

        async function rainbowshit() {
            const delay = ms => new Promise(res => setTimeout(res, ms));
            let rot = 1;
            $(".s2skemabrik").css("filter","contrast(3)");
            while (rainbowEffect){
                await delay(33); //.033 seconds (30 fps)
                $(".s2skemabrik").css("filter","hue-rotate("+rot.toString()+"deg)");
                rot = (rot + 2) % 360;
            }
            $(".s2skemabrik").css("filter","hue-rotate(0deg)");
            $(".s2skemabrik").css("filter","contrast(1)");
        }

        rainbowButton.on('click', function(e) {
            rainbowEffect = !rainbowEffect;
            rainbowshit();
        });

        const radContainer = $('<div>', {
            css: {
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '10px',
                //border: '1px dashed',
            },
        });

        radContainer.append(radLabel, radInput, rainbowButton);

        const opInput = $('<input>', {
            type: 'number',
            step: "0.01",
            value: fagListObj["opacity"] || 1,
            css: { width: '50px'},
            min: "0",
            max: "1",
            change: function () {
                updateColor("opacity", $(this).val());
            },
        });

        const opLabel = $('<span>', {
            text: "Opacity:",
            css: {
                marginRight: '10px',
                marginLeft: '1px',
                padding: '3px',
                borderRadius: '3px',
                fontWeight: "bold",
            },
        });

        const opContainer = $('<div>', {
            css: {
                display: 'flex',
                alignContent: 'center',
                marginBottom: '10px',
                //border: '1px dashed',
            },
        });

        const pfpButton = $('<button>', {
            text: 'Profil Billede',
            css: { marginLeft: '10px' }
        });

        pfpButton.on('click', function(e) {
            replacePFP(prompt("Input linket til det nye billede her:", getColor("pfp")));
        });

        if (!studentPage){
            opContainer.append(opLabel, opInput, pfpButton);
        } else {
            opContainer.append(opLabel, opInput);
        }
        colorPickerContainer.css("overflow", "atuo");

        colorPickerContainer.append(radContainer, opContainer);
        settingsPanel.append(colorPickerContainer);


        colorPickerContainer.css("overflow", "none");

        //Create the color picker container for each subject
        visibleSubjects.forEach((fag) => {
            if (fag.length === 0) {
                return;
            }
            let color = fagListObj[fag] || getRandomColor();
            if (color[0] != '#') {
                color = getRandomColor();
            }
            updateColor(fag, color);

            const key = fag;

            //if bc too dark

            const subjectNameSpan = $('<span>', {
                text: key.replace(/_/g, ' ').split(' ')[key.replace(/_/g, ' ').split(' ').length - 1] || 'info',
                css: {
                    marginRight: '10px',
                    padding: '3px',
                    borderRadius: '3px',
                    color: 'black'
                },
            });

            if (getLuminance(fagListObj[fag]) < Math.sqrt(1.05 * 0.05) + 0.05){
                subjectNameSpan.css({
                    color: "white"
                })
            }
            const input = $('<input>', {
                type: 'text',
                value: fagListObj[key].toUpperCase(),
                css: { width: '65px' },
                change: function() {
                    fagListObj[key] = $(this).val();
                },
                maxlength: 7
            });

            subjectNameSpan.css("backgroundColor", fagListObj[key])

            const colorPickerContainer = $('<div>',{
                css: { marginBottom: '10px' }
            });

            const randomButton = $('<button>', {
                text: 'Random',
                css: { marginLeft: '10px' }
            });

            randomButton.on('click', function(e) {
                e.preventDefault();
                const newColor = getRandomColor();
                updateColor(key, newColor);
                input.val(newColor);
                subjectNameSpan.css('backgroundColor', newColor);
                GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
                customizeColors(fagListObj);
            });

            colorPickerContainer.append(subjectNameSpan, input, randomButton);
            settingsPanel.append(colorPickerContainer);
        });

        //Create the buttons container
        const buttonsContainer = $('<div>',{
            css: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
        });
        //Create the "Import" and "Export" buttons container
        const importExportContainer = $('<div>', {
            css: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
            },
        });
        //Create the "Update" and "Close" buttons
        const closeButton = $('<button>', {
            text: 'Luk',
            css: { marginLeft: '5px' },
        });
        closeButton.on('click', function() {
            settingsPanel.hide();
        });

        const updateButton = $('<button>', {
            text: 'Opdater',
            css: { marginRight: '5px' }
        });

        updateButton.on('click', function() {
            //Update the fagListObj object with the new values from the input fields
            /*
            settingsPanel.find('input[type="text"]').each(function() {
                const key = $(this).prev('label').text().replace(/ /g, '_');
                updateColor(key, $(this).val());

                //Update the background color of the subject name label
                $(this).siblings('span').css('backgroundColor', fagListObj[key]);
            });

            //Save the updated fagListObj to GM storage
            GM_setValue('keyFagListObj', JSON.stringify(fagListObj));

            //Apply the new colors to the elements
            customizeColors(fagListObj);
            console.log("1");
            */
        });
        updateButton.on('click', function() {
            //Update the fagListObj object with the new values from the input fields
            settingsPanel.find('input[type="text"]').each(function() {
                const key = $(this).prev('label').text().replace(/ /g, '_');
                updateColor(key, $(this).val());

                //Update the background color of the subject name label
                $(this).siblings('span').css('backgroundColor', fagListObj[key]);
            });

            //Save the updated fagListObj to GM storage
            GM_setValue('keyFagListObj', JSON.stringify(fagListObj));

            //Apply the new colors to the elements
            customizeColors(fagListObj);
        });

        updateButton.click();

        //Create the "Import" and "Export" buttons
        const importButton = $('<button>', {
            text: 'Importer',
            css: { marginRight: '5px' }
        });
        importButton.on('click', function() {
            importInput.click();
        });

        let mobVis = "visible";
        if (mobile) {
            mobVis = "hidden";
        }

        const funButt = $('<input>', {
            type: "checkbox",
            id: "fun",
            value: false,
            css: {
                alignSelf: "center",
                visibility: mobVis
            }
        });

        funButt.on('click', function() {
            if (document.getElementById("fun").checked) { //funmode
                $('.s2skemabrik').css("resize", "vertical");
                $('.s2skemabrik').attr("contenteditable","true");
                $('.s2skemabrik').on("click");
            }
            else {
                $('.s2skemabrik').css("resize", "none");
                $('.s2skemabrik').attr("contenteditable","false");
                $('.s2skemabrik').attr("draggable","true");
                $('.s2skemabrik').off("click");
            }
        });

        const exportButton = $('<button>', {
            text: 'Eksporter',
            css: { marginLeft: '5px' }
        });
        exportButton.on('click', function() {
            exportSettings();
        });

        //Create the version label and hyperlink to update
        const versionLabel = $('<label>', {
            html: '<a href="https://rasj.dk/LectioColors++" target="_blank" style="color:grey;">v'+GM_info.script.version+'</a>'
        });

        /*
        const versionLabel = $('<label>', {
            text: 'v' + GM_info.script.version,
            href: 'https://greasyfork.org/en/scripts/462682-lectio-colors',
            css: { color: 'grey' },
        });
        */
        //url: 'https://greasyfork.org/en/scripts/462682-lectio-colors',

        // Append the buttons and version label to the buttons container
        buttonsContainer.append(updateButton, versionLabel, closeButton);

        // Append the "Import" and "Export" buttons to the importExportContainer
        if (url.includes("/SkemaNy.aspx")){
            importExportContainer.append(importButton, funButt, exportButton);
        } else {
            importExportContainer.append(importButton, exportButton);
        }
        // Append the importExportContainer and buttonsContainer to the settings panel
        settingsPanel.append(importExportContainer, buttonsContainer);

        // Append the settings panel to the body
        $('body').append(settingsPanel);
    }


    // This function updates the opacity value in the fagListObj object and applies the updated colors to the page.
    function updateOpacity(opacity) {
        //Updates the opacity value
        fagListObj.opacity = opacity;
        //Saves the updated fagListObj object
        GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
        //Applies the updated colors to the page
        customizeColors(fagListObj);
    }

    //This function exports the current fagListObj object to a text file.
    function exportSettings() {
        const pfpUrl = getColor("pfp");
        updateColor("pfp", "");
        //Get the current fagListObj object from local storage
        const data = JSON.parse(GM_getValue('keyFagListObj', JSON.stringify({size: 0})));
        //Convert the fagListObj object to a JSON string and create a new Blob object with the string data and file type
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: "text/plain;charset=utf8"});
        //Download the Blob object as a text file with the name "lectio-colors-settings.txt"
        saveAs(blob, "lectio-colors-settings.txt");
        updateColor("pfp", pfpUrl);
    }

    //This function imports settings from a selected file and updates the fagListObj object.
    function importSettings(event) {

        const pfpUrl = getColor("pfp");
        updateColor("pfp", "");

        //Get the selected file from the event target
        const file = event.target.files[0];
        //If a file was selected, read its contents
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                let contents = e.target.result;
                // ry to parse the contents as JSON
                try {
                    const data = JSON.parse(contents);
                    //Save the parsed JSON data to local storage and update the fagListObj object
                    GM_setValue('keyFagListObj', JSON.stringify(data));
                    fagListObj = data;
                    //Call the customizeColors function to apply the updated colors to the page
                    customizeColors(fagListObj);
                } catch (error) {
                    alert("Fejl; Forkert fil format. Prøv med en anden fil.");
                }
            };
            reader.readAsText(file);
        }
        updateColor("pfp", pfpUrl);
    }


    function getLuminance(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);

        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }

    function hexToRgb(hex) {
        hex = hex.toString().replace(/^#/, '');
        if (hex.length === 3)
            hex = hex.replace(/(.)/g, '$1$1');
        return hex.match(/.{2}/g).map(function(c) { return parseInt(c, 16); });
    };

    //This function converts an RGB color string to a hexadecimal color string.
    function rgbToHex(rgb) {
        //Define a regular expression for matching RGB color strings
        const rgbRegex = /^rgb\(\s*(-?\d+%?)\s*,\s*(-?\d+%?)\s*,\s*(-?\d+%?)\s*\)$/;
        //Extract the RGB color components from the input string using destructuring
        const [_, r, g, b] = rgbRegex.exec(rgb) || [];
        //Return an empty string if any of the components are undefined
        if (r === undefined || g === undefined || b === undefined) return getRandomColor();
        //Convert each color component to a number between 0 and 255 using a simplified componentFromStr function
        const componentFromStr = str => parseInt(str, 10) || 0;
        const red = componentFromStr(r);
        const green = componentFromStr(g);
        const blue = componentFromStr(b);
        //Combine the RGB color components into a hexadecimal string and return it
        const hex = (red << 16 | green << 8 | blue).toString(16).padStart(6, '0');
        return '#' + hex;
    }


    //This helper function converts a single color component string (e.g., "255" or "50%") to a number between 0 and 255.
    function componentFromStr(numStr, percentStr) {
        let num = parseInt(numStr, 10);
        if (percentStr) {
            num = Math.round(num * 2.55);
        }
        return Math.min(255, Math.max(0, num));
    }


    //Add a settings button
    const settingsButton = $('<button>',{
        text: 'Indstillinger',
        css: {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            zIndex: 9999,
            backgroundColor: '#0b72d8',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }
    });
    settingsButton.on('click', function(){
        showColorSettings();
    });

    const importButton = $('<button>', {
        text: 'Importer',
        css: { marginRight: '5px' }
    });

    const importInput = $('<input>', {
        type: 'file',
        css: { display: 'none' }
    });

    importButton.on('click', function() {
        importInput.click();
    });

    importInput.on('change', function(e) {
        if (window.confirm("Er du sikker på at importere nye farver? \nAlle dine nuværende farver vil blive overskrevet.")){
            importSettings(e);}
    });

    const exportButton = $('<button>', {
        text: 'Eksporter',
        css: { marginRight: '5px' }
    });

    exportButton.on('click', function() {
        exportSettings();
    });

    $('body').append(settingsButton);

    //Check if the current page is the schedule page
    if (document.querySelector('.s2skemabrikcontent')){
        customizeColors(fagListObj);
    }

    if (getColor("pfp")){
        replacePFP(getColor("pfp"));
        //$(".Photo").closest(":img").css("width", "100%");
    }

    if (url.includes("/OpgaverElev.aspx")){ // Colors subjects on handin page
        let elemCont;
        $('td.OnlyDesktop').each(function(){
            elemCont = $(this).children("span").text().replace(/ /g, '_');
            if (getColor(elemCont) && elemCont){
                $(this).css("background-color", getColor(elemCont));
                $(this).css("text-align","center"); //horizontally align
                $(this).css("line-height", $(this).height()+"px"); //vertically align
                if (getLuminance(getColor(elemCont)) < Math.sqrt(1.05 * 0.05) + 0.05){ //magic formula to detect if contrast between txt color and bc color is too low(dark on dark)
                    $(this).css("color", "white");
                }
            }
        });
    }
})();