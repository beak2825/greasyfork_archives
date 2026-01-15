// ==UserScript==
// @name    Office_Authentication
// @version  1.3.3
// @description This module customizes the authentication system.
// @license AGPLv3.0
// @grant    none
// @match     https://clients.netafraz.com/admin/*
// @namespace https://clients.netafraz.com
// @downloadURL https://update.greasyfork.org/scripts/526271/Office_Authentication.user.js
// @updateURL https://update.greasyfork.org/scripts/526271/Office_Authentication.meta.js
// ==/UserScript==
// Programmed and developed by Farshad_Mehryar

/*
Applications of this module:
    1. Highlight Repeated Security codes in ticket page.
    2. Detect same Phone Numbers in profile page.
    3. Copy Profile Parameters such as Full-Name & Email & Phones & Address &...
    4. Detect The Wrong Email Address.
*/


(function () {
    'use strict';

    function runScript() {

        //Start========================== Global Vars & Functions ==========================

        function fCopyFunc(fTxt) {
            navigator.clipboard.writeText(fTxt);
            var fDivMsg = document.getElementById("fDivMsg");
            fDivMsg.style.display = "block";
            fDivMsg.style.opacity = "1";
            fDivMsg.innerHTML = `${fTxt + `<br>`}Copied !`;
            setTimeout(function () {
                fDivMsg.style.opacity = "0";
            }, 500);
            setTimeout(function () {
                fDivMsg.style.display = "none";
            }, 1200);
        }
        var fScript = document.createElement("script");
        fScript.innerHTML = fCopyFunc;
        document.body.appendChild(fScript);

        // ==========================

        function fBtnsAddClasses(fBtn) {
            fBtn.classList.add("btn");
            fBtn.classList.add("btn-info");
            fBtn.classList.add("btn-xs");
        }

        var url = location.href;
        var pageNameIncludeQueryStrings = url.substring(url.lastIndexOf('/') + 1);
        var tArray = pageNameIncludeQueryStrings.split("?");
        var pageName = tArray[0];

        //End========================== Global Vars & Functions ==========================

        //========================== Ticket_Page ==========================
        var fSelectTicketStatus;
        if (pageName == "supporttickets.php" && (fSelectTicketStatus = document.getElementById("ticketstatus"))) {

            //Start========================== Highlight Repeated Security codes in ticket page ==========================

            const fDivTicketReplies = document.querySelector("#ticketreplies");
            const fMessageDivs = fDivTicketReplies ? fDivTicketReplies.querySelectorAll("div.message") : [];

            if (fMessageDivs.length > 0) {
                const fWordMap = new Map();

                function fConvertToEnglishDigits(str) {
                    return str
                        .replace(/[\u06F0-\u06F9]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x06F0 + 48))
                        .replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48));
                }

                function fConvertToPersianDigits(str) {
                    return str.replace(/[0-9]/g, d => String.fromCharCode(d.charCodeAt(0) + 1728));
                }
                function fConvertToArabicIndicDigits(str) {
                    return str.replace(/[0-9]/g, d => String.fromCharCode(d.charCodeAt(0) - 48 + 0x0660));
                }

                fMessageDivs.forEach(div => {
                    [div, ...div.querySelectorAll("*")].forEach(element => {
                        element.childNodes.forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                let textContent = node.textContent.trim();
                                let normalizedText = fConvertToEnglishDigits(textContent);
                                const words = normalizedText.match(/(?<!\d)(\d{4,6})(?!\d)/g);
                                if (words) {
                                    const filteredWords = words.filter(w => !['091', '090', '031', '021', '2025', '1404', '2024', '1403', '44177'].includes(w));
                                    filteredWords.forEach(word => {
                                        const normalizedWord = fConvertToEnglishDigits(word);
                                        if (!fWordMap.has(normalizedWord)) {
                                            fWordMap.set(normalizedWord, new Set());
                                        }
                                        fWordMap.get(normalizedWord).add(node);
                                    });
                                }
                            }
                        });
                    });
                });

                const fColors = ["yellow", "lightblue", "lightgreen", "lightpink", "orange", "violet", "cyan", "magenta", "lightgray", "lightcoral"];
                let fColorIndex = 0;
                fWordMap.forEach((nodes, word) => {
                    if (nodes.size > 1) {
                        const fColor = fColors[fColorIndex % fColors.length];
                        fColorIndex++;
                        nodes.forEach(node => {
                            const persianWord = fConvertToPersianDigits(word);
                            const arabicWord = fConvertToArabicIndicDigits(word);
                            const regex = new RegExp(
                                `(?<![\\d\u0660-\u0669\u06F0-\u06F9]|[\\.\\d|\\d\\.])(${word}|${persianWord}|${arabicWord})(?![\\d\u0660-\u0669\u06F0-\u06F9]|[\\.\\d|\\.\\d])`,
                                'g'
                            );
                            const newText = node.textContent.replace(regex, (match) => `<span style="background-color: ${fColor};">${match}</span>`);

                            if (newText !== node.textContent) {
                                const span = document.createElement("span");
                                span.innerHTML = newText;
                                node.replaceWith(span);
                            }
                        });
                    }
                });
            } else {
                console.warn("not found any div.message !");
            }
            //End========================== Highlight Repeated Security codes in ticket page ==========================
        }

        //========================== Ticket_Page ==========================

        //========================== Profile_Page ==========================

        if (pageName == "clientsprofile.php") {

            var fInputPhone1 = document.querySelector('#customfield2');
            var fPhone1 = fInputPhone1.value;
            if (fPhone1.length < 11) {
                fPhone1 = `0${fPhone1}`;
            }
            var fInputPhone2 = document.querySelector('input[name="phonenumber"]');
            var fPhone2 = fInputPhone2.value.replace(/ /g, '');
            fPhone2 = `0${fPhone2}`;

            //Start========================== Copy Profile Parameters ==========================

            var fInputFirstName = document.querySelector('input[name="firstname"]');
            var fInputLastName = document.querySelector('input[name="lastname"]');
            var fInputCompanyName = document.querySelector('input[name="companyname"]');
            var fInputEmail = document.querySelector('input[name="email"]');
            var fInputFax = document.querySelector('input#customfield3');
            var fInputAddress1 = document.querySelector('input[name="address1"]');
            var fInputAddress2 = document.querySelector('input[name="address2"]');
            var fInputCity = document.querySelector('input[name="city"]');
            var fInputState = document.querySelector('[name="state"]');
            var fInputPostalCode = document.querySelector('input[name="postcode"]');
            var fInputMelliCode = document.querySelector('input#customfield13');

            var fUserFullName = `${fInputFirstName.value} ${fInputLastName.value}`;

            var fFullAddress = "";

            if (fInputState.tagName.toLowerCase() == "input" && fInputState.value.length > 0) {
                fFullAddress += `${fInputState.value}`;
            } else if (fInputState.tagName.toLowerCase() == "select") {
                fFullAddress += `${fInputState.options[fInputState.selectedIndex].text}`;
            }

            if (fInputState.value.length > 0) {
                fFullAddress += `${fInputState.value}`;
            }
            if (fInputCity.value.length > 0) {
                fFullAddress += ` - ${fInputCity.value}`;
            }
            if (fInputAddress1.value.length > 0) {
                fFullAddress += ` - ${fInputAddress1.value}`;
            }
            if (fInputAddress2.value.length > 0) {
                fFullAddress += ` - ${fInputAddress2.value}`;
            }
            if (fInputPostalCode.value.length > 0) {
                fFullAddress += ` - با کد پستی ${fInputPostalCode.value}`;
            }
            var fFax = fInputFax.value;
            if (fFax.length < 11) {
                fFax = `0${fFax}`;
            }

            var fProfileParams = [
                fInputFirstName,
                fInputCompanyName,
                fInputEmail,
                fInputFax,
                fInputPhone1,
                fInputPhone2,
                fInputAddress1,
                fInputPostalCode,
                fInputMelliCode,
            ];
            for (var fProfileParam of fProfileParams) {
                var fBtnCopyParamValue = document.createElement("span");
                fBtnsAddClasses(fBtnCopyParamValue);
                fBtnCopyParamValue.style.cssText = `
                                        color: #ffffff;
                                        font-size: large;
                                        padding: 5px;
                                        margin-left: 5px;
                                    `;
                fBtnCopyParamValue.classList.add("far");
                fBtnCopyParamValue.classList.add("fa-copy");
                fProfileParam.parentElement.insertBefore(fBtnCopyParamValue, fProfileParam.nextSibling);
                fProfileParam.style.cssText = `
                                    display: inline-block;
                                    max-width: 250px;
                                `;
                if (fProfileParam === fInputFirstName) {
                    fBtnCopyParamValue.setAttribute("onclick", `fCopyFunc('${fUserFullName}')`);
                } else if (fProfileParam === fInputAddress1) {
                    fBtnCopyParamValue.setAttribute("onclick", `fCopyFunc('${fFullAddress}')`);
                }
                else if (fProfileParam === fInputPhone1) {
                    fBtnCopyParamValue.setAttribute("onclick", `fCopyFunc('${fPhone1}')`);
                }
                else if (fProfileParam === fInputFax) {
                    fBtnCopyParamValue.setAttribute("onclick", `fCopyFunc('${fFax}')`);
                }
                else if (fProfileParam === fInputPhone2) {
                    fBtnCopyParamValue.setAttribute("onclick", `fCopyFunc('${fPhone2}')`);
                }
                else {
                    fBtnCopyParamValue.setAttribute("onclick", `fCopyFunc('${fProfileParam.value}')`);
                }
            }

            //End========================== Copy Profile Parameters ==========================

            //Start========================== Detect same Phone Numbers ==========================

            var fInputsPhones = [fInputPhone1, fInputFax, fInputPhone2];
            for (var fInputphone of fInputsPhones) {
                var fIconPhoneNumbersChecker = document.createElement("i");
                fIconPhoneNumbersChecker.style.cssText = `
                                                    color: rgb(255, 255, 0);
                                                    font-size: xx-large;
                                                    vertical-align: middle;
                                                    padding: 5px;
                                                    margin-left: -46px;
                                                    margin-right: 4px;
                                                    position: relative;
                                                    text-shadow: black 0px 0px 8px;
                                                    box-shadow: red 0px 0px 12px inset;
                                                    border-radius: 30px;
                                                    display: none;
                                                `;
                fIconPhoneNumbersChecker.classList.add("far");
                fIconPhoneNumbersChecker.classList.add("fa-check-circle");
                fInputphone.parentElement.insertBefore(fIconPhoneNumbersChecker, fInputphone.nextSibling);

                if (fInputphone == fInputPhone1 && (fPhone1 == fPhone2 || fPhone1 == fFax)) {
                    fIconPhoneNumbersChecker.style.display = "inline-block";
                }
                if (fInputphone == fInputFax && (fFax == fPhone1 || fFax == fPhone2)) {
                    fIconPhoneNumbersChecker.style.display = "inline-block";
                }
                if (fInputphone == fInputPhone2 && (fPhone2 == fPhone1 || fPhone2 == fFax)) {
                    fIconPhoneNumbersChecker.style.display = "inline-block";
                }
            }

            //End========================== Detect same Phone Numbers ==========================

            //Start========================== Email Address Check ==========================

            var fIconEmailChecker = document.createElement("i");
            fIconEmailChecker.style.cssText = `                                                    
                                            color: #ffff00;
                                            font-size: xx-large;
                                            vertical-align: middle;
                                            padding: 10px;
                                            margin-left: 5px;
                                            margin-right: 4px;
                                            position: relative;
                                            text-shadow: black 0px 0px 10px;
                                            border-radius: 30px;
                                            display: none;
                                            `;
            fIconEmailChecker.classList.add("fas");
            fIconEmailChecker.classList.add("fa-exclamation-triangle");
            fInputEmail.parentElement.insertBefore(fIconEmailChecker, fInputEmail.nextSibling);
            var fRegexEmail = /^(www\..+)|(.+@(?:gimil|gamil|gemil|geil|gail|gemail|gmil|gaiml|gmial|yaho|yhoo|yaoo))\.(?:[a-z]{2,}|com|net|org|ir|edu|gov|info|xyz|tech|store|online|co|us|uk|ca|de|fr|au|jp|cn|it|nl|ru|br|es|mil|museum|aero|io|ai)$/i;

            if (fRegexEmail.test(fInputEmail.value.trim())) {
                fIconEmailChecker.style.display = "inline-block";
            }

            //End========================== Email Address Check ==========================
        }

        //========================== Profile_Page ==========================
    }

    if (document.readyState === "complete") {
        runScript();
    } else {
        document.addEventListener("readystatechange", function () {
            if (document.readyState === "complete") {
                runScript();
            }
        });
    }
})();