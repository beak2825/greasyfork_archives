// ==UserScript==
// @name    Invoice_Page
// @version  1.1.0
// @grant    none
// @description Adding some useful features to the invoice page
// @license MIT
// @match     https://clients.netafraz.com/admin/invoices.php*
// @namespace https://clients.netafraz.com
// @downloadURL https://update.greasyfork.org/scripts/530167/Invoice_Page.user.js
// @updateURL https://update.greasyfork.org/scripts/530167/Invoice_Page.meta.js
// ==/UserScript==
// Programmed and developed by Farshad Mehryar (@farshad271)

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

//End========================== Global Vars & Functions ==========================

(function () {
    'use strict';

    function runScript() {

        //Start========================== Copy Service And Domain Name ==========================

        var fTextAreaElements = document.getElementsByTagName("textarea");
        var fRegexDates = /\(\d{4}\/\d{2}\/\d{2}\s[-]\s\d{4}\/\d{2}\/\d{2}\)/;
        for (var fTextAreaElement of fTextAreaElements) {
            if (fTextAreaElement.name.includes("description") && fTextAreaElement.name !== "adddescription") {
                var fCopyBtn1 = document.createElement("span");
                fBtnsAddClasses(fCopyBtn1);
                fCopyBtn1.style.cssText = `
                                        right: 25px;
                                        top: 55%;
                                        position: absolute;
                                        `;
                fTextAreaElement.parentElement.insertBefore(fCopyBtn1, fTextAreaElement.nextSibling);
                var fRawDescription = fTextAreaElement.innerHTML;
                var indexOf20 = fRawDescription.indexOf(" (20");
                var fDescription = fRawDescription.slice(0, indexOf20);
                var fDescriptionArray = fDescription.split(" - ");
                for (var j in fDescriptionArray) {
                    fDescriptionArray[j] = fDescriptionArray[j].trim();
                }

                if (fRegexDates.test(fRawDescription) && !fRawDescription.includes("ارتقا")) {
                    if (fRawDescription.includes("سرویس") || fRawDescription.includes("اورانوس")) {
                        fTextAreaElement.style.cssText = `
                                                        min-height: 60px;
                                                        `;
                        var fServiceNameWithDomain = fDescription;
                        var fServiceNameWithoutDomain = "";
                        if (fRawDescription.includes("ایران")) {
                            fServiceNameWithoutDomain = fDescriptionArray[0] + " - " + fDescriptionArray[1];
                        }
                        else {
                            fServiceNameWithoutDomain = fDescriptionArray[0];
                        }

                        var fCopyBtn2 = document.createElement("span");
                        fBtnsAddClasses(fCopyBtn2);
                        fCopyBtn2.style.cssText = `
                                                right: 180px;
                                                top: 55%;
                                                position: absolute;
                                                `;
                        fTextAreaElement.parentElement.insertBefore(fCopyBtn2, fTextAreaElement.nextSibling);
                        fCopyBtn1.innerText = "Service Name + Domain";
                        fCopyBtn2.innerText = "Service Name";
                        fCopyBtn1.setAttribute("onclick", `fCopyFunc('${fServiceNameWithDomain}')`);
                        fCopyBtn2.setAttribute("onclick", `fCopyFunc('${fServiceNameWithoutDomain}')`);

                        //========================== copy price ==========================
                        
                        var td1 = fTextAreaElement.parentElement;
                        var td2 = td1.nextSibling;
                        var fPriceField = td2.querySelector('input');                        
                        var fCopyPrice = document.createElement("span");
                        fBtnsAddClasses(fCopyPrice);
                        fCopyPrice.style.cssText = `
                                        color: #ffffff;
                                        font-size: large;
                                        padding: 5px;
                                        margin-left: -10px;
                                    `;
                        fCopyPrice.classList.add("far");
                        fCopyPrice.classList.add("fa-copy");
                        fPriceField.parentElement.insertBefore(fCopyPrice, fPriceField.nextSibling);
                        fPriceField.style.cssText = `
                                    display: inline-block;                                    
                                `;
                        fCopyPrice.setAttribute("onclick", `fCopyFunc('${fPriceField.value.trim()}')`);

                        //========================== copy price ==========================
                    }
                }
                if (/دامنه|Renewal/.test(fRawDescription)) {
                    if (fRegexDates.test(fRawDescription) || /انتقال دامنه/.test(fRawDescription)) {
                        fTextAreaElement.style.cssText = `
                                                        min-height: 60px;
                                                        `;
                        fCopyBtn1.innerText = "Copy Domain Name";
                        var fDomainName = fDescriptionArray[1];
                        fCopyBtn1.setAttribute("onclick", `fCopyFunc('${fDomainName}')`);
                    }
                }
            }
        }

        //End========================== Copy Service And Domain Name ==========================
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