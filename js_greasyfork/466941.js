// ==UserScript==
// @name         teracloud.jp 다이렉트 다운로드 주소 일괄 복사.
// @namespace    teracloud.jp 다이렉트 다운로드 주소 일괄 복사.
// @match        *://*kita.teracloud.jp/*
// @version      0.1
// @description  teracloud.jp 다이렉트 다운로드 주소를 복사 복사합니다.
// @icon         data:image/png;base64,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
// @author       mickey90427 <mickey90427@naver.com>
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/466941/teracloudjp%20%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%EC%A3%BC%EC%86%8C%20%EC%9D%BC%EA%B4%84%20%EB%B3%B5%EC%82%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466941/teracloudjp%20%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%EC%A3%BC%EC%86%8C%20%EC%9D%BC%EA%B4%84%20%EB%B3%B5%EC%82%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the file names from the webpage, excluding rows containing a folder
    function extractFileNames() {
        var fileNames = [];
        var fileElements = document.querySelectorAll('.dojoxGridRow');
        for (var i = 0; i < fileElements.length; i++) {
            var isFolder = fileElements[i].querySelector('.folder');
            if (!isFolder) {
                var fileNameElement = fileElements[i].querySelector('.dojoxGridCell[idx="1"] .dojoxGridCellData');
                if (fileNameElement) {
                    var fileName = fileNameElement.textContent;
                    fileNames.push(fileName);
                }
            }
        }
        return fileNames;
    }

    // Function to copy the text to the clipboard
    function copyTextToClipboard(text) {
        GM_setClipboard(text);
    }

    // Function to add URL prefix to the file names
    function addURLPrefix(fileNames) {
        var urlPrefix = extractTextFromURL();
        var fileURLs = [];
        for (var i = 0; i < fileNames.length; i++) {
            var fileURL = urlPrefix + fileNames[i];
            fileURLs.push(fileURL);
        }
        return fileURLs;
    }

    // Function to extract the text after "/dav/" in the URL
    function extractTextFromURL() {
        var currentURL = window.location.href;
        var regex = /\/dav\/(.*)/;
        var match = regex.exec(currentURL);
        if (match && match.length > 1) {
            var extractedText = decodeURIComponent(match[1]);
            var result = "https://kita.teracloud.jp/v2/dav/" + extractedText;
            return result;
        }
        return "";
    }

    // Add URL Copy button to the page
    function addURLCopyButton() {
        var button = document.createElement("button");
        button.innerText = "URL 복사";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.left = "10px";
        button.style.zIndex = "9999";
        button.addEventListener("click", function() {
            var fileNames = extractFileNames();
            if (fileNames.length > 0) {
                var fileURLs = addURLPrefix(fileNames);
                var fileURLsText = fileURLs.join("\n");
                copyTextToClipboard(fileURLsText);
                alert("URL이 클립보드에 복사되었습니다!");
            }
        });
        document.body.appendChild(button);
    }

    // Execute the script
    addURLCopyButton();
})();