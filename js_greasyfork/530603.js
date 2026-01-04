// ==UserScript==
// @name    Comparison_of_Phones_In_Profile_Page
// @version  1.0.0
// @description This module compares phone numbers and provides the possibility to copy them with just one click. 
// @license AGPLv.3
// @grant    none
// @namespace https://clients.netafraz.com
// @match     https://clients.netafraz.com/admin/clientsprofile.php*
// @downloadURL https://update.greasyfork.org/scripts/530603/Comparison_of_Phones_In_Profile_Page.user.js
// @updateURL https://update.greasyfork.org/scripts/530603/Comparison_of_Phones_In_Profile_Page.meta.js
// ==/UserScript==
// Programmed and developed by Farshad Mehryar

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
    }, 3000);
}

function fBtnsAddClasses(fBtn) {
    fBtn.classList.add("btn");
    fBtn.classList.add("btn-info");
    fBtn.classList.add("btn-xs");
}

//End========================== Global Vars & Functions ==========================


(function () {
    'use strict';

    function runScript() {
        
        var url = location.href;
        var pageNameIncludeQueryStrings = url.substring(url.lastIndexOf('/') + 1);
        var tArray = pageNameIncludeQueryStrings.split("?");
        var pageName = tArray[0];
        if (pageName == "clientsprofile.php") {

            var fTd = document.querySelector('table.form > tbody:nth-child(1) > tr:nth-child(22) > td:nth-child(2)');
            var fClientSelect = document.querySelector('.client-dropdown-container');
            var fInputPhone1 = document.querySelector('#customfield2');
            var fPhone1 = fInputPhone1.value;
            var fInputPhone2 = document.querySelector('input[name="phonenumber"]');
            var fPhone2 = fInputPhone2.value.replace(/ /g, '');
            var fBtn_copyPhone1 = document.createElement("span");
            var fBtn_copyPhone2 = document.createElement("span");
            fBtnsAddClasses(fBtn_copyPhone1);
            fBtnsAddClasses(fBtn_copyPhone2);
            fBtn_copyPhone1.style.cssText = `
                                    padding: 10px 50px;
                                    margin: -60px 0 0 0;
                                    background-color: #00752E;
                                    font-weight: bold;
                                    display: block;
                                    position: relative;
                                    float: right;
                                    `;
            fBtn_copyPhone2.style.cssText = `
                                    padding: 10px 50px;
                                    margin: -60px 240px 0 0;
                                    background-color: #990909;
                                    font-weight: bold;
                                    display: block;
                                    position: relative;
                                    float: right;
                                    `;

            fBtn_copyPhone1.innerText = "شماره تلفن اصلی را کپی کن";
            fBtn_copyPhone2.innerText = "شماره تلفن دوم را کپی کن";
            fClientSelect.parentElement.appendChild(fBtn_copyPhone1);
            fClientSelect.parentElement.appendChild(fBtn_copyPhone2);
        }
        fBtn_copyPhone1.addEventListener("click", () => {
            var fphoneNumber = fPhone1;
            if (fphoneNumber.length < 11) {
                fphoneNumber = `0${fphoneNumber}`;
            }
            fCopyFunc(fphoneNumber);
        });
        fBtn_copyPhone2.addEventListener("click", () => {
            fCopyFunc(`0${fPhone2}`);
        });

        //==========================

        var fPhoneNumberCheck = document.createElement("span");
        fPhoneNumberCheck.innerText = "شماره ها یکسان است !";
        fPhoneNumberCheck.style.cssText = `
                            padding: 10px 0;
                            margin: 0 0 10px 0;
                            background-color: #87CFD2;
                            font-weight: bold;
                            display: none;
                            text-align: center;
                            direction: rtl;
                            `;
        var fDivParent = document.querySelector("#contentarea > div:nth-child(1)");
        fDivParent.insertBefore(fPhoneNumberCheck, fDivParent.children[2]);
        var fPhone11 = fPhone1;
        var fphone22 = fPhone2;
        if (fPhone11.charAt(0) == '0') {
            fPhone11 = fPhone11.substring(1);
        }
        if (fPhone11 == fphone22) {
            fPhoneNumberCheck.style.display = "block";
            fBtn_copyPhone2.style.display = "none";
        }
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