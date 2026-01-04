// ==UserScript==
// @name         Google Maps RAP Helper
// @namespace    https://github.com/gncnpk/google-maps-rap-helper
// @version      0.0.7
// @description  Provides enhancements to the "Add a place" and "Edit information" screens on Google Maps.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://www.google.com/local/place/rap/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com/maps
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545479/Google%20Maps%20RAP%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545479/Google%20Maps%20RAP%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
    .bXBVC {
      width: auto !important;
      min-width: 700px !important;
    }
    .VrVhlb {
      padding: 7px 0 !important;
    }
    .oUMFGb {
      padding-bottom: 0 !important;
    }
    .F1scXd {
      padding-top: 0 !important;
    }
    .Fr7WSc {
      margin-top: 0 !important;
      margin-bottom: 8px !important;
    }
    .d8o5Xb.PE43zc {
      display: none !important;
    }
    .d8o5Xb.jkFcB {
      display: none !important;
    }
    .VfPpkd-LgbsSe.ksBjEc.lKxP2d.LQeN7.nbyAjc {
      min-height: 0 !important;
    }
    .VfPpkd-fmcmS-yrriRe-OWXEXe-INsAgc {
      height: 42px !important;
    }
    .NBJ1Qd {
      margin: auto 15px !important;
    }
    .lY28cc {
      height: auto !important;
    }
    .VrVhlb.Ia4Txd {
      padding: 0 !important;
    }
    .VrVhlb.aEENkc {
      padding: 0 !important;
      display: inline-flex !important;
    }
    .M4WCbd {
      padding-top: 14px !important;
    }
    .VfPpkd-NLUYnc-V67aGc.VfPpkd-NLUYnc-V67aGc-OWXEXe-TATcMc-KLRBe {
      padding-top: 5px !important;
    }
    .VfPpkd-fmcmS-yrriRe-W0vJo-fmcmS.VfPpkd-fmcmS-yrriRe-W0vJo-fmcmS-OWXEXe-Rfh2Tc-EglORb {
      margin-top: -5px !important;
      margin-bottom: 6px !important;
    }
    .mY1Jkc {
      display: none !important;
    }
    .gpDxW .oUMFGb {
      padding: 6px 0 !important;
    }
    .oFv6Y {
      padding-top: 0 !important;
    }
    .iYoXh {
      margin: auto !important;
      margin-right: 0 !important;
    }
    .x4Mfpc .diaq0 {
      display: none !important;
    }
    .x4Mfpc .ydfYne {
      display: none !important;
    }
    .VrVhlb .ydfYne {
      display: none !important;
    }
    .VrVhlb .yiBTVd.uftsZ {
      display: none !important;
    }
    .VrVhlb .EwVWYd.iara9 {
      display: none !important;
    }
    .x4Mfpc {
      margin-bottom: 0 !important;
      margin-top: 4px !important;
    }
    .KGC9Kd-YBO6pd {
      margin-left: -10px !important;
    }
    h2.CrxFsf {
      display: none !important;
    }
    .yvieoe {
      height: 36px !important;
    }
  `;
    document.head.appendChild(style);

    function AAP_removeClutteredElements() {
        Array.from(document.getElementsByClassName("oUMFGb")[0].children).slice(0, 2).forEach((e) => {
            e.style = "display:none;"
        });
        Array.from(document.getElementsByClassName("oUMFGb")).slice(3, 6).forEach((e) => {
            e.children[0].style = "display:none;"
        });
        Array.from(document.getElementsByClassName("oUMFGb")[5].children[1].children).slice(0, 2).forEach((e) => {
            e.style = "display:none;"
        });
        document.getElementsByClassName("VfPpkd-fmcmS-yrriRe-W0vJo-RWgCYc")[1].style = "display: none;";
        document.getElementsByClassName("VfPpkd-LgbsSe ksBjEc lKxP2d LQeN7 nbyAjc")[0].className = "VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe LQeN7 ZY937 s73B3c wF1tve Q8G3mf";
    }

    function replaceMapUrl(e) {
        let backgroundImage = e.style.backgroundImage;
        let splitBGImgValue = backgroundImage.split("&signature")[0].split("&map_id=aca41a63adec02d5").join("").split("roadmap");
        let newBackgroundImageUrl = `${splitBGImgValue[0]}hybrid${splitBGImgValue[1]}`
        let splitBGImgValue2 = newBackgroundImageUrl.split("zoom=15");
        let newBackgroundImageUrl2 = `${splitBGImgValue2[0]}zoom=18${splitBGImgValue2[1]}`
        e.style.backgroundImage = newBackgroundImageUrl2;
    }

    function SAE_removeClutteredElements() {}

    function replaceValues() {
        // Replace map imagery with hybrid
        Array.from(document.getElementsByClassName("Mecipb")).forEach((e) => {
            replaceMapUrl(e)
        });
    }

    function AAP_showAllFields() {
        document.getElementsByClassName("vIDuvd IXetx")[0].click()
    }

    function SAE_showAllSmallFields() {
        Array.from(document.getElementsByClassName("VfPpkd-rOvkhd-XPtOyb-hhpA7")[0].children).forEach((e) => {
            if (!e.className.includes("VfPpkd-rOvkhd-XPtOyb-OWXEXe-gk6SMd") && e.innerText.split("\n")[1] !== "Location") {
                e.children[0].click();
            }
        })
    }

    function AAP_compactElements() {
        let claimBusinessJSController = document.getElementsByClassName("VrVhlb Ia4Txd")[0].children[0];
        document.getElementsByClassName("VrVhlb aEENkc")[0].appendChild(claimBusinessJSController)
        claimBusinessJSController.style = "margin-left: 5px";
    }

    function SAE_compactElements() {
        Array.from(document.getElementsByClassName("VrVhlb")).slice(1, 3).forEach((e) => {
            e.children[0].style = "display: flex !important";
            e.children[0].children[0].style = "width: 100% !important"
        });
        Array.from(document.getElementsByClassName("VrVhlb")).slice(4, 5).forEach((e) => {
            e.children[0].style = "display: flex !important";
            e.children[0].children[0].style = "width: 100% !important"
        });
        Array.from(document.getElementsByClassName("VrVhlb")).slice(6, 9).forEach((e) => {
            e.children[0].style = "display: flex !important";
            e.children[0].children[0].style = "width: 100% !important"
        });
        Array.from(document.getElementsByClassName("fliwXd-OWXEXe-V67aGc KGC9Kd-YBO6pd")).forEach((e) => {
            let flagIcon = document.createElement("i");
            flagIcon.className = "google-material-icons notranslate VfPpkd-rOvkhd-Zr1Nwf VfPpkd-rOvkhd-Zr1Nwf-OWXEXe-ssJRIf"
            flagIcon.style = "margin-left: -15px;";
            flagIcon.innerText = "flag";
            flagIcon.title = "Don't know, but this is incorrect";
            e.parentElement.appendChild(flagIcon)
            e.remove();
        })
    }

    function waitForElementAndClick(className, index = 0) {
        const checkForElement = () => {
            const elements = document.getElementsByClassName(className);

            if (elements.length > index) {
                elements[index].click();
                console.log(`Clicked element: ${className}[${index}]`);
                return;
            }

            setTimeout(checkForElement, 1000); // Check again in 1 second
        };

        checkForElement();
    }

    addEventListener("load", () => {
        if (window.location.href.includes("addaplace")) {
            AAP_removeClutteredElements();
            AAP_showAllFields();
            AAP_compactElements();
        } else if (window.location.href.includes("editv2")) {
            SAE_removeClutteredElements();
            SAE_compactElements();
            SAE_showAllSmallFields();
        }
        replaceValues();
        waitForElementAndClick("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe LQeN7 RorPr AQz7gc sspfN s73B3c gopkhf", 0);
    })
})();
