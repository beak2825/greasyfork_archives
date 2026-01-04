// ==UserScript==
// @name    Customize_Service_and_Domain_Page
// @version  1.1.1
// @description Customize the domain|service page
// @license AGPLv3.0
// @grant    none
// @namespace https://clients.netafraz.com
// @match     https://clients.netafraz.com/admin/clientsservices.php*
// @match     https://clients.netafraz.com/admin/clientsdomains.php*
// @downloadURL https://update.greasyfork.org/scripts/530607/Customize_Service_and_Domain_Page.user.js
// @updateURL https://update.greasyfork.org/scripts/530607/Customize_Service_and_Domain_Page.meta.js
// ==/UserScript==
// Programmed and developed by Farshad Mehryar (@farshad271)

//Start========================== Global Vars & Functions ==========================

function fCopyFunc(fTxt) {
    navigator.clipboard.writeText(fTxt);
    var fDivMsg = document.getElementById("fDivMsg");
    fDivMsg.style.display = "block";
    fDivMsg.style.opacity = "1";
    fDivMsg.innerHTML = fTxt + `<br>` + "Copied !";
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

//==========================

var url = location.href;
var pageNameIncludeQueryStrings = url.substring(url.lastIndexOf('/') + 1);
var tArray = pageNameIncludeQueryStrings.split("?");
var pageName = tArray[0];

//End========================== Global Vars & Functions ==========================

(function () {
    'use strict';

    function runScript() {

        if (pageName == "clientsservices.php" || pageName == "clientsdomains.php") {

            document.getElementsByName("notes")[0].style.height = "250px";

            if (pageName == "clientsservices.php") {

                document.getElementById("inputUsername").readOnly = true;
                let fCheckboxIpStatic = document.querySelector('input[type="checkbox"][name="configoption[6]"]');
                if (fCheckboxIpStatic && fCheckboxIpStatic.checked) {
                    let fTargetDiv = document.querySelector('.row.client-dropdown-container');
                    if (fTargetDiv) {
                        let fMsg = document.createElement('div');
                        fMsg.textContent = "این سرویس دارای آی پی استاتیک است.";
                        fMsg.style.cssText = `
                                        margin-right: 50px;
                                        float: right;
                                        background-color: red;
                                        padding: 4px 200px;
                                        border-radius: 10px;
                                        direction: rtl;
                                        font-weight: bold;
                                        font-size: large;
                                    `;
                        fTargetDiv.insertAdjacentElement('beforeend', fMsg);
                    }
                } else {
                    console.log("this service don't have ip static.");
                }
                var fInputNextduedate = document.querySelector('input#inputNextduedate');
                var fBtnCopyParamValue = document.createElement("span");
                fBtnsAddClasses(fBtnCopyParamValue);
                fBtnCopyParamValue.style.cssText = `
                                        color: #ffffff;
                                        font-size: large;
                                        padding: 5px;
                                        margin-left: -31px;
                                        margin-right: 2px;
                                    `;
                fBtnCopyParamValue.classList.add("far");
                fBtnCopyParamValue.classList.add("fa-copy");
                fInputNextduedate.parentElement.insertBefore(fBtnCopyParamValue, fInputNextduedate.nextSibling);
                fInputNextduedate.style.cssText = `
                                    display: inline-block;
                                    max-width: 160px;
                                `;
                fBtnCopyParamValue.setAttribute("onclick", `fCopyFunc('${fInputNextduedate.value.trim()}')`);
            }
            
            if (pageName == "clientsdomains.php") {
                document.querySelector('input#inputDomainfield\\[1\\]').readOnly = true;
            }
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