// ==UserScript==
// @name         Codeforces Worse!
// @version      1.2.1
// @author       阿毛
// @description  CF is CF
// @match        *://*.codeforces.com/*
// @match        *://*.codeforc.es/*
// @grant        none
// @namespace    https://greasyfork.org/users/1205024
// @downloadURL https://update.greasyfork.org/scripts/478402/Codeforces%20Worse%21.user.js
// @updateURL https://update.greasyfork.org/scripts/478402/Codeforces%20Worse%21.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var imgElements = document.getElementsByTagName("img");
    for (var i = 0; i < imgElements.length; i++) {
        var originalUrl = imgElements[i].src;
        var newUrl = "https://cdn.luogu.com.cn/upload/image_hosting/ud2ptdwy.png";
        var matchResult = originalUrl.match(/\/\/codeforces.org\/s\/\d+\/images\/codeforces-sponsored-by-ton.png/);
        if (matchResult) {
            imgElements[i].src = newUrl;
        }
    }

    imgElements = document.getElementsByTagName("img");
    for (i = 0; i < imgElements.length; i++) {
        originalUrl = imgElements[i].src;
        newUrl = "https://cdn.luogu.com.cn/upload/image_hosting/ud2ptdwy.png";
        matchResult = originalUrl.match(/https:\/\/codeforc.es\/menci-orgroot\/s\/\d+\/images\/codeforces-sponsored-by-ton.png/);
        if (matchResult) {
            imgElements[i].src = newUrl;
        }
    }


    var elements = document.getElementsByTagName('*');
    var searchText = "Codeforces";
    for (i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.innerHTML.indexOf(searchText) !== -1) {
            if (element.nodeType === Node.TEXT_NODE) {
                element.nodeValue = element.nodeValue.replace(/Codeforces/g, 'Crossfire');
            } else {
                for (var j = 0; j < element.childNodes.length; j++) {
                    var childNode = element.childNodes[j];
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        childNode.nodeValue = childNode.nodeValue.replace(/Codeforces/g, 'Crossfire');
                    }
                }
            }
        }
    }

    elements = document.getElementsByTagName('*');
    searchText = "CodeForces";
    for (i = 0; i < elements.length; i++) {
        element = elements[i];
        if (element.innerHTML.indexOf(searchText) !== -1) {
            if (element.nodeType === Node.TEXT_NODE) {
                element.nodeValue = element.nodeValue.replace(/CodeForces/g, 'CrossFire');
            } else {
                for (j = 0; j < element.childNodes.length; j++) {
                    childNode = element.childNodes[j];
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        childNode.nodeValue = childNode.nodeValue.replace(/CodeForces/g, 'CrossFire');
                    }
                }
            }
        }
    }

    elements = document.getElementsByTagName('*');
    searchText = "codeforces.org";
    for (i = 0; i < elements.length; i++) {
        element = elements[i];
        if (element.innerHTML.indexOf(searchText) !== -1) {
            if (element.nodeType === Node.TEXT_NODE) {
                element.nodeValue = element.nodeValue.replace(/codeforces.org/g, 'TempURLthe1');
            } else {
                for (j = 0; j < element.childNodes.length; j++) {
                    childNode = element.childNodes[j];
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        childNode.nodeValue = childNode.nodeValue.replace(/codeforces.org/g, 'TempURLthe1');
                    }
                }
            }
        }
    }

    elements = document.getElementsByTagName('*');
    searchText = "codeforces.com";
    for (i = 0; i < elements.length; i++) {
        element = elements[i];
        if (element.innerHTML.indexOf(searchText) !== -1) {
            if (element.nodeType === Node.TEXT_NODE) {
                element.nodeValue = element.nodeValue.replace(/codeforces.com/g, 'TempURLthe2');
            } else {
                for (j = 0; j < element.childNodes.length; j++) {
                    childNode = element.childNodes[j];
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        childNode.nodeValue = childNode.nodeValue.replace(/codeforces.com/g, 'TempURLthe2');
                    }
                }
            }
        }
    }

    elements = document.getElementsByTagName('*');
    searchText = "codeforces";
    for (i = 0; i < elements.length; i++) {
        element = elements[i];
        if (element.innerHTML.indexOf(searchText) !== -1) {
            if (element.nodeType === Node.TEXT_NODE) {
                element.nodeValue = element.nodeValue.replace(/codeforces/g, 'CrossFire');
            } else {
                for (j = 0; j < element.childNodes.length; j++) {
                    childNode = element.childNodes[j];
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        childNode.nodeValue = childNode.nodeValue.replace(/codeforces/g, 'CrossFire');
                    }
                }
            }
        }
    }

    elements = document.getElementsByTagName('*');
    searchText = "'TempURLthe1";
    for (i = 0; i < elements.length; i++) {
        element = elements[i];
        if (element.innerHTML.indexOf(searchText) !== -1) {
            if (element.nodeType === Node.TEXT_NODE) {
                element.nodeValue = element.nodeValue.replace(/'TempURLthe1/g, 'codeforces.org');
            } else {
                for (j = 0; j < element.childNodes.length; j++) {
                    childNode = element.childNodes[j];
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        childNode.nodeValue = childNode.nodeValue.replace(/'TempURLthe1/g, 'codeforces.org');
                    }
                }
            }
        }
    }

    elements = document.getElementsByTagName('*');
    searchText = "'TempURLthe2";
    for (i = 0; i < elements.length; i++) {
        element = elements[i];
        if (element.innerHTML.indexOf(searchText) !== -1) {
            if (element.nodeType === Node.TEXT_NODE) {
                element.nodeValue = element.nodeValue.replace(/'TempURLthe2/g, 'codeforces.com');
            } else {
                for (j = 0; j < element.childNodes.length; j++) {
                    childNode = element.childNodes[j];
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        childNode.nodeValue = childNode.nodeValue.replace(/'TempURLthe2/g, 'codeforces.com');
                    }
                }
            }
        }
    }




})();
