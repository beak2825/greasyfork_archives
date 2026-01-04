// ==UserScript==
// @name         arca-simya-helper
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  아카라이브 심야식당 헬퍼
// @author       kiantisan
// @match        https://arca.live/*
// @match        https://kioskloud.io/*
// @match        https://mega.nz/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474912/arca-simya-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/474912/arca-simya-helper.meta.js
// ==/UserScript==


/* *** ########### Switch `base64` string to `normal` string [RG-1] ########### *** */
// ▶▶▶▶ Window/Document fucntion region ▶▶▶▶
window.addEventListener('load', checkingArticle);
// >>>>> current key combination: "SHIFT + ALT + V"
document.addEventListener('keydown', function(event) {
    if (event.shiftKey && event.altKey && event.key === 'V') {
        checkingArticle()
    }
})
// ◀◀◀◀ func region end ◀◀◀◀

// ▶▶▶▶ Main action fucntion region ▶▶▶▶
function doDecoding(inputPattern, articleContent) {
    try {
        let inputString = inputPattern.exec(articleContent.innerHTML)[0];
        inputString = inputString.replace(/-/g, '+');

        while(!!inputPattern.exec(articleContent.innerHTML)){
            let decodedString = "";

            //to solve the multiple encryption
            while (true){
                decodedString = atob(inputString)

                if (decodedString.includes("http")) {
                    break;
                }
                inputString = decodedString;
            }

            if (!isContainMultipleHttp(decodedString)) {
                articleContent.innerHTML = articleContent.innerHTML.replace(inputPattern, `<a href=${decodedString} target='_blank' rel='noreferrer'>${decodedString}</a>`);
            } else {
                let urlsArray = customSplit(decodedString, 'http')
                let encodedTargetElement = findElementsByPattern(inputPattern, articleContent)

                appendLinkTagToTargetElement(encodedTargetElement, urlsArray)

                // prevent infi-loop
                articleContent.innerHTML = articleContent.innerHTML.replace(inputPattern, `<div></div>`);
            }

            if (!!inputPattern.exec(articleContent.innerHTML)) {
                inputString = inputPattern.exec(articleContent.innerHTML)[0];
                inputString = inputString.replace(/-/g, '+');
            }
            console.info('arca-simya-helper :: inf-loop check')
        }
    } catch (e) {
        throw new Error("[RG-1][F001] :: doDecoding function error >> ", e);
    }
}
// ◀◀◀◀ func region end ◀◀◀◀

// ▶▶▶▶ Assist fucntion region ▶▶▶▶
const patternList = [
    /aHR0c[0-9A-Za-z+/-]{30,}[=]{0,2}/, // if start "http" String
    /[0-9A-Za-z]{30,}[=]{0,2}$/, // assist pattern 1
    /[0-9A-Za-z]{30,}[=]{1,2}/, // assist pattern 2
]

const articleContentsElement = "body div.article-body > div.fr-view.article-content"

function checkingArticle() {
    try {
        const articleContent = document.querySelector(articleContentsElement);

        if (!!articleContent) {
            patternList.every((pattern) => {
                if (pattern.test(articleContent.innerHTML)) {
                    doDecoding(pattern, articleContent);
                    return false;
                }
                return true;
            })
        }
    } catch (e) {
        throw new Error("[RG-1][F002] :: checkingArticle function error >> ", e);
    }
}

function isContainMultipleHttp(decodedString) {
    try {
        let httpStringCount = (decodedString.match(/http/g) || []).length;
        return httpStringCount > 1;
    } catch (e) {
        throw new Error("[RG-1][F003] :: isContainMultipleHttp function error >> ", e);
    }
}

function findElementsByPattern(pattern, container) {
    try {
        let elements = container.querySelectorAll('*');
        let matchingElements = [];

        elements.forEach(function(element) {
            if (pattern.test(element.textContent)) {
                matchingElements.push(element);
            }
        });
        return matchingElements;
    } catch (e) {
        throw new Error("[RG-1][F004] :: findElementsByPattern function error >> ", e);
    }
}

function customSplit(originString, separatorString){
    try {
        let splitArray = originString.trim().split(separatorString);

        // Inserted because separatorString disappears after split
        splitArray.shift();

        splitArray = splitArray.map(function(string) {
            return separatorString + string.trim();
        });
        return splitArray
    } catch (e) {
        throw new Error("[RG-1][F005] :: customSplit function error >> ", e);
    }
}

function appendLinkTagToTargetElement(encodedTargetElement, urlsArray){
    try{
        encodedTargetElement.forEach(function(element) {
            urlsArray.map((decodedLink) => {
                let linkElement = document.createElement('a');
                linkElement.href = decodedLink;
                linkElement.target = '_blank';
                linkElement.rel = 'noreferrer';
                linkElement.textContent = decodedLink;

                let brElementUp = document.createElement('br');
                let brElementDown = document.createElement('br');

                element.appendChild(brElementUp);
                element.appendChild(linkElement);
                element.appendChild(brElementDown);
            })
        })
    } catch (e) {
        throw new Error("[RG-1][F006] :: appendLinkTagToTargetElement function error >> ", e);
    }
}
// ◀◀◀◀ func region end ◀◀◀◀
/* *** ########### region end ########### *** */




/* *** ########### Mouse blocking, Press key to encode it, Save clipboard [RG-2] ########### *** */
// ▶▶▶▶ Window/Document fucntion region ▶▶▶▶
document.addEventListener('mouseup', doEncodingOrDecodingAndCopy);
// ◀◀◀◀ func region end ◀◀◀◀

// ▶▶▶▶ Main action fucntion region ▶▶▶▶
function doEncodingOrDecodingAndCopy() {
    try {
        document.addEventListener('keydown', function(event) {
            // >>>>> current key combination: "CTRL + SHIFT + E"
            if (event.ctrlKey && event.shiftKey && event.key === 'E') {
                doEncodingBlockedText()
            }
            // >>>>> current key combination: "CTRL + SHIFT + "Q"
            if (event.ctrlKey && event.shiftKey && event.key === 'Q') {
                doDecodingBlockedText()
            }
        });
    } catch (e) {
        throw new Error("[RG-2][F001] :: doEncodingOrDecodingAndCopy function error", e);
    }
}
// ◀◀◀◀ func region end ◀◀◀◀

// ▶▶▶▶ Assist fucntion region ▶▶▶▶
function getSelectedText() {
    try {
        let selectedText = '';
        if (window.getSelection) {
            selectedText = window.getSelection().toString();
        } else if (document.selection && document.selection.type !== 'Control') {
            selectedText = document.selection.createRange().text;
        }
        return selectedText.replace(/\s+/g, '');
    } catch (e) {
        throw new Error("[RG-2][F002] :: getSelectedText function error >> ", e);
    }
}

function clearSelection() {
    try {
        if (window.getSelection) {
            // if Chrome browser
            if (window.getSelection().empty) {
                window.getSelection().empty();
                // if Firefox browser
            } else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        }
    } catch (e) {
        throw new Error("[RG-2][F003] :: clearSelection function error >> ", e);
    }
}

function copyToClipboard(encodedString) {
    try {
        const tempInput = document.createElement("input");
        tempInput.value = encodedString;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    } catch (e) {
        throw new Error("[RG-2][F004] :: copyToClipboard function error >> ", e);
    }
}

function doEncodingBlockedText() {
    try{
        let selectedText = getSelectedText();
        if (selectedText) {
            event.preventDefault();

            let encodedText = "";
            try {
                encodedText = btoa(selectedText);
            } catch (error) {
                alert('■ arca-simya-helper :: base64 인코딩 오류 메시지 \n\n 텍스트를 base64 인코딩하는데 오류가 발생했습니다. [A001]');
                clearSelection();
                return;
            }

            copyToClipboard(encodedText)

            // Re_block previously selected text
            // if (window.getSelection) {
            //     const foundNode = getSelectedTextNodeIfContaining(selectedText);
            //     if (foundNode) {
            //         const range = document.createRange();
            //         range.selectNodeContents(foundNode);
            //         window.getSelection().removeAllRanges();
            //         window.getSelection().addRange(range);
            //     }
            // } else if (document.selection && document.selection.type !== 'Control') {
            //     tempInput.select();
            // }
        }
    } catch (e) {
        throw new Error("[RG-2][F005] :: doEncodingBlockedText function error >> ", e);
    }
}

function doDecodingBlockedText() {
    try{
        let selectedText = getSelectedText();
        if (selectedText) {
            event.preventDefault();

            let decodedText = "";
            try {
                decodedText = atob(selectedText);
            } catch (error) {
                alert('■ arca-simya-helper :: base64 디코딩 오류 메시지 \n\n 텍스트를 base64 디코딩하는데 오류가 발생했습니다. [A002]');
                clearSelection();
                return;
            }
            copyToClipboard(decodedText)
        }
    } catch (e) {
        throw new Error("[RG-2][F006] :: doDecodingBlockedText function error >> ", e);
    }
}

// function getSelectedTextNodeIfContaining(text) {
//     const body = document.body;
//     const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, false);

//     let foundNode = null;
//     while (walker.nextNode()) {
//         const node = walker.currentNode;
//         if (node.textContent.includes(text)) {
//             foundNode = node;
//             break;
//         }
//     }
//     return foundNode;
// }
// ◀◀◀◀ func region end ◀◀◀◀
/* *** ########### region end ########### *** */




/* *** ########### Automatically Insert Text [RG-3] ########### *** */
// ▶▶▶▶ Window/Document fucntion region ▶▶▶▶
// >>>>> current key combination: "SHIFT + ALT + S"
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.shiftKey && event.key === 'S') {
        doInputCommonPassword()
    }
})
// ◀◀◀◀ func region end ◀◀◀◀

// ▶▶▶▶ Main action fucntion region ▶▶▶▶
const siteList = ['kioskloud', 'mega']
const toFindElementList = [
    '.swal2-input', // when kioskloud
    'div.fm-dialog-new-folder-pad.decryption-key', // when mega 1
    'password-decrypt-input', // when mega 2
]

function doInputCommonPassword() {
    try {
        if (window.location.href.includes(siteList[0])) {
            // foundElement is only input element
            let foundElement = document.querySelector(toFindElementList[0]);
            if (foundElement) {
                setCommonPassword(foundElement)
            }
        }

        if (window.location.href.includes(siteList[1])) {
            // foundElement is only input element
            let foundElementOne = document.querySelectorAll(toFindElementList[1])[1].querySelector('input');
            let foundElementTwo = document.getElementById(toFindElementList[2]);

            if (foundElementOne) {
                setCommonPassword(foundElementOne)
            }

            if (foundElementTwo) {
                setCommonPassword(foundElementTwo)
            }
        }
    } catch (e) {
        throw new Error("[RG-3][F001] :: doInputCommonPassword function error >> ", e);
    }
}

// ▶▶▶▶ Assist fucntion region ▶▶▶▶
const commonPassword = 'smpeople'

function setCommonPassword(foundElement) {
    try {
        foundElement.value = commonPassword;
        foundElement.focus();
    } catch (e) {
        throw new Error("[RG-3][F002] :: setCommonPassword function error >> ", e);
    }
}
// ◀◀◀◀ func region end ◀◀◀◀
/* *** ########### region end ########### *** */




