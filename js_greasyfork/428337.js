// ==UserScript==
// @name         mdf4
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a download btn to download all availble Pn whenever possible
// @author       DA25
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/428337/mdf4.user.js
// @updateURL https://update.greasyfork.org/scripts/428337/mdf4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function generateLicense(licenseCode) {
        if (!!!licenseCode) {
            throw new Error("License Code is null");
        }
        console.log(`Generating LicenseKey using LicenseCode: ${licenseCode}`);
        let licCodeWoZerosAndDollar = "";
        for (let index = 1; index < licenseCode.length; index++) {
            let licenseChar = licenseCode[index];
            if (licenseChar === "0") {
                licCodeWoZerosAndDollar = licCodeWoZerosAndDollar.concat("1");
            } else {
                licCodeWoZerosAndDollar = licCodeWoZerosAndDollar.concat(licenseChar);
            }
        }
        let midIndex = Math.floor(licCodeWoZerosAndDollar.length / 2);
        let firstHalfLicCode = licCodeWoZerosAndDollar.substring(0, midIndex + 1);
        let secondHalfLicCode = licCodeWoZerosAndDollar.substring(midIndex);
        let firstHalfLicCodeNum = Number(firstHalfLicCode);
        let secondHalfLicCodeNum = Number(secondHalfLicCode);

        let secMinFirstAbs = Math.abs(secondHalfLicCodeNum - firstHalfLicCodeNum);
        let total = secMinFirstAbs * 4;
        let totalStr = String(total);
        let temp3 = "";
        for (let i = 0; i < midIndex + 1; i++) {
            for (let j = 1; j <= 4; j++) {
                let temp2 = parseInt(licenseCode[i + j]) + parseInt(totalStr[i]);
                if (temp2 >= 10) {
                    temp2 = temp2 - 10
                }
                temp3 = temp3.concat(String(temp2));
            }
        }
        console.log(`Generated LicenseKey: ${temp3}`);
        return temp3;
    }

    function generateLicensedVideoUrl(videoUrl, license) {
        if (!!!videoUrl || !!!license) {
            throw new Error("VideoUrl or LicenseKey is null");
        }
        console.log(`Generating LicensedVideoUrl, for VideoUrl: ${videoUrl} using LicenseKey: ${license}`);
        const re = /function\/[0-9]+\//g;
        if (videoUrl.search(re) === -1) {
            console.log("VideoUrl already Licensed", videoUrl);
            return videoUrl;
        }
        let sanitizedVideoUrl = videoUrl.replace(re, "")
        let parts = sanitizedVideoUrl.split("/");
        let vidCode = parts[5].substring(0, 32);
        let licenseResult = license;
        let vidCodeCopy = vidCode;
        for (let index = vidCode.length - 1; index >= 0; index--) {
            let temp = index;
            for (let index2 = index; index2 < licenseResult.length; index2++) {
                temp = temp + parseInt(licenseResult[index2]);
            }
            while (temp >= vidCode.length) {
                temp = temp - vidCode.length;
            }
            let temp2 = "";
            for (let index3 = 0; index3 < vidCode.length; index3++) {
                if (index3 === index) {
                    temp2 = temp2.concat(vidCode[temp]);
                } else if (index3 === temp) {
                    temp2 = temp2.concat(vidCode[index]);
                } else {
                    temp2 = temp2.concat(vidCode[index3]);
                }
            }
            vidCode = temp2
        }
        parts[5] = parts[5].replace(vidCodeCopy, vidCode);
        let videoUrlOutput = parts.join("/");
        console.log("Generated Licensed VideoUrl: ", videoUrlOutput);
        return videoUrlOutput;
    }

    function getVideoUrlsKeys(flashvars) {
        if (!!!flashvars) {
            throw new Error("Flashvars is null");
        }
        console.log(`Extracting VideoUrlKeys using FlashVars`);
        let videoDetectionString = "get_file";
        let videoKeys = [];
        let flashvarsKeys = Object.entries(flashvars);
        for (const [key, value] of flashvarsKeys) {
            if (typeof value === "string") {
                if (value.includes(videoDetectionString)) {
                    videoKeys.push(key);
                }
            }
        }
        console.log("Extracted VideoUrlKeys:", videoKeys);
        return videoKeys;
    }

    function getVideoText(videoKey, flashvars) {
        const videoTextPostfixString = "_text";
        let videoTextKey = videoKey.concat(videoTextPostfixString);
        return flashvars[videoTextKey];
    }

    function getAllLicensedVideos(flashvars) {
        if (!!!flashvars) {
            throw new Error("Flashvars is null")
        }
        console.log("Flashvars available. Getting all LicensedVideos");
        const licenseCodeKey = "license_code";
        let licenseCode = flashvars[licenseCodeKey];
        let license = generateLicense(licenseCode);

        let availableVideoKeys = getVideoUrlsKeys(flashvars);
        let allLicensedVideos = []
        for (const videoKey of availableVideoKeys) {
            let videoUrl = flashvars[videoKey];
            let licensedVideoUrl = generateLicensedVideoUrl(videoUrl, license);
            let videoText = getVideoText(videoKey, flashvars);
            let video = {}
            video["url"] = licensedVideoUrl;
            video["text"] = videoText;
            allLicensedVideos.push(video);
        }
        console.log("Got all LicensedVideos", allLicensedVideos);
        return allLicensedVideos;
    }

    function createdDropdownEle() {
        let dropdownWrapper = document.createElement("div");
        dropdownWrapper.classList.add("dropdown");

        let downloadBtn = document.createElement("button");
        downloadBtn.classList.add("btn", "btn-dark", "btn-sm", "dropdown-toggle");
        downloadBtn.setAttribute("type", "button");
        downloadBtn.setAttribute("data-bs-toggle", "dropdown");
        downloadBtn.innerText = "DA25-Download";

        dropdownWrapper.append(downloadBtn);

        let btnList = document.createElement("ul");
        btnList.classList.add("dropdown-menu", "btn-sm");

        dropdownWrapper.append(btnList);

        console.log("Dropdown Element created");
        return dropdownWrapper;
    }

    function createDownloadEle(url, text) {
        let altAnchorEle = document.createElement("a");
        altAnchorEle.classList.add("dropdown-item", "btn-sm");
        altAnchorEle.setAttribute("href", url);
        altAnchorEle.innerText = text;

        console.log(`Download Element for: ${text} created with url:`, url);
        return altAnchorEle;
    }

    function appendDownloadToDropdown(dropdownEle, downloadEle) {
        let downloadBtnList = dropdownEle.querySelector("ul.dropdown-menu");
        let listItem = document.createElement("li");
        listItem.append(downloadEle);
        downloadBtnList.append(listItem);
        console.log("Download Element appended to Dropdown");
    }

    function attachDropdownToPage(dropdownEle) {
        console.log("Attaching Dropdown Element to Page.")
        let listEle = document.createElement("li");
        listEle.append(dropdownEle);

        let menuList = document.querySelector(".tabs-menu > ul");

        if (!!menuList) {
            menuList.prepend(listEle);
            console.log("Attached Dropdown Element to Video Details Element");
            console.log(menuList);
            console.log(dropdownEle);
            // addBootstrap();
        } else {
            console.log("Video Details Element is not present.")
            document.body.prepend(listEle);
            console.log("Attached Dropdown as first Element of Body");
            console.log(dropdownEle);
            // alert("window.flashvars present but '.tabs-menu > ul' is not");
        }
    }

    function addBootstrapToPage() {
        let head = document.getElementsByTagName("head")[0];
        let bootstrapCssScriptEle = document.createElement("link");
        bootstrapCssScriptEle.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css");
        bootstrapCssScriptEle.setAttribute("rel", "stylesheet");
        bootstrapCssScriptEle.setAttribute("integrity", "sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC");
        bootstrapCssScriptEle.setAttribute("crossorigin", "anonymous");
        head.insertAdjacentElement("beforeend", bootstrapCssScriptEle);

        let body = document.getElementsByTagName("body")[0];
        let bootstrapJsScriptEle = document.createElement("script");
        bootstrapJsScriptEle.setAttribute("src", "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js");
        bootstrapJsScriptEle.setAttribute("integrity", "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM");
        bootstrapJsScriptEle.setAttribute("crossorigin", "anonymous");
        body.insertAdjacentElement("beforeend", bootstrapJsScriptEle);
    }

    function mainFunction() {
        console.log("Inside Main Function");
        if (window.flashvars) {
            console.log("Flashvars are available");
            let videos = getAllLicensedVideos(window.flashvars);
            let dropdownEle = createdDropdownEle();
            for (let video of videos) {
                let downloadEle = createDownloadEle(video.url, video.text);
                appendDownloadToDropdown(dropdownEle, downloadEle);
            }
            attachDropdownToPage(dropdownEle);
        } else {
            console.log("Flashvars are not available");
        }
    }

    function docReady(userFunction) {
        console.log("Checking if Document is Ready");
        // if (document.readyState === "complete" || document.readyState === "interactive") {
        //     console.log("Document is 'complete' or 'interactive'");
        //     setTimeout(() => {
        //         console.log("After timeout of 1 second over. Now running Main Function.")
        //         userFunction();
        //     }, 1);
        // } else {
        //     console.log("Document is NOT yet 'complete' or 'interactive'");
        //     console.log("Adding event listener for 'DOMContentLoaded'")
        //     document.addEventListener("DOMContentLoaded", () => {
        //         console.log("'DOMContentLoaded' event caught. Now running Main Function.")
        //         userFunction()
        //     });
        // }
        console.log("Adding event listener for 'DOMContentLoaded'")
        document.addEventListener("DOMContentLoaded", () => {
            console.log("'DOMContentLoaded' event caught. Now running Main Function.")
            userFunction()
        });

    }

    docReady(mainFunction);

})();
